"use client";

import { QueryClientProvider, QueryClientProviderProps } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import getQueryClient from "@utils/providers/reactQuery/getQueryClient";
import { SessionProvider } from "next-auth/react";
import React from "react";

interface ProvidersProps {
  children: React.ReactNode;
  session: any;
}

export default function Providers({
                                    children,
                                    session,
                                  }: ProvidersProps) {
  const queryClientSingleton = getQueryClient();
  const [queryClient, setQueryClient] = React.useState(queryClientSingleton);
  const queryClientProps: QueryClientProviderProps = {
    client: queryClient,
    children: children,
  };
  return <QueryClientProvider {...queryClientProps}>
    <SessionProvider session={session ? session : null}>
      <ReactQueryStreamedHydration queryClient={queryClientProps.client}>
        {queryClientProps.children}
      </ReactQueryStreamedHydration>
      {process.env.NODE_ENV !== "production" ?? <ReactQueryDevtools initialIsOpen={false} />}
    </SessionProvider>
  </QueryClientProvider>;
}
