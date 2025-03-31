import React, { memo, useEffect, useMemo } from 'react'
import { FlatList, View } from 'react-native'

import { useAppStore } from '@/app/useAppStore'
import { useIsSignedIn } from '@/features/authenticate/useIsSignedIn'
import { useUserProfile } from '@/features/authenticate/useUserProfile'
import { useMultipleServicesBySlugQuery, useSetFavoriteServiceMutation } from '@/entities/service/service.queries'
import { Service } from '@/entities/service/service.types'
import { SectionTitle } from '@/shared/components/SectionTitle'
import { ServiceCard } from '@/shared/components/ServiceCard'

import { favoriteEvents, FavoriteEventsType } from './favoriteEvents'
import { parseFavorites } from './favoriteUtils'

let count = 0

export function FavoriteServices() {
	const isSignedIn = useIsSignedIn()
	const {
		query: { data: userProfile },
	} = useUserProfile()

	const userFavoriteServiceSlugs = useMemo(
		() => parseFavorites(userProfile?.catalog_favorite),
		[userProfile?.catalog_favorite],
	)

	const { setServicesFavoritesSlugs, servicesFavoritesSlugs } = useAppStore()

	const queries = useMultipleServicesBySlugQuery(servicesFavoritesSlugs)
	const services = useMemo(() => queries.map((query) => query.data).filter(Boolean), [queries])

	const isFetched = queries.some((query) => query.isFetched)
	const isError = queries.every((query) => query.isError)

	useEffect(() => {
		if (servicesFavoritesSlugs.length === 0) {
			setServicesFavoritesSlugs(userFavoriteServiceSlugs)
		}
	}, [setServicesFavoritesSlugs, servicesFavoritesSlugs, userFavoriteServiceSlugs])

	const { mutateAsync } = useSetFavoriteServiceMutation()

	useEffect(() => {
		async function handleFavoriteAdd(slug: string) {
			try {
				setServicesFavoritesSlugs([...servicesFavoritesSlugs, slug])
				await mutateAsync({ slug, isFavorite: true })
			} catch {
				setServicesFavoritesSlugs(servicesFavoritesSlugs.filter((prevSlug) => prevSlug !== slug))
			}
		}

		async function handleFavoriteRemove(slug: string) {
			try {
				setServicesFavoritesSlugs(servicesFavoritesSlugs.filter((prevSlug) => prevSlug !== slug))
				await mutateAsync({ slug, isFavorite: false })
			} catch {
				setServicesFavoritesSlugs([...servicesFavoritesSlugs, slug])
			}
		}

		favoriteEvents.on(FavoriteEventsType.ADD, handleFavoriteAdd)
		favoriteEvents.on(FavoriteEventsType.REMOVE, handleFavoriteRemove)

		return () => {
			favoriteEvents.off(FavoriteEventsType.ADD, handleFavoriteAdd)
			favoriteEvents.off(FavoriteEventsType.REMOVE, handleFavoriteRemove)
		}
	}, [mutateAsync, servicesFavoritesSlugs, setServicesFavoritesSlugs])

	if (!isSignedIn || isError || !isFetched) {
		return null
	}

	console.log(`Renderizou ${++count} vezes`)

	return (
		<View className="gap-4">
			<View className="flex flex-row justify-between items-center px-4">
				<SectionTitle>Meus Favoritos</SectionTitle>
			</View>

			<FlatList
				data={services}
				renderItem={({ item }) => (
					<View className="px-4">
						<ServiceCard key={item.slug} data={{ ...item, title: item.name } as unknown as Service} />
					</View>
				)}
				keyExtractor={(item) => item.slug}
				horizontal
				showsHorizontalScrollIndicator={false}
			/>
		</View>
	)
}

export const MemoizedFavoriteServices = memo(FavoriteServices)
