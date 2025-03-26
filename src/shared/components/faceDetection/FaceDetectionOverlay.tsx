import { useCallback, useEffect } from 'react'
import { useWindowDimensions } from 'react-native'
import { useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'
import { Canvas, Group, interpolateColors, Mask, Oval, Rect } from '@shopify/react-native-skia'

import { useFaceDectionSizes } from '@/features/detectFace/useFaceDetectionFlow'

export type FaceDetectionOverlayVariant = 'idle' | 'success' | 'error'

type Props = {
	variant?: FaceDetectionOverlayVariant
}

export function FaceDetectionOverlay({ variant = 'idle' }: Props) {
	const { width, height } = useWindowDimensions()
	const { oval } = useFaceDectionSizes()

	const ACCEPTANCE_DELAY = 2000

	const ringColorProgress = useSharedValue(0)
	const errorRingOpacityProgress = useSharedValue(0)
	const variantRingOpacityProgress = useSharedValue(1)

	const ringColor = useDerivedValue(() => {
		return interpolateColors(ringColorProgress.value, [0, 1], ['rgb(3, 78, 162)', 'rgb(41, 150, 86)'])
	})

	const handleRingColorByVariant = useCallback(() => {
		const ringColorVariantMap: Record<FaceDetectionOverlayVariant, () => void> = {
			idle: () => {
				variantRingOpacityProgress.value = withTiming(1, { duration: 250 })
				errorRingOpacityProgress.value = withTiming(0, { duration: 250 })
				ringColorProgress.value = withTiming(0, { duration: ACCEPTANCE_DELAY })
			},
			success: () => {
				variantRingOpacityProgress.value = withTiming(1, { duration: 250 })
				errorRingOpacityProgress.value = withTiming(0, { duration: 250 })
				ringColorProgress.value = withTiming(1, { duration: ACCEPTANCE_DELAY })
			},
			error: () => {
				variantRingOpacityProgress.value = withTiming(0, { duration: 250 })
				errorRingOpacityProgress.value = withTiming(1, { duration: 250 })
			},
		}

		return ringColorVariantMap[variant]()
	}, [errorRingOpacityProgress, ringColorProgress, variant, variantRingOpacityProgress])

	useEffect(() => {
		handleRingColorByVariant()
	}, [handleRingColorByVariant])

	return (
		<Canvas className="absolute top-0 left-0 z-10" style={{ width, height }}>
			<Mask
				mode="luminance"
				mask={
					<Group>
						<Rect x={0} y={0} width={width} height={height} color="white" />
						<Oval x={oval.x} y={oval.y} width={oval.width} height={oval.height} color="black" />
					</Group>
				}
			>
				<Rect x={0} y={0} width={width} height={height} color="rgba(0, 0, 0, 0.8)" />
			</Mask>
			<Oval
				x={oval.x}
				y={oval.y}
				width={oval.width}
				height={oval.height}
				style="stroke"
				strokeWidth={8}
				color={ringColor}
				opacity={variantRingOpacityProgress}
			/>
			<Oval
				x={oval.x}
				y={oval.y}
				width={oval.width}
				height={oval.height}
				style="stroke"
				strokeWidth={8}
				color="rgb(221, 70, 70)"
				opacity={errorRingOpacityProgress}
			/>
		</Canvas>
	)
}
