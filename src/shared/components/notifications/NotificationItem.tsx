// No arquivo NotificationItem.tsx, você poderia extrair o componente de indicador de leitura:

import { TouchableOpacity, View } from 'react-native'

import { cn } from '@/shared/utils/cn'

import { Text } from '../Text'

function ReadIndicator({ isRead }: { isRead: boolean }) {
	return <View className={`w-2 h-2 ${isRead ? 'bg-[#0000]' : 'bg-[#034EA2]'} rounded-full`} />
}

interface NotificationItemProps {
	title: string
	date: string
	read: boolean
	className?: string
	handleRedirect: () => void
}

export function NotificationItem({ title, date, read, className = '', handleRedirect }: NotificationItemProps) {
	return (
		<TouchableOpacity onPress={handleRedirect} className={cn('flex flex-row justify-between items-center', className)}>
			<View>
				<Text className="font-normal" numberOfLines={1}>
					{title}
				</Text>
				<Text className="text-gray-500">{date}</Text>
			</View>
			<ReadIndicator isRead={read} />
		</TouchableOpacity>
	)
}
