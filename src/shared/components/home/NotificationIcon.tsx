import { useCallback } from 'react'
import { View } from 'react-native'
import { Bell } from 'lucide-react-native'
import { useRouter } from 'expo-router'

import useHasUnreadNotification from '@/features/notification/useHasUnreadNotifications'
import { Touchable } from '@/shared/components/Touchable'

export function NotificationIcon() {
	const router = useRouter()

	const hasUnreadNotifications = useHasUnreadNotification()

	const handleNotificationIconPress = useCallback(() => {
		router.push({ pathname: '/notifications' })
	}, [router])

	return (
		<Touchable className="relative rounded-full overflow-hidden" onPress={handleNotificationIconPress}>
			<Bell color="white" />
			{hasUnreadNotifications && (
				<View className="absolute w-2 h-2 bg-[#EF4123] top-1 right-1 rounded-full border border-primary-default" />
			)}
		</Touchable>
	)
}
