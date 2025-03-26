import { View } from 'react-native'

import { cn } from '../utils/cn'
import { Icon } from './Icon'
import { Text } from './Text'
import { Touchable } from './Touchable'

type Props = {
	title: string
	icon: string
	bgColor: string
	handleRedirect: () => void
	className?: string
}

export function CategoryCard({ title, icon, bgColor, handleRedirect, className = '' }: Props) {
	return (
		<Touchable className={cn('items-center gap-2', className)} onPress={handleRedirect}>
			<View
				className={`w-20 h-20 justify-center items-center rounded-full shadow-sm`}
				style={{ backgroundColor: bgColor }}
			>
				<Icon name={icon} color="white" size={24} />
			</View>
			<Text numberOfLines={2} className="font-semibold w-32 text-center">
				{title}
			</Text>
		</Touchable>
	)
}
