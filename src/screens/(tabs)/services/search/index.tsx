import React from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { capitalize } from 'radash'

import { defaultTheme } from '@/app/styles/theme'
import { useOpenGlobalLoading } from '@/widgets/GlobalLoding'
import { SearchServicesInput } from '@/widgets/SearchServicesInput'
import { useIsSignedIn } from '@/features/authenticate/useIsSignedIn'
import { useSearch } from '@/features/search/useSearch'
import { SearchNotFound } from '@/shared/assets/images'
import { SearchResultCard } from '@/shared/components/services/SearchResultCard'
import { Text } from '@/shared/components/Text'
import { TypesOfSearch } from '@/shared/utils/typesOfSearch'

export type SearchResultParams = {
	queryValue: string
	slug: string
	searchType: TypesOfSearch
	badgeValue: string
}

export default function SearchResult() {
	const params = useLocalSearchParams<SearchResultParams>()
	const isSignedIn = useIsSignedIn()
	const globalLoding = useOpenGlobalLoading()

	const { serviceSearchResultData, serviceSearchResultIsPending } = useSearch({
		key: ['result'],
		queryValue: params.queryValue?.toLowerCase(),
		slug: params.slug,
		searchType: params.searchType,
	})

	function handleRedirect(uri: string, name: string, slug?: string, icon?: string, category?: string) {
		if (isSignedIn) {
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
		} else {
			router.push({
				pathname: '/service/service-details',
				params: { uri, name, slug },
			})
		}
	}

	if (!serviceSearchResultData?.success) return null

	function SearchStackScreen({ children }: { children: React.ReactNode }) {
		return (
			<>
				<Stack.Screen options={{ title: 'Serviços' }} />
				{children}
			</>
		)
	}

	return (
		<>
			<SearchStackScreen>
				<View className="flex-1 px-4">
					<View className="mt-8">
						<SearchServicesInput />
					</View>

					{params.badgeValue && (
						<View className="items-start">
							<View className="flex gap-2 mt-6 bg-success-600 rounded-full px-2 py-1">
								<Text className="font-semibold text-xs text-center text-white">{capitalize(params.badgeValue)}</Text>
							</View>
						</View>
					)}

					{serviceSearchResultIsPending && (
						<View className="flex-1 justify-center items-center">
							<ActivityIndicator size="large" color={defaultTheme.colors.primary.default} />
						</View>
					)}

					{serviceSearchResultData.data.length === 0 && (
						<View className="">
							<View className="flex justify-center items-center mt-6 mb-8">
								<SearchNotFound />
							</View>

							<Text className="font-semibold text-center tracking-wide mb-3 text-lg leading-5">
								Ops! Não achamos o que você busca neste momento.
							</Text>
							<Text className="leading-5 text-center tracking-wide px-2">
								Que tal explorar nossas outras categorias ou fazer uma busca por um serviço?
							</Text>
						</View>
					)}

					<ScrollView showsVerticalScrollIndicator={false} className="mt-8">
						{serviceSearchResultData.data.map((item) => (
							<SearchResultCard
								key={item.slug}
								data={item}
								handleRedirect={() => handleRedirect(item.link, item.title, item.slug, item.icon, item.category)}
								className="mb-4"
							/>
						))}
					</ScrollView>
				</View>
			</SearchStackScreen>
		</>
	)
}
