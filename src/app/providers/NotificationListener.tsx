import { ReactNode, useEffect, useRef } from 'react'
import * as ExpoNotifications from 'expo-notifications'

import { useNotificationStore } from '@/features/notification/useNotificationStore'

ExpoNotifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
})

export function NotificationListener({ children }: { children: ReactNode }) {
	const notificationListener = useRef<ExpoNotifications.EventSubscription>()
	const setNotificationRefreshing = useNotificationStore((state) => state.setNotificationRefreshing)

	useEffect(() => {
		notificationListener.current = ExpoNotifications.addNotificationReceivedListener(async (notification) => {
			setNotificationRefreshing(true)
		})

		return () => {
			notificationListener.current && ExpoNotifications.removeNotificationSubscription(notificationListener.current)
		}
	}, [setNotificationRefreshing])

	return <>{children}</>
}
