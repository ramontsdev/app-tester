import React, { ReactNode } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'

import { DigitalDocumentCarousel } from '@/widgets/DigitalDocumentCarousel'
import { DigitalDocumentNotCarousel } from '@/widgets/DigitalDocumentNotCarousel'

export default function DocumentVisualizer() {
	const params = useLocalSearchParams<{ documentType: string; isCarousel: string }>()

	const isCarousel = params.isCarousel === 'true'

	const DocumentVisualizerStack = ({ children }: { children: ReactNode }) => {
		return (
			<>
				<Stack.Screen options={{ title: 'Carteira Digital' }} />
				{children}
			</>
		)
	}

	if (isCarousel) {
		return (
			<DocumentVisualizerStack>
				<DigitalDocumentCarousel documentType={params.documentType} />
			</DocumentVisualizerStack>
		)
	}

	return (
		<DocumentVisualizerStack>
			<DigitalDocumentNotCarousel documentType={params.documentType} />
		</DocumentVisualizerStack>
	)
}
