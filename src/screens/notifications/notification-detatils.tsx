import { useCallback, useEffect, useMemo } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'

import { notificationQueries } from '@/entities/notification'
import { NotificationGenericBanner } from '@/shared/assets/images'
import { Text } from '@/shared/components/Text'
import copyToClipboard from '@/shared/utils/copyToClipboard'

export default function NotificationsDetails() {
	const router = useRouter()
	const { mutate: markNotificationWithRead } = notificationQueries.useMarkNotificationWithReadQuery()

	const notifications = useLocalSearchParams<{
		title: string
		description: string
		bannerUrl?: string
		payload?: string
		notificationId?: string
	}>()

	const payload: any = useMemo(() => {
		try {
			return JSON.parse(notifications.payload ?? '{}')
		} catch (error) {
			console.error('Error parsing notification payload:', error)
			return {}
		}
	}, [notifications.payload])

	const handleBackTo = useCallback(() => {
		router.back()
	}, [router])

	useEffect(() => {
		if (notifications.notificationId) {
			markNotificationWithRead({ messagesIds: [notifications.notificationId] })
		}
	}, [markNotificationWithRead, notifications.notificationId])

	return (
		<>
			<Stack.Screen
				options={{
					title: 'Mensagem',
					headerShown: true,
				}}
			/>

			<ScrollView contentContainerClassName="flex-1" showsVerticalScrollIndicator={false}>
				<View className="flex-1">
					{notifications.bannerUrl ? (
						<Image
							contentFit="cover"
							contentPosition="top"
							source={{
								uri: `${notifications.bannerUrl}`,
							}}
							style={{ width: '100%', height: 176 }}
						/>
					) : (
						<View className="w-full flex justify-center items-center bg-mystic-200">
							<NotificationGenericBanner className="w-full h-44" />
						</View>
					)}

					<Text className="font-semibold text-base text-center mt-6 mx-4">{notifications.title}</Text>

					<Text className="font-normal text-sm text-left mt-6 mx-4">{notifications.description}</Text>
				</View>

				{payload.otpCode && (
					<TouchableOpacity
						className="bg-primary-500 mx-8 p-4 items-center rounded-lg mb-6"
						onPress={() => copyToClipboard(payload.otpCode)}
					>
						<Text className="text-white leading-none">Copiar Codigo</Text>
					</TouchableOpacity>
				)}

				<TouchableOpacity className="bg-primary-500 mx-8 p-4 items-center rounded-lg mb-6" onPress={handleBackTo}>
					<Text className="text-white leading-none">Ok, entendi</Text>
				</TouchableOpacity>
			</ScrollView>
		</>
	)
}
