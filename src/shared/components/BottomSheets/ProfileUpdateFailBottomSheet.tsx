import { TrueSheet } from '@lodev09/react-native-true-sheet'

import { BottomSheet, BottomSheetAction } from '@/shared/components/BottomSheet'
import { Text } from '@/shared/components/Text'
import { localStorage } from '@/shared/lib/localStorage'
import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

export function ProfileUpdateFailBottomSheet() {
	const handleDismiss = async () => {
		localStorage.removeItem(LocalStorageKeys.PROOF_OF_LIFE_KEY)
		await TrueSheet.dismiss('profile-update-fail')
	}

	return (
		<BottomSheet name="profile-update-fail" title="Atualização do perfil">
			<Text className="text-center text-black font-semibold tracking-wide text-sm">
				Não foi possível concluir a atualização do seu perfil.
			</Text>
			<Text className="text-center text-black tracking-wide text-sm">
				Lamentamos informar que a finalização da atualização de dados não foi bem-sucedida. Pedimos desculpas pelo
				inconveniente e solicitamos que tente novamente.
			</Text>
			<BottomSheetAction label="Ok, entendi" onPress={handleDismiss} />
		</BottomSheet>
	)
}
