import { TrueSheet } from '@lodev09/react-native-true-sheet'

import { BottomSheet, BottomSheetAction } from '@/shared/components/BottomSheet'
import { Text } from '@/shared/components/Text'

export function LoginFailBottomSheet() {
	const handleDismiss = async () => {
		await TrueSheet.dismiss('login-fail')
	}

	return (
		<BottomSheet name="login-fail" title="Erro ao fazer login" onDismiss={handleDismiss}>
			<Text className="w-full text-justify text-black tracking-wide text-sm">
				Ocorreu um erro ao obter suas credenciais de login. Tente novamente mais tarde.
			</Text>
			<BottomSheetAction label="Ok, entendi" onPress={handleDismiss} />
		</BottomSheet>
	)
}
