import { TouchableOpacity, View } from 'react-native'

import { Text } from '@/shared/components/Text'

type NotificationModalActionsProps = {
	isOpen: boolean
	markAllNotificationsRead: () => void
}

export function NotificationModalActions({ isOpen, markAllNotificationsRead }: NotificationModalActionsProps) {
	return (
		<>
			{isOpen && (
				<View className="bg-white rounded-xl absolute z-50 top-3 right-4 self-end shadow-xl">
					<View>
						<TouchableOpacity className="flex flex-row gap-2 items-center py-3 px-4" onPress={markAllNotificationsRead}>
							<Text className="text-primary text-xl">Marcar todas como lidas</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</>
	)
}
