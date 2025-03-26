import { View } from 'react-native'

import { DigitalDocumentsNotAvaliable } from '@/shared/assets/images'

import { Text } from '../Text'

export function DigitalDocumentsNotAvailable() {
	return (
		<View className="w-full flex-1 flex justify-center items-center px-8">
			<DigitalDocumentsNotAvaliable />
			<Text className="font-semibold text-base mt-16 text-center">
				Você não tem documentos para serem adicionados à carteira.
			</Text>
		</View>
	)
}
