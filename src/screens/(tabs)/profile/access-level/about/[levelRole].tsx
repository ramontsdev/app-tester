import { ScrollView } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'

import { authTypes } from '@/entities/auth'
import { NotificationIcon } from '@/shared/components/home/NotificationIcon'
import { AccessLevelPresentation } from '@/shared/components/profile/AccessLevelPresentation'
import { AccessLevelsAdvantages } from '@/shared/components/profile/AccessLevelsAdvantages'
import { LearnMoreAboutAccessLevels } from '@/shared/components/profile/LearnMoreAboutAccessLevels'

export default function AboutLevelRole() {
	const { levelRole } = useLocalSearchParams<{ levelRole: authTypes.UserLevelRole }>()

	return (
		<>
			<Stack.Screen
				options={{
					title: 'Nível da conta',
					headerRight: () => <NotificationIcon />,
				}}
			/>

			<ScrollView className="pt-8 px-6" contentContainerClassName="gap-y-6">
				<AccessLevelPresentation isAbout levelRole={levelRole} />
				<AccessLevelsAdvantages levelRole={levelRole} />
				<LearnMoreAboutAccessLevels isAbout levelRole={levelRole} />
			</ScrollView>
		</>
	)
}
