import { useRef } from 'react'
import { View } from 'react-native'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { TrueSheet } from '@lodev09/react-native-true-sheet'

import { defaultTheme } from '@/app/styles/theme'
import { BottomSheet, BottomSheetAction } from '@/shared/components/BottomSheet'
import { Text } from '@/shared/components/Text'

const SHEET_NAME = 'favorite-success'

export function FavoriteSuccessBottomSheet() {
	const sheetRef = useRef<TrueSheet>(null)

	const handleDismiss = () => {
		if (sheetRef.current) {
			sheetRef.current.dismiss()
		}
	}

	return (
		<BottomSheet ref={sheetRef} name={SHEET_NAME} title="Favorito atualizado" onDismiss={handleDismiss}>
			<View className="gap-6 items-center py-4">
				<FontAwesomeIcon icon={faCircleCheck} size={48} color={defaultTheme.colors.success[500]} />

				<Text className="text-lg text-gray-600 text-center font-medium">
					Serviço atualizado nos favoritos com sucesso!
				</Text>

				<View className="w-full px-4">
					<View className="w-[200px] h-[50px] overflow-hidden rounded-lg">
						<BottomSheetAction label="OK" variant="success" onPress={handleDismiss} />
					</View>
				</View>
			</View>
		</BottomSheet>
	)
}
