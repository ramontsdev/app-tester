import * as SecureStore from 'expo-secure-store'

import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

type LocalStorageTokenKeysTuple = [LocalStorageKeys, LocalStorageKeys, LocalStorageKeys]

function createLocalTokenFunctions(keys: LocalStorageTokenKeysTuple) {
	const [headerKey, payloadKey, signatureKey] = keys

	const store = (token: string) => {
		const [header, payload, signature] = token.split('.')

		SecureStore.setItem(headerKey, header)
		SecureStore.setItem(payloadKey, payload)
		SecureStore.setItem(signatureKey, signature)
	}

	const get = () => {
		const header = SecureStore.getItem(headerKey)
		const payload = SecureStore.getItem(payloadKey)
		const signature = SecureStore.getItem(signatureKey)

		if (!header || !payload || !signature) return null

		return `${header}.${payload}.${signature}`
	}

	const remove = async () => {
		try {
			await Promise.all([
				SecureStore.deleteItemAsync(headerKey),
				SecureStore.deleteItemAsync(payloadKey),
				SecureStore.deleteItemAsync(signatureKey),
			])
		} catch (e) {
			const error = e as Error
			console.log(`[ERROR: CLEAR_TOKEN]: ${error.message}`)
		}
	}

	return { store, get, remove }
}

export const accessToken = createLocalTokenFunctions([
	LocalStorageKeys.ACCESS_TOKEN_HEADER,
	LocalStorageKeys.ACCESS_TOKEN_PAYLOAD,
	LocalStorageKeys.ACCESS_TOKEN_SIGNATURE,
])

export const refreshToken = createLocalTokenFunctions([
	LocalStorageKeys.REFRESH_TOKEN_HEADER,
	LocalStorageKeys.REFRESH_TOKEN_PAYLOAD,
	LocalStorageKeys.REFRESH_TOKEN_SIGNATURE,
])
