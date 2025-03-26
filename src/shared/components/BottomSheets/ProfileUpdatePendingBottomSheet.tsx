import { TrueSheet } from '@lodev09/react-native-true-sheet'

import { BottomSheet, BottomSheetAction } from '@/shared/components/BottomSheet'
import { Text } from '@/shared/components/Text'

export function ProfileUpdatePendingBottomSheet() {
	const handleDismiss = async () => {
		await TrueSheet.dismiss('profile-update-pending')
	}

	return (
		<BottomSheet name="profile-update-pending" title="Atualização do perfil">
			<Text className="text-center text-black font-semibold tracking-wide text-sm">
				A atualização do seu perfil está em andamento.
			</Text>
			<Text className="text-center text-black tracking-wide text-sm">
				Obrigado por sua paciência enquanto concluímos sua atualização de dados. Enviaremos uma notificação no
				aplicativo informando sobre o término da atualização. Não esqueça de habilitar as notificações.
			</Text>
			<BottomSheetAction label="Ok, entendi" onPress={handleDismiss} />
		</BottomSheet>
	)
}
