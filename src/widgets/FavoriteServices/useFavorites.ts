import { useCallback, useEffect, useState } from 'react'

import { useIsSignedIn } from '@/features/authenticate/useIsSignedIn'
import { useUserProfile } from '@/features/authenticate/useUserProfile'
import { serviceQueries } from '@/entities/service'
import { Service } from '@/entities/service/service.types'

import { favoriteEvents, FavoriteEventTypes } from './favoriteEvents'
import { getFavorites, syncProfileFavorites } from './favoritesUtils'

export function useFavorites() {
	const isSignedIn = useIsSignedIn()
	const {
		query: { data: userProfile },
	} = useUserProfile()
	const [favoritesSlugs, setFavoritesSlugs] = useState<string[]>([])
	const [favoriteServices, setFavoriteServices] = useState<Service[]>([])
	// const queryClient = useQueryClient()

	const { mutate: getServices, data: serviceData } = serviceQueries.useServiceQuery(['services', 'favorites'])

	const loadFavorites = useCallback(() => {
		if (!isSignedIn) return

		const storedFavorites = getFavorites()

		if (JSON.stringify(storedFavorites) !== JSON.stringify(favoritesSlugs)) {
			setFavoritesSlugs(storedFavorites)

			if (storedFavorites.length > 0) {
				getServices({
					slugs: storedFavorites,
					groups: ['CATALOG'],
				})
			} else {
				setFavoriteServices([])
			}
		}
	}, [isSignedIn, getServices, favoritesSlugs])

	useEffect(() => {
		if (isSignedIn && userProfile?.catalog_favorite) {
			syncProfileFavorites(userProfile.catalog_favorite)
		}
	}, [isSignedIn, userProfile?.catalog_favorite])

	useEffect(() => {
		if (serviceData?.success && Array.isArray(serviceData.data)) {
			const orderedServices = favoritesSlugs
				.map((slug) => serviceData.data.find((service) => service.slug === slug))
				.filter((service): service is Service => service !== undefined)

			setFavoriteServices(orderedServices)
		}
	}, [serviceData, favoritesSlugs])

	useEffect(() => {
		loadFavorites()
	}, [loadFavorites])

	useEffect(() => {
		if (!isSignedIn) return

		const handleFavoritesUpdated = () => {
			loadFavorites()
		}

		favoriteEvents.on(FavoriteEventTypes.UPDATED, handleFavoritesUpdated)

		return () => {
			favoriteEvents.off(FavoriteEventTypes.UPDATED, handleFavoritesUpdated)
		}
	}, [isSignedIn, loadFavorites])

	return {
		favoritesSlugs,
		favoriteServices,
		hasFavorites: favoriteServices.length > 0 && isSignedIn,
	}
}
