import { View } from 'react-native'

import { WalletErrorInslustration } from '@/shared/assets/images'

import { Text } from '../Text'

export function ErrorToLoadWallet() {
	return (
		<View className="w-full flex justify-center items-center px-8">
			<WalletErrorInslustration />
			<Text className="font-semibold text-base mt-3 text-center">
				Não foi possível carregar o documento neste momento.
			</Text>
			<Text className="font-normal text-sm mt-3 text-center">Tente novamente mais tarde.</Text>
		</View>
	)
}
