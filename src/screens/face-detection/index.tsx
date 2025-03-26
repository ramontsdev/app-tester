import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera'
import { Stack, useRouter } from 'expo-router'
import { useDebounce } from 'use-debounce'

import { FaceDetectionCamera } from '@/widgets/FaceDetectionCamera'
import { useFaceDetectionStore } from '@/features/detectFace/useFaceDetectionFlow'
import { CustomStackHeader } from '@/shared/components/customNavigationHeaders'
import { FaceDetectionOverlay } from '@/shared/components/faceDetection/FaceDetectionOverlay'
import { FaceDetectionTextualFeedback } from '@/shared/components/faceDetection/FaceDetectionTextualFeedback'
import { SafeAreaView } from '@/shared/components/SafeAreaView'

export default function FaceDetection() {
	const TEXT_VARIANT_CHANGE_DELAY = 950

	const router = useRouter()

	const device = useCameraDevice('front')
	const { hasPermission } = useCameraPermission()

	const overlayVariant = useFaceDetectionStore((state) => state.overlayVariant)
	const textVariant = useFaceDetectionStore((state) => state.textVariant)

	const [delayedTextVariant] = useDebounce(textVariant, TEXT_VARIANT_CHANGE_DELAY)

	if (!hasPermission) return router.push({ pathname: '/permission', params: { type: 'camera' } })
	if (!device) return router.push({ pathname: '/generic-error', params: { type: 'camera' } })

	return (
		<>
			<Stack.Screen
				options={{
					title: 'Nível da conta',
					header: (props) => <CustomStackHeader navigateProps={props} className="bg-transparent" />,
					headerShown: true,
					headerTransparent: true,
					headerStyle: {},
				}}
			/>

			<SafeAreaView>
				<FaceDetectionTextualFeedback variant={delayedTextVariant} />
				<FaceDetectionCamera />
				<FaceDetectionOverlay variant={overlayVariant} />
			</SafeAreaView>
		</>
	)
}
