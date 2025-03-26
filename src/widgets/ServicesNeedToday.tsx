import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, ListRenderItem, View } from 'react-native'

import { defaultTheme } from '@/app/styles/theme'
import { useUserProfile } from '@/features/authenticate/useUserProfile'
import { getRecommendedServices, getRelevant } from '@/entities/recommendedServices/recommendedServices.api'
import { serviceQueries, serviceTypes } from '@/entities/service'
import { SectionTitle } from '@/shared/components/SectionTitle'
import { ServiceCard } from '@/shared/components/ServiceCard'
import { accessToken } from '@/shared/lib/localToken'

export function ServicesNeedToday() {
	const {
		query: { data: userProfile },
	} = useUserProfile()
	const cpf = userProfile?.preferred_username

	const [localServices, setLocalServices] = useState<serviceTypes.Service[]>([])
	const [isLoadingServices, setIsLoadingServices] = useState(false)

	const {
		mutate: getServices,
		isSuccess,
		data: servicesData,
	} = serviceQueries.useServiceQuery(['services', 'recommended'])

	// Update local services when mutation succeeds
	useEffect(() => {
		if (isSuccess && servicesData) {
			setLocalServices(servicesData.data || [])
		}
	}, [isSuccess, servicesData])

	const fetchRecommendedServices = useCallback(async () => {
		setIsLoadingServices(true)
		try {
			let result
			if (cpf) {
				result = await getRecommendedServices(cpf)
			}

			if (!result?.recommended_services?.length) {
				result = await getRelevant(accessToken.get() || undefined)
			}

			if (result?.recommended_services?.length) {
				getServices({
					slugs: result.recommended_services.map((service) => service.slug),
					groups: ['CATALOG'],
				})
			}
		} catch (error) {
			console.warn('[ServicesNeedToday] Error fetching services:', error)
			try {
				const relevant = await getRelevant(accessToken.get() || undefined)
				if (relevant?.recommended_services?.length) {
					getServices({
						slugs: relevant.recommended_services.map((service) => service.slug),
						groups: ['CATALOG'],
					})
				}
			} catch (fallbackError) {
				console.error('[ServicesNeedToday] Fallback also failed:', fallbackError)
			}
		} finally {
			setIsLoadingServices(false)
		}
	}, [cpf, getServices])

	useEffect(() => {
		fetchRecommendedServices()
	}, [fetchRecommendedServices])

	const renderItem: ListRenderItem<serviceTypes.Service> = useCallback(({ item }) => <ServiceCard data={item} />, [])

	if (!localServices.length && !isLoadingServices) {
		return null
	}

	return (
		<View className="gap-4">
			<View className="flex flex-row justify-between items-center px-4">
				<SectionTitle>O que você precisa hoje?</SectionTitle>
			</View>

			{isLoadingServices ? (
				<View className="py-4">
					<ActivityIndicator size="large" color={defaultTheme.colors.primary.default} />
				</View>
			) : (
				<FlatList<serviceTypes.Service>
					data={localServices}
					renderItem={renderItem}
					keyExtractor={(item) => item.slug}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerClassName="gap-4 pr-8 px-4 py-2"
				/>
			)}
		</View>
	)
}
