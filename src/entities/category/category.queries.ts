import { useQuery } from '@tanstack/react-query'

import * as categoryApi from '@/entities/category/category.api'

const keys = {
	root: () => ['categories'],
}

export function useCategoriesQuery({ enabled }: { enabled: boolean } = { enabled: true }) {
	return useQuery({
		queryKey: keys.root(),
		queryFn: categoryApi.getCategories,
		enabled,
		meta: { cache: false },
	})
}
