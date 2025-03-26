import { TrueSheet } from '@lodev09/react-native-true-sheet'

import { CircleCheckBig } from '@/shared/assets/images'
import { BottomSheet, BottomSheetAction } from '@/shared/components/BottomSheet'
import { Text } from '@/shared/components/Text'

export function ProfileUpdateSuccessBottomSheet() {
	const handleDismiss = async () => {
		await TrueSheet.dismiss('profile-update-success')
	}

	return (
		<BottomSheet name="profile-update-success" title="Atualização do perfil">
			<CircleCheckBig />
			<Text className="text-center text-[#007236] font-semibold tracking-wide text-sm">
				A atualização do seu perfil está completa, o seu nível agora é OPALA!
			</Text>
			<Text className="text-center text-black tracking-wide text-sm">
				Você está pronto para aproveitar ao máximo nossos serviços com toda a segurança e facilidade.
			</Text>
			<BottomSheetAction label="Ok, entendi" onPress={handleDismiss} />
		</BottomSheet>
	)
}
