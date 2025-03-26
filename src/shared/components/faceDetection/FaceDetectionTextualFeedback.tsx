import { ReactNode, useMemo } from 'react'
import { ActivityIndicator } from 'react-native'
import Animated, { FadeIn, FadeInUp, FadeOut, FadeOutDown } from 'react-native-reanimated'

import { useFaceDectionSizes, useFaceDetectionStore } from '@/features/detectFace/useFaceDetectionFlow'
import { Text } from '@/shared/components/Text'

export type FaceDetectionTextualFeedbackVariant = 'idle' | 'too-far' | 'hold' | 'success' | 'too-close' | 'error'

type FaceDetectionTextualFeedbackProps = {
	variant?: FaceDetectionTextualFeedbackVariant
}

function FaceDetectionText({ children }: { children: ReactNode }) {
	const { oval } = useFaceDectionSizes()

	const textY = useMemo(() => oval.y - 56, [oval.y])

	const enteringTransition = useMemo(() => {
		return FadeInUp.springify()
			.damping(16)
			.mass(1)
			.stiffness(192)
			.overshootClamping(0)
			.restDisplacementThreshold(0.1)
			.restSpeedThreshold(5)
	}, [])

	const exitingTransition = useMemo(() => {
		return FadeOutDown.springify()
			.damping(16)
			.mass(1)
			.stiffness(192)
			.overshootClamping(0)
			.restDisplacementThreshold(0.1)
			.restSpeedThreshold(5)
	}, [])

	return (
		<Animated.View
			className="absolute flex-1 w-full px-4 z-20"
			style={{ top: textY }}
			entering={enteringTransition}
			exiting={exitingTransition}
		>
			<Text className="font-bold text-base text-center leading-5 text-white">{children}</Text>
		</Animated.View>
	)
}

function FaceDetectionLoading() {
	const { oval } = useFaceDectionSizes()

	const loadingY = useMemo(() => oval.y + oval.height + 56, [oval.height, oval.y])

	return (
		<Animated.View
			className="absolute flex-1 w-full px-4 z-20"
			style={{ top: loadingY }}
			entering={FadeIn}
			exiting={FadeOut}
		>
			<ActivityIndicator color={'white'} size="large" />
		</Animated.View>
	)
}

export function FaceDetectionTextualFeedback({ variant = 'idle' }: FaceDetectionTextualFeedbackProps) {
	const isFaceDetectionLoading = useFaceDetectionStore((state) => state.isFaceDetectionLoading)

	const FeedbackText = useMemo(() => {
		const faceDetectionTextVariantMap: Record<FaceDetectionTextualFeedbackVariant, () => JSX.Element> = {
			idle: () => <FaceDetectionText>Posiciona o seu rosto dentro do delimitador.</FaceDetectionText>,
			'too-far': () => <FaceDetectionText>Aproxime seu rosto ao centro da tela.</FaceDetectionText>,
			hold: () => <FaceDetectionText>Mantenha o dispositivo nessa posição e aguarde.</FaceDetectionText>,
			success: () => <FaceDetectionText>Captura bem-sucedida.</FaceDetectionText>,
			'too-close': () => <FaceDetectionText>Afaste o seu rosto do centro da tela.</FaceDetectionText>,
			error: () => <FaceDetectionText>Autenticação falhou.{'\n'}Tente novamente.</FaceDetectionText>,
		}

		return faceDetectionTextVariantMap[variant]
	}, [variant])

	return (
		<>
			<FeedbackText />
			{isFaceDetectionLoading && <FaceDetectionLoading />}
		</>
	)
}
