import { ReactNode } from 'react'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'

import { cachePersister } from '@/shared/lib/cachePersister'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
			gcTime: 1000 * 60 * 60 * 24,
			staleTime: 1000 * 60 * 60 * 24,
		},
	},
})

export function ReactQueryProvider({ children }: { children: ReactNode }) {
	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{
				persister: cachePersister,
				dehydrateOptions: {
					shouldDehydrateQuery: (query) => query.meta?.cache !== false,
					shouldDehydrateMutation: (mutation) => mutation.meta?.cache !== false,
				},
			}}
		>
			{children}
		</PersistQueryClientProvider>
	)
}
