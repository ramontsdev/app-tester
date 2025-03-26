import { useSyncExternalStore } from 'react'

import { authLib } from '@/entities/auth'

export const useIsSignedIn = () => {
	const isSignedIn = useSyncExternalStore(authLib.subscribeHasToken, authLib.getHasToken)

	return isSignedIn
}
