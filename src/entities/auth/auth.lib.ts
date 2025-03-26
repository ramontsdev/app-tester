import * as SecureStore from 'expo-secure-store'
import { AxiosInstance } from 'axios'
import { EventEmitter } from 'eventemitter3'

import * as authApi from '@/entities/auth/auth.api'
import { accessToken, refreshToken } from '@/shared/lib/localToken'
import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

export const authEvent = new EventEmitter()

export function hasToken() {
	const currentAccessToken = accessToken.get()
	const currentRefreshtoken = refreshToken.get()
	const idToken = SecureStore.getItem(LocalStorageKeys.ID_TOKEN)

	return Boolean(currentAccessToken && currentRefreshtoken && idToken)
}

export function createAuthInterceptor(api: AxiosInstance) {
	api.interceptors.request.use(async (config) => {
		const currentRefreshToken = refreshToken.get()

		const tokenRevalidationResult = await authApi.revalidateToken(currentRefreshToken)

		accessToken.store(tokenRevalidationResult.access_token)

		config.headers.Authorization = `Bearer ${tokenRevalidationResult.access_token}`

		return config
	})
}

export function subscribeHasToken(onStoreChange: () => void) {
	authEvent.on('createTokens', onStoreChange)
	authEvent.on('removeTokens', onStoreChange)

	return () => {
		authEvent.removeListener('createTokens', onStoreChange)
		authEvent.removeListener('removeTokens', onStoreChange)
	}
}

export function getHasToken() {
	const currentAccessToken = accessToken.get()
	const currentRefreshtoken = refreshToken.get()
	const idToken = SecureStore.getItem(LocalStorageKeys.ID_TOKEN)

	return Boolean(currentAccessToken && currentRefreshtoken && idToken)
}
