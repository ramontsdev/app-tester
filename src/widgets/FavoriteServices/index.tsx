import { FlatList, View } from 'react-native'

import { SectionTitle } from '@/shared/components/SectionTitle'
import { ServiceCard } from '@/shared/components/ServiceCard'

import { useFavorites } from './useFavorites'

export function FavoriteServices() {
	const { favoriteServices, favoritesSlugs, hasFavorites } = useFavorites()

	if (!hasFavorites) {
		return null
	}

	return (
		<View className="gap-4">
			<View className="flex flex-row justify-between items-center px-4">
				<SectionTitle>Meus Favoritos</SectionTitle>
			</View>

			<FlatList
				data={favoriteServices}
				renderItem={({ item }) => (
					<View className="px-4">
						<ServiceCard key={item.slug} data={item} isFavorite={favoritesSlugs.includes(item.slug)} />
					</View>
				)}
				keyExtractor={(item) => item.slug}
				horizontal
				showsHorizontalScrollIndicator={false}
				removeClippedSubviews={true}
				maxToRenderPerBatch={5}
				windowSize={5}
				initialNumToRender={3}
			/>
		</View>
	)
}
