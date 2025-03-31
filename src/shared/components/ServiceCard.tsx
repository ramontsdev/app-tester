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

import { defaultTheme } from '@/app/styles/theme'
import { useAppStore } from '@/app/useAppStore'
import { favoriteEvents, FavoriteEventsType } from '@/widgets/FavoriteServices/favoriteEvents'
import { useOpenGlobalLoading } from '@/widgets/GlobalLoding'
import { useIsSignedIn } from '@/features/authenticate/useIsSignedIn'
import { Service } from '@/entities/service/service.types'
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

export function ServiceCard({ data, className = '' }: ServiceCardProps) {
	const isSignedIn = useIsSignedIn()
	const iconName = data.icon.slice(3)
	const globalLoading = useOpenGlobalLoading()

	const { servicesFavoritesSlugs } = useAppStore()

	const isFavorite = servicesFavoritesSlugs.includes(data.slug)

	function handleFavoritePress() {
		if (!isSignedIn) {
			return
		}
		if (isFavorite) {
			favoriteEvents.emit(FavoriteEventsType.REMOVE, data.slug)
		} else {
			favoriteEvents.emit(FavoriteEventsType.ADD, data.slug)
		}
	}

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

	function goToService(uri: string, name: string, slug: string, icon: string, category?: string) {
		globalLoading.openGlobalLoading([`Acessando serviço ${name}`, 'Aguarde'], {
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
								icon={isFavorite ? faStar : faStarOutline}
								size={25}
								color={isFavorite ? '#F59E0B' : '#9CA3AF'}
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
