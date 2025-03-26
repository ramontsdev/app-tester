import { FlatList, View } from 'react-native'

import { useAddRecentService } from '@/features/addRecentService/useAddRecentService'
import { SectionTitle } from '@/shared/components/SectionTitle'
import { ServiceCard } from '@/shared/components/ServiceCard'

export function RecentServices() {
	const { recentServices } = useAddRecentService()

	if (!recentServices || recentServices.length === 0) {
		return null
	}

	return (
		<View className="gap-4">
			<View className="flex flex-row justify-between items-center px-4">
				<SectionTitle>Serviços recentes</SectionTitle>
			</View>

			<FlatList
				data={recentServices}
				renderItem={({ item: service }) => <ServiceCard data={service} />}
				keyExtractor={(item) => item.slug}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerClassName="gap-4 pr-8 px-4 py-2"
			/>
		</View>
	)
}
