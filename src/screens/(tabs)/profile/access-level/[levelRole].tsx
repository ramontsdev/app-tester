import { ScrollView, TouchableOpacity, View } from 'react-native'
import { BadgeCheck } from 'lucide-react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'

import { defaultTheme } from '@/app/styles/theme'
import { UserProfileCard } from '@/widgets/UserProfileCard'
import { authTypes } from '@/entities/auth'
import { NotificationIcon } from '@/shared/components/home/NotificationIcon'
import { AccessLevelPresentation } from '@/shared/components/profile/AccessLevelPresentation'
import { AccessLevelsAdvantages } from '@/shared/components/profile/AccessLevelsAdvantages'
import { LearnMoreAboutAccessLevels } from '@/shared/components/profile/LearnMoreAboutAccessLevels'
import { Text } from '@/shared/components/Text'

export default function AccessLevel() {
	const router = useRouter()

	const { levelRole } = useLocalSearchParams<{ levelRole: authTypes.UserLevelRole }>()

	const isGoldLevel = levelRole === 'ouro'

	const handleLevelUpgradePress = () => {
		router.push({ pathname: '/profile/access-level/upgrade' })
	}

	return (
		<>
			<Stack.Screen
				options={{
					title: 'Nível da conta',
					headerRight: () => <NotificationIcon />,
				}}
			/>

			<UserProfileCard />

			<ScrollView className="pt-4" showsVerticalScrollIndicator={false}>
				<View className="gap-y-4 px-6">
					<AccessLevelPresentation levelRole={levelRole} />
					{isGoldLevel && (
						<View className="items-center w-full">
							<TouchableOpacity
								className="flex-row items-center justify-center px-6 py-2 gap-x-3 bg-white rounded-lg border border-primary-default shadow-sm"
								onPress={handleLevelUpgradePress}
							>
								<Text className="text-base font-semibold text-center text-primary-default">Aumentar nível</Text>
								<BadgeCheck size={18} color={defaultTheme.colors.primary.default} />
							</TouchableOpacity>
						</View>
					)}
					<AccessLevelsAdvantages levelRole={levelRole} />
					<LearnMoreAboutAccessLevels levelRole={levelRole} />
				</View>
			</ScrollView>
		</>
	)
}
