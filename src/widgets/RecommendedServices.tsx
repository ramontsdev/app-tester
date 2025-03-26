import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, View } from 'react-native'

import { useIsSignedIn } from '@/features/authenticate/useIsSignedIn'
import { useUserProfile } from '@/features/authenticate/useUserProfile'
import { getRecommendedServices, getRelevant } from '@/entities/recommendedServices/recommendedServices.api'
import { serviceTypes } from '@/entities/service'
import { SectionTitle } from '@/shared/components/SectionTitle'
import { ServiceCard } from '@/shared/components/ServiceCard'
import { accessToken } from '@/shared/lib/localToken'

export function RecommendedServices() {
	const isSignedIn = useIsSignedIn()
	const {
		query: { data: userProfile },
	} = useUserProfile()
	const [isLoading, setIsLoading] = useState(false)
	const [recommendedServices, setRecommendedServices] = useState<serviceTypes.ServiceList>([])

	const getServerRecommendations = useCallback(async () => {
		setIsLoading(true)
		try {
			if (!isSignedIn || !userProfile) {
				const regularServices = await getRelevant(accessToken.get() || undefined)
				setRecommendedServices(regularServices.recommended_services)
				return
			}

			const recommendedResult = await getRecommendedServices(userProfile?.preferred_username || undefined)

			if (recommendedResult.recommended_services?.length > 0) {
				setRecommendedServices(recommendedResult.recommended_services)
			} else {
				const regularServices = await getRelevant(accessToken.get() || undefined)
				setRecommendedServices(regularServices.recommended_services)
			}
		} catch (error) {
			try {
				const regularServices = await getRelevant(accessToken.get() || undefined)
				setRecommendedServices(regularServices.recommended_services)
			} catch (fallbackError) {
				console.error('Erro ao buscar serviços alternativos:', fallbackError)
				setRecommendedServices([])
			}
		} finally {
			setIsLoading(false)
		}
	}, [isSignedIn, userProfile])

	useEffect(() => {
		getServerRecommendations()
	}, [getServerRecommendations])

	if (isLoading) {
		return (
			<View className="flex-1 justify-center items-center">
				<ActivityIndicator size="large" />
			</View>
		)
	}

	if (!recommendedServices.length) {
		return null
	}

	return (
		<View className="gap-4">
			<View className="flex flex-row justify-between items-center px-4">
				<SectionTitle>O que você precisa hoje?</SectionTitle>
			</View>

			<FlatList
				data={recommendedServices}
				renderItem={({ item: service }) => <ServiceCard data={service} />}
				keyExtractor={(item) => item.slug}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerClassName="gap-4 pr-8 px-4 py-2"
			/>
		</View>
	)
}
