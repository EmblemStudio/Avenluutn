import React, { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
})

export default ({ children }: { children: ReactElement }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)