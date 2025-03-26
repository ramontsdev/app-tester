import { ReactNode } from 'react'
import { Stack } from 'expo-router'

import { DigitalDocumentsList } from '@/widgets/DigitalDocumentsList'
import { DisconnectedWalletScreen } from '@/widgets/DisconnectedWalletScreen'
import { LowProfileLevelWalletScreen } from '@/widgets/LowProfileLevelWalletScreen'
import { useIsSignedIn } from '@/features/authenticate/useIsSignedIn'
import { useUserProfile } from '@/features/authenticate/useUserProfile'

export default function Wallet() {
	const isSignedIn = useIsSignedIn()
	const { isBronzeLevel } = useUserProfile({ enabled: isSignedIn })

	const isLowLevel = isSignedIn && isBronzeLevel

	const WalletStack = ({ children }: { children: ReactNode }) => {
		return (
			<>
				<Stack.Screen options={{ title: 'Carteira Digital' }} />
				{children}
			</>
		)
	}

	if (!isSignedIn) {
		return (
			<WalletStack>
				<DisconnectedWalletScreen />
			</WalletStack>
		)
	}

	if (isLowLevel) {
		return (
			<WalletStack>
				<LowProfileLevelWalletScreen />
			</WalletStack>
		)
	}

	return (
		<WalletStack>
			<DigitalDocumentsList />
		</WalletStack>
	)
}
