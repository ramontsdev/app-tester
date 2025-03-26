import { useQuery } from '@tanstack/react-query'

import * as paycheckApi from '@/entities/paycheck/paycheck.api'

const keys = {
	root: (user?: string) => ['paycheck', user],
}

export function usePayCheckQuery({ enabled = false, user }: { enabled?: boolean; user?: string }) {
	return useQuery({
		queryKey: keys.root(user),
		queryFn: paycheckApi.getPaychecks,
		enabled,
		meta: { cache: false },
	})
}
