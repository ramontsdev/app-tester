import { ScrollView, View } from 'react-native'

import { SignInButton } from '@/widgets/SignInButton'
import { EWalletIllustration } from '@/shared/assets/images'
import { Text } from '@/shared/components/Text'

export function DisconnectedWalletScreen() {
	return (
		<ScrollView className="pt-14 px-4" contentContainerClassName="gap-y-6 flex-1">
			<View className="gap-y-6 flex-1 items-center">
				<EWalletIllustration />
				<View className="gap-y-4 w-full">
					<Text className="tracking-wide text-md text-center text-black font-semibold">
						Para acessar a carteira de documentos você deve entrar na sua conta
					</Text>
					<Text className="tracking-wide text-sm text-center text-black">
						Aqui você poderá adicionar seus documentos digitais e acessá-los a qualquer hora.
					</Text>
				</View>
			</View>
			<SignInButton className="mb-6" />
		</ScrollView>
	)
}
