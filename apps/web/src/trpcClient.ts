import { httpBatchLink } from "@trpc/client";
import { QueryClient } from "@tanstack/react-query";
import { trpc } from "./trpc";

export function createTrpcClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 60 * 1000, // 1 minute
      },
    },
  });

  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/trpc`,
        credentials: "include",
        async headers() {
          const token = localStorage.getItem("token");
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
      }),
    ],
  });

  return { trpcClient, queryClient };
}
