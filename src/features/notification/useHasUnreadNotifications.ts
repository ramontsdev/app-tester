import { useEffect, useState } from 'react'

import { notificationQueries } from '@/entities/notification'

export default function useHasUnreadNotification() {
	const { content: notificationContent } = notificationQueries.useGetNotificationsQuery()

	const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>()

	useEffect(() => {
		const hasUnreadNotificaiton = notificationContent?.filter((notification) => !notification.visualizada)

		if (hasUnreadNotificaiton && hasUnreadNotificaiton.length > 0) {
			setHasUnreadNotifications(true)
		} else {
			setHasUnreadNotifications(false)
		}
	}, [notificationContent, setHasUnreadNotifications])

	return hasUnreadNotifications
}
