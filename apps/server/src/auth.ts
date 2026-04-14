import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
const JWT_SECRET: string = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createJWT(userId: number, tenantId: number, email: string, role: string = "user"): string {
  return jwt.sign(
    { userId, tenantId, email, role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyJWT(token: string): { userId: number; tenantId: number; email: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      userId: decoded.userId,
      tenantId: decoded.tenantId,
      email: decoded.email,
      role: decoded.role || "user",
    };
  } catch {
    return null;
  }
}
