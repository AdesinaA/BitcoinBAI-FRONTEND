'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 60s to avoid excessive refetching.
        staleTime: 60 * 1000,
        // Retry failed requests with exponential backoff.
        retry: 2,
        // Keep cached data for 5 minutes.
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  }
  // Browser: reuse a singleton client across renders
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

export function QueryProvider({ children }: { children: ReactNode }) {
  // useState guarantees the client is only created once per component instance
  const [queryClient] = useState(getQueryClient)

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
