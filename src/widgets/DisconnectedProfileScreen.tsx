import { TouchableOpacity, View } from 'react-native'
import Constants from 'expo-constants'
import * as Updates from 'expo-updates'

import { SignInIcon } from '@/shared/assets/images'
import { Text } from '@/shared/components/Text'

import { SignInButton } from './SignInButton'

export function DisconnectedProfileScreen() {
	return (
		<View className="flex-1">
			<View className="h-4/5 items-center justify-between gap-2 p-4">
				<Text className="font-semibold text-xl text-center mt-8">
					Para ter acesso as funcionalidades do APP, realize o login
				</Text>

				<SignInIcon />

				<SignInButton className="w-full" />
			</View>

			<View className="flex-1 justify-end items-center gap-2 mb-8">
				<Text className="text-primary-default">Versão {Constants?.expoConfig?.version}</Text>
				{Updates.updateId && (
					<Text className="text-gray-500 text-xs font-medium" style={{ fontVariant: ['tabular-nums'] }}>
						{Updates.updateId}
					</Text>
				)}

				<TouchableOpacity>
					<Text className="font-bold text-primary-default">Termos de uso</Text>
				</TouchableOpacity>
				<TouchableOpacity>
					<Text className="font-bold text-primary-default">Política de Privacidade</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}
