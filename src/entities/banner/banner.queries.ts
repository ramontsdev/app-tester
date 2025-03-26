import { useQuery } from '@tanstack/react-query'

import { getBanners } from './banner.api'

const keys = {
	root: () => ['banners'],
}

export function useBannersQuery() {
	const { data, ...rest } = useQuery({
		queryKey: keys.root(),
		queryFn: getBanners,
		meta: { cache: false },
	})

	return {
		...rest,
		data: data ?? [],
	}
}
