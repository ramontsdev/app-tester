import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

import { authTypes } from '@/entities/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/Avatar'

type UserAvatarProps = {
	levelRole: authTypes.UserLevelRole
	imageSrc: string
	initials: string
	editable?: boolean
	onPress: TouchableOpacityProps['onPress']
}

const levelRoleRingVariants = cva('absolute h-20 w-20 border-4 bg-primary-default rounded-full', {
	variants: {
		variant: {
			opala: 'border-level-role-opala',
			ouro: 'border-level-role-ouro',
			prata: 'border-level-role-prata',
			bronze: 'border-level-role-bronze',
		},
	},
	defaultVariants: {
		variant: 'bronze',
	},
})

type LevelRoleRingProps = VariantProps<typeof levelRoleRingVariants>

function LevelRoleRing({ variant }: LevelRoleRingProps) {
	return <View className={levelRoleRingVariants({ variant })} />
}

export function UserAvatar({ levelRole, imageSrc, initials, editable, onPress }: UserAvatarProps) {
	if (editable) {
		return (
			<TouchableOpacity className="relative items-center justify-center p-2 rounded-full" onPress={onPress}>
				<LevelRoleRing variant={levelRole} />
				{/* <View className="absolute h-5 w-5 p-1 bg-white rounded-full right-1 bottom-1 items-center justify-center z-10">
					<Camera color={defaultTheme.colors.primary.default} size={12} />
				</View> */}
				<Avatar className="h-16 w-16 border-1 border-primary-default">
					{imageSrc ? (
						<AvatarImage source={{ uri: imageSrc }} />
					) : (
						<AvatarFallback textClassname="text-2xl font-semibold text-gray-50">{initials}</AvatarFallback>
					)}
				</Avatar>
			</TouchableOpacity>
		)
	}

	return (
		<View className="relative items-center justify-center p-2 rounded-full">
			<LevelRoleRing variant={levelRole} />
			<Avatar className="h-16 w-16 border-1 border-primary-default">
				{imageSrc ? (
					<AvatarImage source={{ uri: imageSrc }} />
				) : (
					<AvatarFallback textClassname="text-2xl font-semibold text-gray-50">{initials}</AvatarFallback>
				)}
			</Avatar>
		</View>
	)
}
