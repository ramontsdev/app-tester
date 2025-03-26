import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import * as notificationApi from '@/entities/notification/notification.api'

const keys = {
	root: () => ['notification'],
	enableNotifications: () => [...keys.root(), 'enable-notifications'],
	disableNotifications: () => [...keys.root(), 'disable-notifications'],
}

export function useGetNotificationsQuery() {
	const pageSize = 20

	const { data, isFetching, isLoading, error, isError, hasNextPage, refetch, fetchNextPage } = useInfiniteQuery({
		queryKey: keys.root(),
		staleTime: Infinity,
		initialPageParam: 0,
		queryFn: ({ pageParam }) => notificationApi.getNotifications(pageParam, pageSize),

		getNextPageParam: (lastPage, allPages, lastPageParam) => {
			if (lastPage.mensagens.length === 0) {
				return undefined
			}

			return allPages.length
		},
		retry: false,
		refetchOnWindowFocus: false,
		meta: {
			cache: false,
		},
	})

	const content = data?.pages.flatMap((page) => page.mensagens).flat()

	return {
		data,
		content,
		fetchNextPage,
		refetch,
		hasNextPage,
		isError,
		isFetching,
		isLoading,
		error,
	}
}

export function useEnableNotificationsQuery() {
	return useMutation({
		mutationKey: keys.enableNotifications(),
		mutationFn: (variables: { deviceToken: string }) => notificationApi.enableNotifications(variables.deviceToken),
	})
}

export function useDisableNotificationQuery() {
	return useMutation({
		mutationKey: keys.disableNotifications(),
		mutationFn: notificationApi.disableNotifications,
	})
}

export function useMarkNotificationWithReadQuery() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: keys.enableNotifications(),
		mutationFn: (variables: { messagesIds: string[] }) =>
			notificationApi.markNotificationWithRead(variables.messagesIds),
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: keys.root(), exact: true })
		},
	})
}
