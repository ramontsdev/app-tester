import { ScrollView, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'

import { defaultTheme } from '@/app/styles/theme'
import { AccessLevelSeil, EWalletIllustration } from '@/shared/assets/images'
import { Text } from '@/shared/components/Text'

export function LowProfileLevelWalletScreen() {
	const router = useRouter()

	const handleAboutLevelsPress = () => {
		router.push({ pathname: '/profile/access-level/[levelRole]', params: { levelRole: 'bronze' } })
	}

	return (
		<ScrollView className="pt-14 px-4" contentContainerClassName="gap-y-6 flex-1">
			<View className="gap-y-6 flex-1 items-center">
				<EWalletIllustration />
				<View className="gap-y-4 w-full">
					<View className="flex-row items-center justify-center w-full gap-x-2">
						<AccessLevelSeil width={20} height={20} color={defaultTheme.colors['level-role'].bronze} />
						<Text className="tracking-wide text-sm text-center text-black font-semibold">Sua conta é nível Bronze</Text>
					</View>
					<Text className="tracking-wide text-sm text-center text-black">
						Para ter acesso ao conteúdo da Carteira Digital você precisa ser nível Prata.
					</Text>
				</View>
			</View>
			<TouchableOpacity
				className="bg-[#005C26] rounded-xl p-4 items-center justify-center mb-6"
				onPress={handleAboutLevelsPress}
			>
				<Text className="tracking-wide text-base text-center leading-none text-gray-50 font-semibold">
					Entenda sobre os níveis
				</Text>
			</TouchableOpacity>
		</ScrollView>
	)
}
