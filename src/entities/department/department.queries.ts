import { useQuery } from '@tanstack/react-query'

import * as departmentApi from '@/entities/department/department.api'

const keys = {
	root: () => ['department'],
}

export function useDepartmentQuery({ enabled }: { enabled: boolean } = { enabled: true }) {
	return useQuery({
		queryKey: keys.root(),
		queryFn: departmentApi.getDepartment,
		enabled,
	})
}
