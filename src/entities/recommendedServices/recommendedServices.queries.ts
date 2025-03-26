import { useQuery } from '@tanstack/react-query'

import { accessToken } from '@/shared/lib/localToken'

import { getRecommendedServices, getRelevant } from './recommendedServices.api'

const keys = {
	root: (cpf?: string) => ['recommended-services', cpf],
}

export function useRecommendedServicesQuery(cpf?: string) {
	const { data, error, ...rest } = useQuery({
		queryKey: keys.root(cpf),
		queryFn: async () => {
			try {
				if (!cpf) {
					return getRelevant(accessToken.get() || undefined)
				}

				const recommendedResult = await getRecommendedServices(cpf)
				return recommendedResult
			} catch (error) {
				console.warn('[RecommendedServices] Primary endpoint failed:', error)
				return getRelevant(accessToken.get() || undefined)
			}
		},
		enabled: true,
	})

	return {
		...rest,
		error,
		recommendedServices: data?.recommended_services ?? [],
		hasData: (data?.recommended_services?.length ?? 0) > 0,
		isLoading: rest.isLoading,
	}
}
