import { useMutation, useQueries, useQuery } from '@tanstack/react-query'

import { serviceTypes } from '@/entities/service'
import * as serviceApi from '@/entities/service/service.api'

const keys = {
	root: () => ['gov', 'services'],
}

export function useServiceQuery(key: string[]) {
	return useMutation({
		mutationKey: [...keys.root(), key],
		mutationFn: (variables: serviceTypes.SearchParams) => serviceApi.getService(variables),
		onSuccess: (serviceResult) => {
			if (!serviceResult) return
		},
	})
}

export function useServiceBySlugQuery(slug: string) {
	return useQuery({
		queryKey: [...keys.root(), 'slug', slug],
		queryFn: () => serviceApi.getServiceBySlug(slug),
		enabled: !!slug,
		meta: { cache: false },
	})
}

export function useMultipleServicesBySlugQuery(slugs: string[]) {
	const enabled = slugs.length > 0

	return useQueries({
		queries: slugs.map((slug) => ({
			queryKey: [...keys.root(), 'slug', slug],
			queryFn: () => serviceApi.getServiceBySlug(slug),
			enabled,
			meta: { cache: false },
		})),
	})
}

export function useSetFavoriteServiceMutation() {
	return useMutation({
		mutationKey: [...keys.root(), 'favorite'],
		mutationFn: (variables: { slug: string; isFavorite: boolean }) =>
			serviceApi.setFavoriteService(variables.slug, variables.isFavorite),
	})
}
