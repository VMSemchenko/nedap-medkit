import { QueryClient } from "@tanstack/react-query";
import { config } from "@/config/env";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: config.query.staleTime,
      gcTime: config.query.gcTime,
      refetchOnWindowFocus: config.query.refetchOnWindowFocus,
    },
  },
});
