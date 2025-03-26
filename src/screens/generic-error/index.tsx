import { TouchableNativeFeedback, View } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'

import { Text } from '@/shared/components/Text'

export default function GenericError() {
	const router = useRouter()
	const { type } = useLocalSearchParams<{ type: string }>()

	return (
		<>
			<Stack.Screen
				options={{
					title: 'Erro',
					headerShown: true,
				}}
			/>
			<View>
				<Text>Erro type: {type}</Text>
				<TouchableNativeFeedback onPress={() => router.replace('/')}>
					<View>
						<Text>Voltar</Text>
					</View>
				</TouchableNativeFeedback>
			</View>
		</>
	)
}
