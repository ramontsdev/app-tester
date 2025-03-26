import { ScrollView } from 'react-native'
import { Stack, useRouter } from 'expo-router'

import { DisconnectedProfileScreen } from '@/widgets/DisconnectedProfileScreen'
import { UserProfileCard } from '@/widgets/UserProfileCard'
import { useIsSignedIn } from '@/features/authenticate/useIsSignedIn'
import { useUserProfile } from '@/features/authenticate/useUserProfile'
import { NotificationIcon } from '@/shared/components/home/NotificationIcon'
import { ProfileActions } from '@/shared/components/profile/ProfileActions'

export default function Profile() {
	const router = useRouter()
	const signedIn = useIsSignedIn()
	const { isGoldLevel } = useUserProfile({ enabled: signedIn })

	return (
		<>
			<Stack.Screen options={{ title: 'Meu perfil', headerRight: () => signedIn && <NotificationIcon /> }} />

			{signedIn && (
				<>
					<UserProfileCard showMoreInfo />

					<ScrollView className="pt-6" contentContainerClassName="gap-y-6">
						<ProfileActions />
					</ScrollView>
				</>
			)}
			{!signedIn && <DisconnectedProfileScreen />}
		</>
	)
}
