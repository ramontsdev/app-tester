import { useCallback, useEffect, useState } from 'react'
import { FlatList, View } from 'react-native'

import { useIsSignedIn } from '@/features/authenticate/useIsSignedIn'
import { useUserProfile } from '@/features/authenticate/useUserProfile'
import { serviceQueries } from '@/entities/service'
import { Service } from '@/entities/service/service.types'
import { SectionTitle } from '@/shared/components/SectionTitle'
import { ServiceCard } from '@/shared/components/ServiceCard'
import { mmkvStorage } from '@/shared/lib/localStorage'

const parseFavorites = (jsonStr: string | undefined | null): string[] => {
	if (!jsonStr) return []
	try {
		const parsed = JSON.parse(jsonStr)
		if (Array.isArray(parsed)) {
			return parsed.filter((item): item is string => typeof item === 'string')
		}
		return []
	} catch (error) {
		return []
	}
}

export function FavoriteServices() {
	const isSignedIn = useIsSignedIn()
	const {
		query: { data: userProfile },
	} = useUserProfile()
	const [favoritesSlugs, setFavoritesSlugs] = useState<string[]>([])
	const [localServices, setLocalServices] = useState<Service[]>([])
	const { mutate: getServices, data: serviceData } = serviceQueries.useServiceQuery(['services', 'favorites'])

	const updateFavorites = useCallback(() => {
		const favorites = mmkvStorage.getString('favorites')
		const storedFavorites = parseFavorites(favorites)
		setFavoritesSlugs(storedFavorites)

		if (storedFavorites.length > 0) {
			getServices({
				slugs: storedFavorites,
				groups: ['CATALOG'],
			})
		} else {
			setLocalServices([])
		}
	}, [getServices])

	useEffect(() => {
		if (!isSignedIn) return

		if (serviceData?.success && Array.isArray(serviceData.data)) {
			const orderedServices = favoritesSlugs
				.map((slug) => serviceData.data.find((service) => service.slug === slug))
				.filter((service): service is Service => service !== undefined)
			setLocalServices(orderedServices)
		}
	}, [serviceData, favoritesSlugs, isSignedIn])

	useEffect(() => {
		if (!isSignedIn) return

		const favorites = mmkvStorage.getString('favorites')
		let storedFavorites = parseFavorites(favorites)

		if (!storedFavorites.length && userProfile?.catalog_favorite) {
			const profileFavorites = parseFavorites(userProfile.catalog_favorite)
			if (profileFavorites.length) {
				storedFavorites = profileFavorites
				mmkvStorage.set('favorites', JSON.stringify(profileFavorites))
			}
		}

		setFavoritesSlugs(storedFavorites)

		if (storedFavorites.length > 0) {
			getServices({
				slugs: storedFavorites,
				groups: ['CATALOG'],
			})
		}
	}, [isSignedIn, userProfile?.catalog_favorite, getServices])

	useEffect(() => {
		if (!isSignedIn) return

		const checkInterval = setInterval(updateFavorites, 1000)
		return () => clearInterval(checkInterval)
	}, [isSignedIn, updateFavorites])

	if (!isSignedIn || !favoritesSlugs.length || !localServices.length) {
		return null
	}

	return (
		<View className="gap-4">
			<View className="flex flex-row justify-between items-center px-4">
				<SectionTitle>Meus Favoritos</SectionTitle>
			</View>

			<FlatList
				data={localServices}
				renderItem={({ item }) => (
					<View className="px-2">
						<ServiceCard key={item.slug} data={item} isFavorite={favoritesSlugs.includes(item.slug)} />
					</View>
				)}
				keyExtractor={(item) => item.slug}
				horizontal
				showsHorizontalScrollIndicator={false}
			/>
		</View>
	)
}
