import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useRouter } from 'expo-router'

import { useUserProfile } from '@/features/authenticate/useUserProfile'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/Avatar'
import { NotificationIcon } from '@/shared/components/home/NotificationIcon'
import { Touchable } from '@/shared/components/Touchable'

export function UserCorner() {
	const router = useRouter()
	const {
		query: { data: userProfile },
		initials,
	} = useUserProfile()

	const handleProfilePress = useCallback(() => {
		router.push({ pathname: '/profile' })
	}, [router])

	return (
		<View className="flex-row items-center gap-x-1">
			<NotificationIcon />
			<Touchable
				className="relative items-center justify-center p-2 rounded-full overflow-hidden"
				onPress={handleProfilePress}
			>
				<View className="absolute h-10 w-10 border-2 border-primary-700 bg-primary-default rounded-full" />
				<Avatar className="h-8 w-8">
					{userProfile?.picture ? (
						<AvatarImage source={{ uri: userProfile?.picture }} />
					) : (
						<AvatarFallback textClassname="text-base font-semibold text-[#F8F8F8]">{initials}</AvatarFallback>
					)}
				</Avatar>
			</Touchable>
		</View>
	)
}
