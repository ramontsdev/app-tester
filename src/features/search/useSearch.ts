import { useEffect, useMemo } from 'react'

import { serviceQueries } from '@/entities/service'
import { TypesOfSearch } from '@/shared/utils/typesOfSearch'

type searchAtributes = {
	key: string[]
	queryValue?: string
	slug?: string
	searchType?: TypesOfSearch
	resultSize?: number
}

export function useSearch({ key, queryValue, searchType, slug, resultSize }: searchAtributes) {
	const {
		mutate: getServices,
		data: serviceSearchResultData,
		isPending: serviceSearchResultIsPending,
		error: serviceSearchResultError,
		status: serviceSearchResultStatus,
	} = serviceQueries.useServiceQuery(['search', ...key])

	const SearchTypeMap = useMemo(
		() => ({
			[TypesOfSearch.DEPARTMENT]: () => getServices({ departmentSlug: slug, groups: ['CATALOG'], size: 200 }),
			[TypesOfSearch.CATEGORY]: () => getServices({ category: slug, groups: ['CATALOG'], size: 200 }),
			[TypesOfSearch.VALUE]: () =>
				getServices({ query: queryValue, groups: ['CATALOG'], from: 0, size: resultSize ?? 0 }),
		}),
		[getServices, slug, queryValue, resultSize],
	)

	useEffect(() => {
		if (searchType) {
			const searchByType = SearchTypeMap[searchType]
			searchByType()
		}
	}, [searchType, SearchTypeMap])

	return {
		serviceSearchResultData,
		serviceSearchResultIsPending,
		serviceSearchResultError,
		serviceSearchResultStatus,
	}
}
