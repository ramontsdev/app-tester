import { useCallback } from 'react'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'
import { Check, CircleOff } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { capitalize } from 'radash'

import { defaultTheme } from '@/app/styles/theme'
import { useUserProfile } from '@/features/authenticate/useUserProfile'
import { useDigitalDocumentStore } from '@/features/wallet/useDigitalDocumentStore'
import { digitalDocumentQueries } from '@/entities/digitalDocument'
import { LevelRoleBadge } from '@/shared/components/profile/LevelRoleBadge'
import { Text } from '@/shared/components/Text'
import { cn } from '@/shared/utils/cn'

type DigitalDocumentAvailableCardProps = {
	documentTitle: string
	documentType: string
	levelRole: 'opala' | 'ouro' | 'prata' | 'bronze'
	disabled?: boolean
	className?: string
	disabledByLevel?: boolean
}

export function DigitalDocumentAvailableCard({
	documentTitle,
	documentType,
	levelRole,
	disabled = false,
	className = '',
	disabledByLevel = false,
}: DigitalDocumentAvailableCardProps) {
	const { setPressedDigitalDocumentToAddTitle } = useDigitalDocumentStore()
	const {
		query: { data: userProfile },
		levelRole: userLevelRole,
	} = useUserProfile()
	const { mutate: addDigitalDocument, isPending } = digitalDocumentQueries.useAddDigitalDocumentMutation(
		documentType,
		userProfile?.preferred_username,
	)

	const router = useRouter()

	const handleProfileMoreInfomationPress = useCallback(() => {
		router.push({ pathname: '/profile/access-level/[levelRole]', params: { levelRole: userLevelRole } })
	}, [userLevelRole, router])

	const handleOnPress = () => {
		if (disabled) return

		if (disabledByLevel) {
			return handleProfileMoreInfomationPress()
		}
		setPressedDigitalDocumentToAddTitle(documentTitle)
		addDigitalDocument(documentType)
	}
	return (
		<View className="relative">
			<TouchableOpacity
				className={cn(
					'flex flex-row justify-between items-center bg-white rounded-lg p-4 gap-4 shadow-md',
					className,
					(isPending || disabled || disabledByLevel) && 'opacity-50',
				)}
				disabled={isPending || disabled}
				onPress={handleOnPress}
			>
				<View className="flex-row items-center gap-2">
					<Text className="text-sm font-normal">{documentTitle}</Text>
					{disabled && <Check size={16} color={defaultTheme.colors.success.default} />}
				</View>
				{disabledByLevel ? (
					<View className="flex flex-row items-center gap-1 border border-red-500 rounded-lg px-1 py-1">
						<CircleOff size={16} color="red" />
						<Text className="text-xs font-medium text-red-500">{`Nível necessário: ${capitalize(levelRole)}`}</Text>
					</View>
				) : (
					<LevelRoleBadge variant={levelRole} label={capitalize(levelRole)} />
				)}
			</TouchableOpacity>
			{isPending && !disabled && (
				<View className="absolute w-full h-full items-center justify-center">
					<ActivityIndicator size="small" color={defaultTheme.colors.primary.default} />
				</View>
			)}
		</View>
	)
}
