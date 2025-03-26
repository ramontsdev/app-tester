import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import Animated, { clamp, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import * as SplashScreen from 'expo-splash-screen'
import * as WebBrowser from 'expo-web-browser'
import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useQueryClient } from '@tanstack/react-query'
import { isArray, isEmpty } from 'radash'

import { useAppStore } from '@/app/useAppStore'
import { FavoriteServices } from '@/widgets/FavoriteServices'
import { useGlobalLoadingStore } from '@/widgets/GlobalLoding'
import { MostAccessedServices } from '@/widgets/MostAccessedServices'
import { RecentServices } from '@/widgets/RecentServices'
import { ServiceByCategory } from '@/widgets/ServiceByCategory'
import { ServicesNeedToday } from '@/widgets/ServicesNeedToday'
import { SignInButton } from '@/widgets/SignInButton'
import { useIsSignedIn } from '@/features/authenticate/useIsSignedIn'
import { useUserProfile } from '@/features/authenticate/useUserProfile'
import { authQueries } from '@/entities/auth'
import { paycheckQueries } from '@/entities/paycheck'
import { proofOfLifeQueries } from '@/entities/proofOfLife'
import { AnimatedSplash } from '@/shared/components/AnimatedSplash'
import { Carousel } from '@/shared/components/Carousel'
import { Header } from '@/shared/components/home/Header'
import { InformationSection } from '@/shared/components/home/InformationSection'
import { OmbudsmanSession } from '@/shared/components/home/OmbudsmanSession'
import { ServiceProfileCategories } from '@/shared/components/home/ServiceProfileCategories'
import { CnhCard } from '@/shared/components/home/userInfoCards/CnhCard'
import { ContrachequeCard } from '@/shared/components/home/userInfoCards/ContrachequeCard'
import { CrlvCard } from '@/shared/components/home/userInfoCards/CrlvCard'
import { USER_INFO_CARDS_SERVICES_URI } from '@/shared/components/home/userInfoCards/UserInfoCardsServiceUri'
import { LevelUpgradeButton } from '@/shared/components/LevelUpgradeButton'
import { SafeAreaView } from '@/shared/components/SafeAreaView'
import { SectionTitle } from '@/shared/components/SectionTitle'
import { localStorage } from '@/shared/lib/localStorage'
import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

WebBrowser.maybeCompleteAuthSession()
SplashScreen.preventAutoHideAsync()

SplashScreen.setOptions({
	duration: 1000,
	fade: true,
})

export default function InitialScreen() {
	const isAppReady = useAppStore((state) => state.isAppReady)
	const setIsAppReady = useAppStore((state) => state.setIsAppReady)
	const setIsAppFirstRun = useAppStore((state) => state.setIsAppFirstRun)
	const [animationIsVisible, setAnimationIsVisible] = useState(true)
	const notificationEnable = localStorage.getItem(LocalStorageKeys.NOTIFICATION_ENABLE) === 'true'
	const loggedNow = useAppStore((state) => state.isLoggedNow)
	const setIsLoggedNow = useAppStore((state) => state.setIsLoggedNow)
	const isSignedIn = useIsSignedIn()
	const { isGoldLevel } = useUserProfile({ enabled: isSignedIn })
	const queryClient = useQueryClient()

	const globalLoadingIsOpen = useGlobalLoadingStore().open

	const {
		query: { data: userProfile },
	} = useUserProfile({ enabled: isSignedIn })

	const {
		data: userBiographicalData,
		status: biographicalDataStatus,
		isFetching: isBiographicalDataFetching,
	} = proofOfLifeQueries.useGetUserBiographicalDataQuery(userProfile?.preferred_username ?? '')

	const shouldShowLevelUpgradeButton = isGoldLevel && userBiographicalData?.cin

	const { mutateAsync: addOpalaRoleToUser } = authQueries.useAddOpalaRoleToUserMutation()

	const handleLevelUpgradePress = async () => {
		if (biographicalDataStatus === 'success' && isGoldLevel && userBiographicalData?.cin) {
			if (userProfile?.preferred_username) {
				try {
					await addOpalaRoleToUser({ username: userProfile.preferred_username })
					TrueSheet.present('profile-update-success')
				} catch {
					TrueSheet.present('profile-update-fail')
				}
			} else {
				TrueSheet.present('profile-update-fail')
			}
		}
	}

	const HEADER = {
		VERTICAL_POSITIONING: {
			BOTTOM_ADORNMENT: {
				INITIAL: -8,
				FINAL: 12,
			},

			SEARCH_BAR: {
				INITIAL: 21.9047622681,
				FINAL: 0,
			},

			SMOTH_FACTOR: 0.4,
		},

		OPACITY: {
			CONTENT: {
				INITIAL: 1,
				FINAL: 0,
			},

			SMOTH_FACTOR: 0.02,
		},
	}

	const headerContentOpacity = useSharedValue(HEADER.OPACITY.CONTENT.INITIAL)

	const searchBarYTranslation = useSharedValue(HEADER.VERTICAL_POSITIONING.SEARCH_BAR.INITIAL)
	const headerBottomAdornmentPositioning = useSharedValue(HEADER.VERTICAL_POSITIONING.BOTTOM_ADORNMENT.INITIAL)

	const mainContentScrollHandler = useAnimatedScrollHandler((event) => {
		searchBarYTranslation.value =
			HEADER.VERTICAL_POSITIONING.SEARCH_BAR.INITIAL - event.contentOffset.y * HEADER.VERTICAL_POSITIONING.SMOTH_FACTOR
		headerBottomAdornmentPositioning.value =
			HEADER.VERTICAL_POSITIONING.BOTTOM_ADORNMENT.INITIAL +
			event.contentOffset.y * HEADER.VERTICAL_POSITIONING.SMOTH_FACTOR

		headerContentOpacity.value = HEADER.OPACITY.CONTENT.INITIAL - event.contentOffset.y * HEADER.OPACITY.SMOTH_FACTOR
	})

	const headerContentAnimatedStyle = useAnimatedStyle(() => {
		return {
			opacity: clamp(headerContentOpacity.value, HEADER.OPACITY.CONTENT.FINAL, HEADER.OPACITY.CONTENT.INITIAL),
		}
	})

	const headerSearchBarAnimatedStyle = useAnimatedStyle(() => {
		return {
			bottom: clamp(
				headerBottomAdornmentPositioning.value,
				HEADER.VERTICAL_POSITIONING.BOTTOM_ADORNMENT.INITIAL,
				HEADER.VERTICAL_POSITIONING.BOTTOM_ADORNMENT.FINAL,
			),
			transform: [
				{
					translateY: clamp(
						searchBarYTranslation.value,
						HEADER.VERTICAL_POSITIONING.SEARCH_BAR.FINAL,
						HEADER.VERTICAL_POSITIONING.SEARCH_BAR.INITIAL,
					),
				},
			],
		}
	})

	useEffect(() => {
		if (queryClient.isFetching() === 0 && queryClient.isMutating() === 0) {
			setIsAppReady(true)
		}
	}, [queryClient, setIsAppReady])

	const onLayoutRootView = useCallback(() => {
		if (isAppReady) {
			setIsAppFirstRun(false)
			setAnimationIsVisible(false)
			SplashScreen.hide()
		}
	}, [isAppReady, setIsAppFirstRun])

	useEffect(() => {
		if (!globalLoadingIsOpen && !notificationEnable && loggedNow && isSignedIn) {
			setTimeout(() => {
				TrueSheet.present('enable-login-notifications')
			}, 3000)
			setIsLoggedNow(false)
		}
	}, [notificationEnable, loggedNow, globalLoadingIsOpen, isSignedIn])

	const paycheck = paycheckQueries.usePayCheckQuery({ enabled: isSignedIn, user: userProfile?.preferred_username })

	if (!isAppReady) return null

	return (
		<>
			<AnimatedSplash isLoading={animationIsVisible} />

			<SafeAreaView className="bg-zinc-100">
				<Header
					contentAnimatedStyle={headerContentAnimatedStyle}
					searchBarAnimatedStyle={headerSearchBarAnimatedStyle}
				/>

				<View className="flex-1 bg-zinc-100" onLayout={onLayoutRootView}>
					<Animated.ScrollView contentContainerClassName="pt-11 pb-6" onScroll={mainContentScrollHandler}>
						<Carousel />

						<View className="mt-7 gap-y-8">
							{!isSignedIn && (
								<>
									<View className="px-4">
										<SignInButton />
									</View>

									<View className="gap-4 px-4">
										<SectionTitle>Serviços para cada perfil</SectionTitle>

										<ServiceProfileCategories />
									</View>
								</>
							)}

							{isSignedIn && (
								<>
									<FavoriteServices />
									<ServicesNeedToday />

									{shouldShowLevelUpgradeButton && <LevelUpgradeButton onPress={handleLevelUpgradePress} />}
									{isArray(userProfile?.cnh) && !isEmpty(userProfile?.cnh) && (
										<ScrollView
											horizontal
											showsHorizontalScrollIndicator={false}
											className="w-full"
											contentContainerClassName="flex-grow gap-4 px-4 py-2"
										>
											{userProfile?.cnh?.map((cnh, index) => (
												<CnhCard data={cnh} key={index} service={USER_INFO_CARDS_SERVICES_URI.cnh} />
											))}
											{isArray(userProfile?.veiculos) &&
												!isEmpty(userProfile?.veiculos) &&
												userProfile?.veiculos?.map((crlv, index) => (
													<CrlvCard data={crlv} key={index} service={USER_INFO_CARDS_SERVICES_URI.crlv} />
												))}
											{isArray(paycheck.data) &&
												!isEmpty(paycheck.data) &&
												paycheck.data.map((pay) => <ContrachequeCard data={pay} key={pay.id} />)}
										</ScrollView>
									)}

									<RecentServices />
								</>
							)}

							{!isSignedIn && <MostAccessedServices />}

							<ServiceByCategory />

							<InformationSection />

							<OmbudsmanSession />
						</View>
					</Animated.ScrollView>
				</View>
			</SafeAreaView>
		</>
	)
}
