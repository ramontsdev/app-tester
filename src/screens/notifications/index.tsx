import { useEffect } from 'react'
import { ActivityIndicator, FlatList, RefreshControl, TouchableOpacity, View } from 'react-native'
import { Ellipsis } from 'lucide-react-native'
import { Stack, useRouter } from 'expo-router'

import { defaultTheme } from '@/app/styles/theme'
import { NotificationModalActions } from '@/widgets/NotificationModalActions'
import { useNotificationStore } from '@/features/notification/useNotificationStore'
import { notificationQueries } from '@/entities/notification'
import { Message } from '@/entities/notification/notification.model'
import {
	useNotificationActions,
	useSortedNotifications,
} from '@/shared/components/notifications/hooks/useNotificationActions'
import { NotificationEmptyState } from '@/shared/components/notifications/NotificationEmptyState'
import { NotificationItem } from '@/shared/components/notifications/NotificationItem'
import { NotificationItemSkeleton } from '@/shared/components/notifications/NotificationItemSkeleton'

export default function Notifications() {
	const router = useRouter()
	const { setNotificationRefreshing, notificationRefreshing } = useNotificationStore((state) => ({
		setNotificationRefreshing: state.setNotificationRefreshing,
		notificationRefreshing: state.notificationRefresh,
	}))

	const {
		refetch: notificationsRefetch,
		isLoading: notificationsIsLoading,
		content: notificationContent,
		fetchNextPage: notificationFetchNextPage,
		isError: notificationIsError,
		hasNextPage: hasNextPageNotifications,
	} = notificationQueries.useGetNotificationsQuery()

	const sortedNotifications = useSortedNotifications(notificationContent)

	const { dropDownIsOpen, toggleModalOpenAndClose, setAllNotificationsRead } = useNotificationActions()

	const notificationIsEmpty = notificationContent?.length === 0 || notificationIsError

	const handleRefresh = () => {
		notificationsRefetch()
		setNotificationRefreshing(false)
	}

	const handleNotificationPress = (item: Message) => {
		router.push({
			pathname: '/notifications/notification-detatils',
			params: {
				title: item.titulo,
				description: item.texto,
				bannerUrl: item.bannerUrl,
				notificationId: item.id,
			},
		})
		item.visualizada = true
	}

	const handleLoadMore = () => {
		if (hasNextPageNotifications && !notificationsIsLoading) {
			notificationFetchNextPage()
		}
	}

	useEffect(() => {
		if (notificationRefreshing) {
			notificationsRefetch()
				.then()
				.finally(() => {
					setNotificationRefreshing(false)
				})
		}
	}, [notificationRefreshing, notificationsRefetch, setNotificationRefreshing])

	return (
		<>
			<Stack.Screen
				options={{
					title: 'Notificações',
					headerShown: true,
					headerRight: () =>
						notificationIsEmpty ? null : (
							<TouchableOpacity onPress={toggleModalOpenAndClose}>
								<Ellipsis color={'white'} />
							</TouchableOpacity>
						),
				}}
			/>

			<NotificationModalActions isOpen={dropDownIsOpen} markAllNotificationsRead={setAllNotificationsRead} />

			{notificationsIsLoading && (
				<View className="w-full flex justify-center items-start px-4 pt-4">
					<NotificationItemSkeleton count={10} />
				</View>
			)}

			<FlatList
				data={sortedNotifications}
				renderItem={({ item }) => (
					<NotificationItem
						title={item.titulo ?? '-'}
						date={item.dataCriacaoFormatada}
						read={item.visualizada}
						handleRedirect={() => handleNotificationPress(item)}
						className="mb-3"
					/>
				)}
				keyExtractor={(item) => item.id}
				contentContainerClassName="px-4 pt-4 pb-8 flex-grow"
				refreshControl={<RefreshControl refreshing={notificationRefreshing} onRefresh={handleRefresh} />}
				initialNumToRender={20}
				onEndReached={handleLoadMore}
				onEndReachedThreshold={0.5}
				ListFooterComponent={
					hasNextPageNotifications ? (
						<ActivityIndicator color={defaultTheme.colors.primary.default} size="large" />
					) : null
				}
				ListEmptyComponent={notificationIsEmpty ? <NotificationEmptyState /> : null}
			/>
		</>
	)
}
