import { getRevalidationTime } from "@library/utils";
import { QueryClient } from "@tanstack/query-core";
import { cache } from "react";

const getQueryClient = cache(() => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: getRevalidationTime() ?? 5*60*1000, // 5 minutes in ms
      retry: 3,
      retryDelay: 30*1000, // retry after 30 seconds
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
  },
}));
export default getQueryClient;