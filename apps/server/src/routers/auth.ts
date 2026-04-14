import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../trpc";
import { db, tenants, users } from "@venuehub/db";
import { eq } from "drizzle-orm";
import { createJWT, hashPassword, verifyPassword } from "../auth";

const signupInput = z.object({
  tenantName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const loginInput = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const authRouter = router({
  register: publicProcedure.input(signupInput).mutation(async ({ input }) => {
    try {
      // Check if email already exists
      const existingUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, input.email),
      });

      if (existingUser) {
        throw new Error("Email already registered");
      }

      // Create tenant
      const tenantSlug = input.tenantName.toLowerCase().replace(/\s+/g, "-");
      const tenantResult = await db
        .insert(tenants)
        .values({
          name: input.tenantName,
          slug: tenantSlug,
        });

      // Get tenant ID from insert result
      const tenantId = (tenantResult as any).insertId || 1;

      // Create user
      const hashedPassword = await hashPassword(input.password);
      const userResult = await db
        .insert(users)
        .values({
          tenantId,
          email: input.email,
          password: hashedPassword,
          firstName: input.firstName,
          lastName: input.lastName,
          role: "admin", // First user is admin
        });

      // Get user ID from insert result
      const userId = (userResult as any).insertId;

      // Create JWT
      const token = createJWT(userId, tenantId, input.email, "admin");

      return {
        token,
        user: {
          id: userId,
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          tenantId,
        },
      };
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(error.message || "Registration failed");
    }
  }),

  login: publicProcedure.input(loginInput).mutation(async ({ input }) => {
    try {
      // Find user
      const foundUsers = await db.query.users.findMany({
        where: (users, { eq }) => eq(users.email, input.email),
      });

      if (foundUsers.length === 0) {
        throw new Error("Invalid email or password");
      }

      const user = foundUsers[0];

      // Verify password
      const isPasswordValid = await verifyPassword(input.password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      // Create JWT
      const token = createJWT(user.id, user.tenantId, user.email, user.role || "user");

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          tenantId: user.tenantId,
          role: user.role,
        },
      };
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Login failed");
    }
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.userId),
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      tenantId: user.tenantId,
      role: user.role,
    };
  }),
});
