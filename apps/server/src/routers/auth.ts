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
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, input.email),
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    const tenantSlug = input.tenantName.toLowerCase().replace(/\s+/g, "-");
    const tenantResult = await db
      .insert(tenants)
      .values({
        name: input.tenantName,
        slug: tenantSlug,
      });

    const tenantId = (tenantResult as any).insertId || 1;

    const hashedPassword = await hashPassword(input.password);
    const userResult = await db
      .insert(users)
      .values({
        tenantId,
        email: input.email,
        password: hashedPassword,
        firstName: input.firstName,
        lastName: input.lastName,
        role: "admin",
      });

    const userId: number = (userResult as any).insertId;

    const token = createJWT(userId, tenantId, input.email, "admin");

    return {
      token,
      user: {
        id: userId,
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        tenantId,
        role: "admin" as string,
      },
    };
  }),

  login: publicProcedure.input(loginInput).mutation(async ({ input }) => {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, input.email),
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await verifyPassword(input.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = createJWT(user.id, user.tenantId, user.email, user.role);

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
