import React from 'react'
import { Stack } from 'expo-router'

import { DigitalDocumentAvailableList } from '@/widgets/DigitalDocumentAvailableList'
import { DisconnectedWalletScreen } from '@/widgets/DisconnectedWalletScreen'
import { useIsSignedIn } from '@/features/authenticate/useIsSignedIn'

export default function DocumentsAvailable() {
	const isSignedIn = useIsSignedIn()

	if (!isSignedIn) {
		return <DisconnectedWalletScreen />
	}

	return (
		<>
			<Stack.Screen options={{ title: 'Meus documentos' }} />

			<DigitalDocumentAvailableList />
		</>
	)
}
