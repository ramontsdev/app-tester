import { TouchableNativeFeedback, View } from 'react-native'
import { Stack, useRouter } from 'expo-router'

import { Text } from '@/shared/components/Text'

export default function GenericError() {
	const router = useRouter()

	return (
		<>
			<Stack.Screen
				options={{
					title: 'Erro',
					headerShown: true,
				}}
			/>
			<View>
				<Text>Não tem permissão</Text>
				<TouchableNativeFeedback onPress={() => router.replace('/')}>
					<View>
						<Text>Voltar</Text>
					</View>
				</TouchableNativeFeedback>
			</View>
		</>
	)
}
