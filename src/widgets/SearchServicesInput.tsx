import { useEffect, useState } from 'react'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'
import { Clock } from 'lucide-react-native'
import { router, useLocalSearchParams, usePathname } from 'expo-router'
import { useDebounce } from 'use-debounce'

import { defaultTheme } from '@/app/styles/theme'
import { SearchResultParams } from '@/screens/(tabs)/services/search'
import { useOpenGlobalLoading } from '@/widgets/GlobalLoding'
import { useAddRecentService } from '@/features/addRecentService/useAddRecentService'
import { useIsSignedIn } from '@/features/authenticate/useIsSignedIn'
import { useSearch } from '@/features/search/useSearch'
import { useSearchStore } from '@/features/search/useSearchStore'
import { SearchInput } from '@/shared/components/SearchInput'
import { Text } from '@/shared/components/Text'
import { TypesOfSearch } from '@/shared/utils/typesOfSearch'

export function SearchServicesInput() {
	const path = usePathname()
	const params = useLocalSearchParams<SearchResultParams>()
	const isSignedIn = useIsSignedIn()
	const globalLoding = useOpenGlobalLoading()

	const { recentServices } = useAddRecentService()

	const searchValue = useSearchStore((state) => state.value)
	const setShowModal = useSearchStore((state) => state.setShowModal)
	const setSearchValue = useSearchStore((state) => state.setValue)

	const [startedTyping, setStartedTyping] = useState(false)

	const [debounceSearchValue] = useDebounce(searchValue, 1000)

	const suggestLimit = 5

	const { serviceSearchResultData, serviceSearchResultIsPending } = useSearch({
		key: ['suggest', debounceSearchValue],
		queryValue: debounceSearchValue.toLowerCase(),
		resultSize: suggestLimit,
		searchType: TypesOfSearch.VALUE,
	})

	function handleSubmit() {
		setShowModal(false)
		if (path !== '/search' && searchValue) {
			router.push({
				pathname: '/services/search',
				params: {
					queryValue: searchValue,
					searchType: TypesOfSearch.VALUE,
				},
			})
		} else if (params.queryValue !== searchValue) {
			router.setParams({ queryValue: searchValue, slug: '', searchType: TypesOfSearch.VALUE, badgeValue: '' })
		}
	}

	function handlePressSuggestedOption(uri: string, name: string, slug?: string, icon?: string, category?: string) {
		setShowModal(false)

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

	useEffect(() => {
		if (debounceSearchValue !== '') {
			setStartedTyping(true)
		} else {
			setStartedTyping(false)
		}
	}, [debounceSearchValue])

	function RecentServices() {
		return (
			<>
				{recentServices.length === 0 ? (
					<View className="mb-4">
						<Text className="text-center text-gray-400 text-sm font-medium">Sem histórico de serviços recentes!</Text>
					</View>
				) : (
					recentServices.map((recentService) => (
						<TouchableOpacity
							key={recentService.slug}
							className="flex flex-row gap-2 items-center mb-4"
							onPress={() =>
								handlePressSuggestedOption(
									recentService.link,
									recentService.title,
									recentService.slug,
									recentService.icon,
									recentService.category,
								)
							}
						>
							<Clock color={'#aeacac'} size={20} />
							<Text className="text-gray-400 text-sm font-medium max-w-xs">{recentService.title}</Text>
						</TouchableOpacity>
					))
				)}
			</>
		)
	}

	function handleClear() {
		setSearchValue('')
		setStartedTyping(false)
	}

	return (
		<SearchInput
			onClear={handleClear}
			inputProps={{
				onChangeText: setSearchValue,
				value: searchValue,
				onSubmitEditing: handleSubmit,
			}}
			inputValue={searchValue}
			suggestItens={
				<>
					{startedTyping ? (
						serviceSearchResultData?.data
							?.filter((service) => service.active)
							.map((item) => (
								<TouchableOpacity
									key={item.slug}
									className="flex flex-row gap-2 items-center mb-4"
									onPress={() => handlePressSuggestedOption(item.link, item.title, item.slug, item.icon, item.category)}
								>
									<Text className="text-700 text-sm font-semibold max-w-xs">{item.title}</Text>
								</TouchableOpacity>
							))
					) : (
						<RecentServices />
					)}

					{serviceSearchResultData?.data?.length === 0 && (
						<View className="mb-4">
							<Text className="text-center text-gray-400 text-sm font-medium">Nenhum resultado encontrado!</Text>
						</View>
					)}

					{serviceSearchResultIsPending && <ActivityIndicator color={defaultTheme.colors.primary[700]} />}
				</>
			}
		/>
	)
}
