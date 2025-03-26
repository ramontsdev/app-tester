import { useCallback } from 'react'

import { notificationQueries } from '@/entities/notification'

export default function useMarkAllNotificationWithRead() {
	const { content: notificationContent } = notificationQueries.useGetNotificationsQuery()
	const { mutate: markNotificationWithRead } = notificationQueries.useMarkNotificationWithReadQuery()

	return useCallback(() => {
		const unreadNotifications = notificationContent
			?.filter((notification) => !notification.visualizada)
			.map((notification) => notification.id)

		markNotificationWithRead({ messagesIds: unreadNotifications ?? [] })
	}, [markNotificationWithRead, notificationContent])
}
