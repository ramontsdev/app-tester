import { useCallback } from 'react'
import { View } from 'react-native'
import { ChevronRight } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { capitalize } from 'radash'

import { useUserProfile } from '@/features/authenticate/useUserProfile'
import { LevelRoleBadge } from '@/shared/components/profile/LevelRoleBadge'
import { UserAvatar } from '@/shared/components/profile/UserAvatar'
import { Text } from '@/shared/components/Text'
import { Touchable } from '@/shared/components/Touchable'

type Props = {
	showMoreInfo?: boolean
}

export function UserProfileCard({ showMoreInfo = false }: Props) {
	const router = useRouter()
	const {
		query: { data: userProfile, status },
		initials,
		levelRole,
		fullname,
	} = useUserProfile()

	const handleProfileMoreInfomationPress = useCallback(() => {
		router.push({ pathname: '/profile/access-level/[levelRole]', params: { levelRole } })
	}, [levelRole, router])

	return (
		<View className="px-4 py-5 bg-primary-default gap-y-3">
			<View className="flex-row items-center gap-x-4">
				<UserAvatar
					initials={initials}
					levelRole={levelRole}
					imageSrc={userProfile?.picture ?? ''}
					editable={showMoreInfo}
					onPress={() => console.log('pressed')}
				/>
				<View className="flex-col gap-y-4 items-start flex-1">
					<Text className="text-[#F4F5F7] font-semibold text-base w-full" numberOfLines={1}>
						{fullname}
					</Text>
					<LevelRoleBadge variant={levelRole} label={capitalize(levelRole)} />
				</View>
			</View>
			{showMoreInfo && (
				<Touchable
					className="flex flex-row justify-between items-center w-full"
					onPress={handleProfileMoreInfomationPress}
				>
					<Text className="text-white text-sm">Mais informações sobre seu perfil</Text>
					<ChevronRight color="#F4F5F7" size={18} />
				</Touchable>
			)}
		</View>
	)
}
