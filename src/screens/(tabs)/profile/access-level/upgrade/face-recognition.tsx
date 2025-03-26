import { ReactNode } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { useCameraPermission } from 'react-native-vision-camera'
import { ArrowRight, ScanFace, Smile, Sun } from 'lucide-react-native'
import { Stack, useRouter } from 'expo-router'

import { defaultTheme } from '@/app/styles/theme'
import { UserProfileCard } from '@/widgets/UserProfileCard'
import { NotificationIcon } from '@/shared/components/home/NotificationIcon'
import { Text } from '@/shared/components/Text'

function IconTextItem({ children, icon }: { children: ReactNode; icon: JSX.Element }) {
	return (
		<View className="flex-row items-center">
			<View className="px-4">{icon}</View>
			<Text className="text-sm tracking-wide text-[#3D445C] flex-1">{children}</Text>
		</View>
	)
}

export default function ProfileUpgrade() {
	const { hasPermission, requestPermission } = useCameraPermission()
	const router = useRouter()

	const handleStartFaceRecognitionPress = async () => {
		if (!hasPermission) {
			const result = await requestPermission()

			if (result) {
				router.push('/face-detection')
				return
			}

			router.push({ pathname: '/permission', params: { type: 'camera' } })
			return
		}

		router.push('/face-detection')
	}

	return (
		<>
			<Stack.Screen
				options={{
					title: 'Nível da conta',
					headerRight: () => <NotificationIcon />,
				}}
			/>

			<UserProfileCard />

			<ScrollView contentContainerClassName="flex-1 gap-y-6 px-4 pt-8">
				<View className="gap-y-6 flex-1">
					<Text className="tracking-wide text-sm font-semibold text-black">Reconhecimento Facial</Text>
					<IconTextItem icon={<Smile color={defaultTheme.colors.primary[900]} size={24} />}>
						Deixe o seu rosto visível e retire acessórios como óculos, bonés, chapéus ou qualquer item que cubra o seu
						rosto.
					</IconTextItem>
					<IconTextItem icon={<ScanFace color={defaultTheme.colors.primary[900]} size={24} />}>
						Mantenha seu rosto dentro da área marcada no celular, durante todo o processo de reconhecimento facial.
					</IconTextItem>
					<IconTextItem icon={<Sun color={defaultTheme.colors.primary[900]} size={24} />}>
						Procure um ambiente iluminado e sem pessoas ou objetos ao fundo.
					</IconTextItem>
				</View>
				<TouchableOpacity
					className="my-4 flex-row items-center justify-center w-full p-3 gap-x-2 bg-primary-default rounded-lg border border-primary-default shadow-sm"
					onPress={handleStartFaceRecognitionPress}
				>
					<Text className="text-base leading-6 font-semibold text-center text-white">Começar</Text>
					<ArrowRight color="#ffffff" size={18} />
				</TouchableOpacity>
			</ScrollView>
		</>
	)
}
