import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { ChevronRight } from 'lucide-react-native'

import { NegativeAppLogoIcon } from '@/shared/assets/images'
import { Text } from '@/shared/components/Text'

type Props = TouchableOpacityProps
export function LevelUpgradeButton(props: Props) {
	return (
		<View className="px-4">
			<TouchableOpacity
				className="flex flex-col items-center justify-center rounded-xl p-6 gap-2 bg-primary-600"
				{...props}
			>
				<View className="w-full self-start gap-2">
					<NegativeAppLogoIcon />
					<Text className="font-semibold text-white">Agora ficou fácil ser Opala!</Text>
				</View>

				<View className="w-full flex-row items-center justify-between gap-4">
					<Text className="flex-1 text-sm text-white">Se você já possui CIN, clique aqui e aguarde.</Text>
					<ChevronRight size={24} color="#fff" />
				</View>
			</TouchableOpacity>
		</View>
	)
}
