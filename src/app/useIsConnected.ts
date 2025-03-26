import * as Network from 'expo-network'
import { useQuery } from '@tanstack/react-query'

const keys = {
	root: () => ['app'],
	isConnected: () => [...keys.root(), 'is-connected'],
}

export function useIsConnected() {
	const query = useQuery({
		queryKey: keys.isConnected(),
		queryFn: Network.getNetworkStateAsync,
	})

	return query?.data?.isConnected ?? false
}
