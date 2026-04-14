import type { Request } from "express";
import { verifyJWT } from "./auth";

export interface AuthContext {
  userId?: number;
  tenantId?: number;
  email?: string;
  role?: string;
}

export function extractAuthContext(req: Request): AuthContext {
  const token = req.cookies?.token || (req.headers.authorization?.replace("Bearer ", "") as string | undefined);

  if (!token) {
    return {};
  }

  const decoded = verifyJWT(token);
  if (!decoded) {
    return {};
  }

  return {
    userId: decoded.userId,
    tenantId: decoded.tenantId,
    email: decoded.email,
    role: decoded.role,
  };
}

export function requireAuth(context: AuthContext) {
  if (!context.userId || !context.tenantId) {
    throw new Error("Unauthorized");
  }
  return context as Required<AuthContext>;
}
