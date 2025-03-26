import { ReactNode } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import { Text } from '@/shared/components/Text'
import { Touchable } from '@/shared/components/Touchable'
import { cn } from '@/shared/utils/cn'

type Props = {
	children?: ReactNode
	onPress?: () => void
	className?: string
}
function UserCard({ children, className, onPress }: Props) {
	return (
		<Touchable
			className={cn('w-80 rounded-lg shadow-sm overflow-hidden bg-white', className)}
			style={Platform.select({ android: styles.shadow })}
			onPress={onPress}
		>
			{children}
		</Touchable>
	)
}

type BodyProps = {
	children?: ReactNode
	className?: string
}
function Body({ children, className }: BodyProps) {
	return <View className={cn('flex-col py-5 px-4 gap-4', className)}>{children}</View>
}

type BadgeProps = {
	className?: string
	value?: string
}
function Badge({ className, value }: BadgeProps) {
	return (
		<View className={cn('self-start rounded-full bg-success-700 p-2 py-1', className)}>
			<Text className="self-start font-semibold text-xs text-white">{value}</Text>
		</View>
	)
}

type FooterProps = {
	className?: string
	children?: ReactNode
}
function Footer({ className, children }: FooterProps) {
	return <View className={cn('flex-row items-center gap-2 py-3 px-4 bg-success-700', className)}>{children}</View>
}

type TitleProps = {
	className?: string
	value?: string
}
function Title({ className, value }: TitleProps) {
	return <Text className={cn('text-success-700 font-semibold', className)}>{value}</Text>
}

UserCard.Footer = Footer
UserCard.Badge = Badge
UserCard.Body = Body
UserCard.Title = Title

export { UserCard }

const styles = StyleSheet.create({
	shadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0,
		shadowRadius: 0,
		elevation: 1,
	},
})
