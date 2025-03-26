import { View } from 'react-native'

import { NotificationEmpty } from '@/shared/assets/images'
import { Text } from '@/shared/components/Text'

export function NotificationEmptyState() {
	return (
		<View className="w-full flex-1 flex justify-center items-center">
			<NotificationEmpty />
			<Text className="font-semibold text-base">Nenhuma notificação no momento</Text>
		</View>
	)
}
