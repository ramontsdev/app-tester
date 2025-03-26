import { TrueSheet } from '@lodev09/react-native-true-sheet'

import { useDigitalDocumentStore } from '@/features/wallet/useDigitalDocumentStore'
import { BottomSheet, BottomSheetAction } from '@/shared/components/BottomSheet'
import { Text } from '@/shared/components/Text'

export function AddDigitalDocumentFailBottomSheet() {
	const { pressedDigitalDocumentToAddTitle } = useDigitalDocumentStore()

	const handleDismiss = async () => {
		await TrueSheet.dismiss('add-digital-document-fail')
	}

	return (
		<BottomSheet name="add-digital-document-fail" title="Documento não adicionado">
			<Text className="w-full text-justify text-black tracking-wide text-sm">
				Não foi possível adicionar o documento <Text className="font-semibold">{pressedDigitalDocumentToAddTitle}</Text>
				. Tente novamente mais tarde.
			</Text>
			<BottomSheetAction label="Ok, entendi" onPress={handleDismiss} />
		</BottomSheet>
	)
}
