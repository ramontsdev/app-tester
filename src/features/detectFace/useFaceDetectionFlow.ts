import { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'
import { create } from 'zustand'

import { FaceDetectionOverlayVariant } from '@/shared/components/faceDetection/FaceDetectionOverlay'
import { FaceDetectionTextualFeedbackVariant } from '@/shared/components/faceDetection/FaceDetectionTextualFeedback'

type FaceDetectionStore = {
	overlayVariant: FaceDetectionOverlayVariant
	textVariant: FaceDetectionTextualFeedbackVariant
	isFaceDetectionLoading: boolean
	setOverlayVariant: (variant: FaceDetectionOverlayVariant) => void
	setTextVariant: (variant: FaceDetectionTextualFeedbackVariant) => void
	setIsFaceDetectionLoading: (value: boolean) => void
}

export const useFaceDetectionStore = create<FaceDetectionStore>((set) => ({
	overlayVariant: 'idle',
	textVariant: 'idle',
	isFaceDetectionLoading: false,
	setOverlayVariant: (variant) => set({ overlayVariant: variant }),
	setTextVariant: (variant) => set({ textVariant: variant }),
	setIsFaceDetectionLoading: (value) => set({ isFaceDetectionLoading: value }),
}))

export const useFaceDectionSizes = () => {
	const { width, height } = useWindowDimensions()

	return useMemo(() => {
		const ovalWidth = width / 1.4
		const ovalHeight = height / 2
		const ovalX = width / 2 - ovalWidth / 2
		const ovalY = height / 2 - ovalHeight / 2

		return {
			oval: {
				width: ovalWidth,
				height: ovalHeight,
				x: ovalX,
				y: ovalY,
				bound: {
					top: ovalY,
					right: ovalX + ovalWidth,
					bottom: ovalY + ovalHeight,
					left: ovalX,
				},
			},
		}
	}, [height, width])
}
