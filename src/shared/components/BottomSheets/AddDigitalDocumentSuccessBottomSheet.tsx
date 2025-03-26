import { TrueSheet } from '@lodev09/react-native-true-sheet'

import { useDigitalDocumentStore } from '@/features/wallet/useDigitalDocumentStore'
import { CircleCheckBig } from '@/shared/assets/images'
import { BottomSheet, BottomSheetAction } from '@/shared/components/BottomSheet'
import { Text } from '@/shared/components/Text'

export function AddDigitalDocumentSuccessBottomSheet() {
	const { pressedDigitalDocumentToAddTitle } = useDigitalDocumentStore()

	const handleDismiss = async () => {
		await TrueSheet.dismiss('add-digital-document-success')
	}

	return (
		<BottomSheet name="add-digital-document-success" title="Documento adicionado">
			<CircleCheckBig />
			<Text className="w-full text-justify text-black tracking-wide text-sm">
				Seu documento <Text className="font-semibold">{pressedDigitalDocumentToAddTitle}</Text> acaba de ser adicionado
				a sua carteira digital!
			</Text>
			<BottomSheetAction label="Ok, entendi" onPress={handleDismiss} />
		</BottomSheet>
	)
}
