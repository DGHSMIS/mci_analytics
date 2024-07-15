"use client";

import { QueryClient, QueryClientProvider, QueryClientProviderProps } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { SessionProvider } from "next-auth/react";
import React from "react";

interface ProvidersProps {
  children: React.ReactNode;
  session: any;
}
// Create a client
const queryClient:QueryClient = new QueryClient();

export default function Providers({
                                    children,
                                    session,
                                  }: ProvidersProps) {

  const queryClientProps: QueryClientProviderProps = {
    client: queryClient,
    children: children,
  };
  return <QueryClientProvider {...queryClientProps}>
    <SessionProvider session={session ? session : null}>
      {process.env.NODE_ENV == "development" ? <ReactQueryDevtools initialIsOpen={true} /> : <></>}
      <ReactQueryStreamedHydration queryClient={queryClientProps.client}>
        {queryClientProps.children}
      </ReactQueryStreamedHydration>
    </SessionProvider>
  </QueryClientProvider>;
}
