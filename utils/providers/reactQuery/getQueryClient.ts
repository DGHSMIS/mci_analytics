import { QueryClient } from "@tanstack/query-core";
import { cache } from "react";
import process from "process";

const getQueryClient = cache(() => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: parseInt(process.env.NEXT_PUBLIC_API_REVALIDATION_TIME ?? "300000"), // 5 minutes in ms
      retry: 3,
      retryDelay: 1000,
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
  },
}));
export default getQueryClient;