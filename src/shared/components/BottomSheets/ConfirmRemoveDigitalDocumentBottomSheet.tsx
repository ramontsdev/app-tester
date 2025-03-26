import { TrueSheet } from '@lodev09/react-native-true-sheet'

import { useUserProfile } from '@/features/authenticate/useUserProfile'
import { useDigitalDocumentStore } from '@/features/wallet/useDigitalDocumentStore'
import { digitalDocumentQueries } from '@/entities/digitalDocument'
import { BottomSheet, BottomSheetAction } from '@/shared/components/BottomSheet'
import { Text } from '@/shared/components/Text'

export function ConfirmRemoveDigitalDocumentBottomSheet() {
	const { selectedDocumentToRemove } = useDigitalDocumentStore()
	const {
		query: { data: userProfile },
	} = useUserProfile()
	const { mutateAsync: removeDigitalDocument } = digitalDocumentQueries.useRemoveDigitalDocumentMutation(
		selectedDocumentToRemove.id,
		userProfile?.preferred_username,
	)

	const handleDismiss = async () => {
		await TrueSheet.dismiss('remove-digital-document')
	}

	const handleConfirmDigitalDocumentRemoval = async () => {
		await removeDigitalDocument(selectedDocumentToRemove.id)
		await handleDismiss()
	}

	return (
		<BottomSheet name="remove-digital-document" title="Excluir documento da carteira">
			<Text className="w-full text-justify text-black tracking-wide text-sm">
				Deseja excluir <Text className="font-semibold">{selectedDocumentToRemove.title}</Text> da sua carteira digital?
			</Text>
			<Text className="w-full text-justify text-black tracking-wide text-sm">
				Ao excluir, o documento vai sumir da sua carteira digital. Mas você pode adicioná-lo de volta a qualquer
				momento.
			</Text>
			<BottomSheetAction variant="critical" label="Excluir" onPress={handleConfirmDigitalDocumentRemoval} />
			<BottomSheetAction label="Cancelar" onPress={handleDismiss} />
		</BottomSheet>
	)
}
