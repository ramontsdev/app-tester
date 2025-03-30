import { useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { router } from 'expo-router'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
	faCar,
	faDollar,
	faGraduationCap,
	faShieldHalved,
	faStar,
	faStar as faStarOutline,
	faUser,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useQueryClient } from '@tanstack/react-query'

import { defaultTheme } from '@/app/styles/theme'
import { favoriteEvents, FavoriteEventTypes } from '@/widgets/FavoriteServices/favoriteEvents'
import { useOpenGlobalLoading } from '@/widgets/GlobalLoding'
import { useIsSignedIn } from '@/features/authenticate/useIsSignedIn'
import { Service } from '@/entities/service/service.types'
import { mmkvStorage } from '@/shared/lib/localStorage'
import { cn } from '@/shared/utils/cn'

import { FavoriteErrorBottomSheet, FavoriteSuccessBottomSheet } from './BottomSheets'
import { Text } from './Text'
import { Touchable } from './Touchable'

library.add(faCar, faDollar, faGraduationCap, faShieldHalved, faUser, faStarOutline)

const iconMap: { [key: string]: any } = {
	'graduation-cap': faGraduationCap,
	car: faCar,
	dollar: faDollar,
	'shield-halved': faShieldHalved,
	user: faUser,
}

interface ServiceCardProps {
	data: Service
	className?: string
	isFavorite?: boolean
}

function parseFavorites(favorites?: string | null): string[] {
	if (!favorites) return []
	try {
		const parsed = JSON.parse(favorites)
		if (Array.isArray(parsed)) {
			return parsed.filter((item: unknown): item is string => typeof item === 'string')
		}
		return []
	} catch {
		return []
	}
}
export function ServiceCard({ data, className = '', isFavorite = false }: ServiceCardProps) {
	const isSignedIn = useIsSignedIn()
	const [isStarred, setIsStarred] = useState(false)
	const queryClient = useQueryClient()
	const iconName = data.icon.slice(3)
	const globalLoding = useOpenGlobalLoading()

	const favorites = mmkvStorage.getString('favorites')
	const favoritesList = parseFavorites(favorites)

	useEffect(() => {
		setIsStarred(favoritesList.includes(data.slug))
	}, [favoritesList, data.slug])

	function handlePress() {
		if (isSignedIn) {
			goToService(data.link, data.title, data.slug, data.icon, data.category)
			return
		}

		router.push({
			pathname: '/service/service-details',
			params: {
				uri: data.link,
				name: data.title,
				slug: data.slug,
				icon: data.icon,
				category: data.category,
			},
		})
	}

	function handleFavoritePress() {
		const newState = !isStarred
		setIsStarred(newState)

		try {
			const favorites = mmkvStorage.getString('favorites')
			let favoritesList = parseFavorites(favorites)

			if (newState) {
				if (!favoritesList.includes(data.slug)) {
					favoritesList.push(data.slug)
				}
			} else {
				favoritesList = favoritesList.filter((slug) => slug !== data.slug)
			}

			mmkvStorage.set('favorites', JSON.stringify(favoritesList))

			favoriteEvents.emit(FavoriteEventTypes.UPDATED)

			queryClient.setQueryData(['services', 'favorites'], {
				success: true,
				data: favoritesList,
			})
		} catch (error) {
			console.error('Erro ao atualizar favoritos:', error)
			setIsStarred(!newState)
			TrueSheet.present('favorite-error')
		}
	}

	function goToService(uri: string, name: string, slug: string, icon: string, category?: string) {
		globalLoding.openGlobalLoading([`Acessando serviço ${name}`, 'Aguarde'], {
			nextRoute: '/service/webView',
			routeParams: {
				uri,
				name,
				slug,
				icon,
				category,
			},
		})
	}

	useEffect(() => {
		function handleFavoriteUpdated() {
			const favorites = mmkvStorage.getString('favorites')
			const favoritesList = parseFavorites(favorites)
			setIsStarred(favoritesList.includes(data.slug))
		}

		favoriteEvents.on(FavoriteEventTypes.UPDATED, handleFavoriteUpdated)

		return () => {
			favoriteEvents.off(FavoriteEventTypes.UPDATED, handleFavoriteUpdated)
		}
	}, [data.slug])

	return (
		<>
			<Touchable
				onPress={handlePress}
				className={cn(
					'w-44 h-[120px] p-4 gap-3 justify-start rounded-2xl bg-[#F8F9FC] shadow-md mb-2 ios:shadow-sm',
					className,
				)}
			>
				<View className="flex flex-row justify-between items-center">
					<View className="w-7 h-7 rounded-md justify-center items-center bg-primary-100">
						<FontAwesomeIcon icon={iconMap[iconName] ?? faUser} size={17} color={defaultTheme.colors.primary[800]} />
					</View>

					{isSignedIn && (
						<TouchableOpacity activeOpacity={0.5} onPress={handleFavoritePress} className="justify-center items-center">
							<FontAwesomeIcon
								icon={isStarred ? faStar : faStarOutline}
								size={25}
								color={isStarred ? '#F59E0B' : '#9CA3AF'}
							/>
						</TouchableOpacity>
					)}
				</View>

				<Text className="text-base font-medium text-gray-800 flex-1" numberOfLines={2}>
					{data.title}
				</Text>
			</Touchable>

			<FavoriteErrorBottomSheet />
			<FavoriteSuccessBottomSheet />
		</>
	)
}
