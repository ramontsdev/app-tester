import { ReactNode } from 'react'
import { View } from 'react-native'

import { cn } from '../utils/cn'

type Props = {
	children: ReactNode
	className?: string
}
export function Container({ children, className }: Props) {
	return <View className={cn(className)}>{children}</View>
}
