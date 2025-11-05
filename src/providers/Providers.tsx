'use client'

import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// Minimal providers: only React Query for Sage AI Typesense demo

let queryClient: QueryClient | null = null

function getQueryClient() {
	if (!queryClient) {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					staleTime: 30_000,
					refetchOnWindowFocus: false,
					refetchOnMount: true,
					retry: 3,
				},
				mutations: {
					retry: 0,
				},
			},
		})
	}
	return queryClient
}

type ProvidersProps = {
	children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
	return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>
}
