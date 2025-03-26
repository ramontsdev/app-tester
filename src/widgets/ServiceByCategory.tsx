import { ActivityIndicator, FlatList, View } from 'react-native'
import { useRouter } from 'expo-router'

import { defaultTheme } from '@/app/styles/theme'
import { useCategoriesQuery } from '@/entities/category/category.queries'
import { CategoryCard } from '@/shared/components/CategoryCard'
import { SectionTitle } from '@/shared/components/SectionTitle'
import { TypesOfSearch } from '@/shared/utils/typesOfSearch'

export function ServiceByCategory() {
	const { data: dataCategory, isError: categoryIsError, isLoading: categoryIsLoading } = useCategoriesQuery()

	const router = useRouter()

	if (categoryIsError) {
		return null
	}

	return (
		<View className="gap-4 mb-4">
			<View className="flex flex-row justify-between items-center px-4 pb-4">
				<SectionTitle>Serviços por categorias</SectionTitle>
			</View>

			{categoryIsLoading && (
				<View className="flex-1 justify-center items-center">
					<ActivityIndicator size="large" color={defaultTheme.colors.primary.default} />
				</View>
			)}

			<FlatList
				data={dataCategory?.filter((category) => !category.hidden)}
				renderItem={({ index, item, separators }) => (
					<CategoryCard
						className="mr-5"
						title={item.name}
						icon={item.iconapp || 'badgeInfo'}
						bgColor={`${item.corhex || defaultTheme.colors.primary.default}`}
						handleRedirect={() => {
							router.push({
								pathname: '/services/search',
								params: { slug: item.slug, searchType: TypesOfSearch.CATEGORY, badgeValue: item.name },
							})
						}}
					/>
				)}
				initialNumToRender={35}
				keyExtractor={(item) => item.id}
				horizontal
				showsHorizontalScrollIndicator={false}
				className="gap-4 pr-8 py-2"
			/>
		</View>
	)
}
