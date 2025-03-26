import { useEffect } from 'react'
import { ActivityIndicator, FlatList, View } from 'react-native'

import { defaultTheme } from '@/app/styles/theme'
import { serviceQueries } from '@/entities/service'
import { SectionTitle } from '@/shared/components/SectionTitle'
import { ServiceCard } from '@/shared/components/ServiceCard'

export function MostAccessedServices() {
	const {
		mutate: getServices,
		data: serviceData,
		isPending: serviceIsLoading,
		error: serviceError,
		status,
	} = serviceQueries.useServiceQuery(['most-accessed'])

	useEffect(() => {
		getServices({ highlighted: true })
	}, [])

	if (!serviceData?.success) return null

	return (
		<View className="gap-4">
			<View className="flex flex-row justify-between items-center px-4">
				<SectionTitle>Mais acessados</SectionTitle>
			</View>

			{serviceIsLoading && (
				<View className="flex-1 justify-center items-center">
					<ActivityIndicator size="large" color={defaultTheme.colors.primary.default} />
				</View>
			)}

			<FlatList
				data={serviceData.data}
				renderItem={({ index, item, separators }) => <ServiceCard data={item} />}
				keyExtractor={(item) => item.slug}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerClassName="gap-4 pr-8 px-4 py-2"
			/>
		</View>
	)
}
