import { TrueSheet } from '@lodev09/react-native-true-sheet'

import { BottomSheet, BottomSheetAction } from '@/shared/components/BottomSheet'
import { Text } from '@/shared/components/Text'

export function SessionExpiredBottomSheet() {
	const handleDismiss = async () => {
		await TrueSheet.dismiss('session-expired')
	}

	return (
		<BottomSheet name="session-expired" title="Sessão expirada">
			<Text className="w-full text-justify text-black tracking-wide text-sm">
				Sua sessão expirou por inatividade. Por favor, entre novamente para continuar.
			</Text>
			<BottomSheetAction label="Ok, entendi" onPress={handleDismiss} />
		</BottomSheet>
	)
}
