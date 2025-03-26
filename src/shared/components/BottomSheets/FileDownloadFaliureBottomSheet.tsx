import { TrueSheet } from '@lodev09/react-native-true-sheet'

import { BottomSheet, BottomSheetAction } from '@/shared/components/BottomSheet'
import { Text } from '@/shared/components/Text'

export function FileDownloadFaliureBottomSheet() {
	const handleDismiss = async () => {
		await TrueSheet.dismiss('file-download-faliure')
	}

	return (
		<BottomSheet name="file-download-faliure" title="Erro ao baixar arquivo">
			<Text className="w-full text-justify text-black tracking-wide text-sm">
				Não foi possível fazer o download do arquivo.Tente novamente mais tarde.
			</Text>
			<BottomSheetAction label="Ok, entendi" onPress={handleDismiss} />
		</BottomSheet>
	)
}
