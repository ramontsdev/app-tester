import { useRef } from 'react'
import { View } from 'react-native'
import { TrueSheet } from '@lodev09/react-native-true-sheet'

import { BottomSheet, BottomSheetAction } from '@/shared/components/BottomSheet'
import { Text } from '@/shared/components/Text'

const SHEET_NAME = 'favorite-error'

export function FavoriteErrorBottomSheet() {
	const sheetRef = useRef<TrueSheet>(null)

	const handleDismiss = () => {
		if (sheetRef.current) {
			sheetRef.current.dismiss()
		}
	}

	return (
		<BottomSheet ref={sheetRef} name={SHEET_NAME} title="Erro ao atualizar favorito" onDismiss={handleDismiss}>
			<View className="gap-6">
				<Text className="text-base text-gray-600 text-center">
					Não foi possível atualizar o serviço nos favoritos. Por favor, tente novamente mais tarde.
				</Text>

				<View className="w-full px-4">
					<View className="w-[250px] h-[40px] overflow-hidden rounded-lg">
						<BottomSheetAction label="Entendi" variant="neutral" onPress={handleDismiss} />
					</View>
				</View>
			</View>
		</BottomSheet>
	)
}
