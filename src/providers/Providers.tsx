'use client'

import { ReactNode, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import I18nProvider from './I18nProvider'
import GlobalSearchProvider from '@/providers/GlobalSearchProvider'
import { FeatureFlagsProvider } from '@/flags/FeatureFlagsProvider'

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
	useEffect(() => {
		if (process.env.NEXT_PUBLIC_ENABLE_MSW === 'true') {
			import('../mocks/browser').then(({ worker }) => {
				worker.start({ onUnhandledRequest: 'bypass' })
			})
		}
	}, [])

	return (
		<QueryClientProvider client={getQueryClient()}>
			{/* Render i18n first to ensure stable context for translations */}
			<I18nProvider>
				<FeatureFlagsProvider>
					<GlobalSearchProvider>{children}</GlobalSearchProvider>
				</FeatureFlagsProvider>
			</I18nProvider>
			{/* <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" /> */}
		</QueryClientProvider>
	)
}
