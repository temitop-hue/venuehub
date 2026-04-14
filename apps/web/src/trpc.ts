import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@venuehub/server";

export const trpc = createTRPCReact<AppRouter>();
