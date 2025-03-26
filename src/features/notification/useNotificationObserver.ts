import { useEffect } from 'react'
import * as ExpoNotifications from 'expo-notifications'
import { router } from 'expo-router'

import { useAppStore } from '@/app/useAppStore'

import { useIsSignedIn } from '../authenticate/useIsSignedIn'

export default function useNotificationObserver() {
	const isSignedIn = useIsSignedIn()
	const isAnimatedSplashVisible = useAppStore((state) => state.isAnimatedSplashVisible)

	useEffect(() => {
		let isMounted = true

		function redirect(notification: ExpoNotifications.Notification) {
			const { redirect, otp }: { otp?: string; redirect?: boolean } = notification.request?.content.data

			if (isSignedIn && redirect && isAnimatedSplashVisible) {
				router.push({
					pathname: '/notifications/notification-detatils',
					params: {
						title: notification.request?.content.title,
						description: notification.request?.content.body,
						payload: JSON.stringify({ otpCode: otp }),
					},
				})
			}
		}

		ExpoNotifications.getLastNotificationResponseAsync().then((response) => {
			if (!isMounted || !response?.notification) {
				return
			}
			redirect(response?.notification)
		})

		const subscription = ExpoNotifications.addNotificationResponseReceivedListener((response) => {
			redirect(response.notification)
		})

		return () => {
			isMounted = false
			subscription.remove()
		}
	}, [isAnimatedSplashVisible, isSignedIn])
}
