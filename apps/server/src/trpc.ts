import { initTRPC, TRPCError } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { db } from "@venuehub/db";
import { AuthContext, extractAuthContext } from "./context";

export async function createContext({ req, res }: CreateExpressContextOptions): Promise<AuthContext> {
  return extractAuthContext(req);
}

const t = initTRPC.context<typeof createContext>().create();

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId || !ctx.tenantId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: ctx as Required<AuthContext>,
  });
});

const requireRole = (allowed: string[]) =>
  t.procedure.use(async ({ ctx, next }) => {
    if (!ctx.userId || !ctx.tenantId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    if (!ctx.role || !allowed.includes(ctx.role)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Requires one of: ${allowed.join(", ")}`,
      });
    }
    return next({ ctx: ctx as Required<AuthContext> & { role: string } });
  });

// admin > manager > user (staff)
export const managerProcedure = requireRole(["admin", "manager"]);
export const adminProcedure = requireRole(["admin"]);

export const router = t.router;
