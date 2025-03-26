import { useCallback } from 'react'
import * as SecureStore from 'expo-secure-store'
import { TrueSheet } from '@lodev09/react-native-true-sheet'

import { useSignOut } from '@/features/authenticate/useSignOut'
import { authQueries } from '@/entities/auth'
import { accessToken, refreshToken } from '@/shared/lib/localToken'
import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

export function useTokenRevalidation() {
	const { mutateAsync: revalidateToken } = authQueries.useRevalidateTokenMutation()
	const signOut = useSignOut()

	return useCallback(async () => {
		try {
			const currentRefreshToken = refreshToken.get()
			const tokenRevalidation = await revalidateToken(currentRefreshToken)

			accessToken.store(tokenRevalidation.access_token)
			SecureStore.setItem(LocalStorageKeys.ID_TOKEN, tokenRevalidation.id_token)

			console.log('[Auth] Token successfully revalidated')
		} catch (error) {
			signOut()
			TrueSheet.present('session-expired')
			console.log('[Auth] Error while revalidating token', error)
		}
	}, [revalidateToken, signOut])
}
