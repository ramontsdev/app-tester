import * as LocalAuthentication from 'expo-local-authentication'
import axios, { AxiosResponse } from 'axios'

import * as authTypes from '@/entities/auth/auth.types'
import { env } from '@/shared/lib/env'
import { createFormUrlEncodedBody } from '@/shared/lib/fetch'
import { localStorage } from '@/shared/lib/localStorage'
import { accessToken, refreshToken } from '@/shared/lib/localToken'
import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

const authApi = axios.create({
	baseURL: `${env.EXPO_PUBLIC_PORTAL_AUTH_URL}/auth/realms/pi/protocol/openid-connect`,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
	},
})

const portalApi = axios.create({
	baseURL: `${env.EXPO_PUBLIC_PORTAL_URL}/v1`,
})

export async function getToken(code: string, codeVerifier: string, redirectUri: string) {
	const payload = createFormUrlEncodedBody({
		grant_type: 'authorization_code',
		code,
		redirect_uri: redirectUri,
		client_id: 'portal-web',
		code_verifier: codeVerifier,
	})

	const response = await authApi.post<authTypes.Token, AxiosResponse<authTypes.Token>, string>('/token', payload)

	return response.data
}

export async function getProfile() {
	const token = accessToken.get()

	const response = await authApi.get<authTypes.Profile>('/userinfo', {
		headers: { Authorization: token ? `Bearer ${token}` : undefined },
	})

	return response.data
}

export async function introspectToken(token: string | null) {
	if (!token) return { active: false } as const

	const payload = createFormUrlEncodedBody({
		client_id: env.EXPO_PUBLIC_SERVICE_TOKEN_CLIENT_ID,
		client_secret: env.EXPO_PUBLIC_SERVICE_TOKEN_CLIENT_SECRET,
		token,
	})

	const response = await authApi.post<
		authTypes.TokenIntrospection,
		AxiosResponse<authTypes.TokenIntrospection>,
		string
	>('/token/introspect', payload)

	return response.data
}

export async function revalidateToken(refreshToken: string | null) {
	if (!refreshToken) throw new Error('No refresh token found')

	const payload = createFormUrlEncodedBody({
		grant_type: 'refresh_token',
		client_id: 'portal-web',
		refresh_token: refreshToken,
	})

	const response = await authApi.post<authTypes.Token, AxiosResponse<authTypes.Token>, string>('/token', payload)

	return response.data
}

export async function biometryAuth() {
	const isBiometryAuthCompatible = await LocalAuthentication.hasHardwareAsync()

	localStorage.setItem(LocalStorageKeys.IS_BIOMETRY_COMPATIBLE, `${isBiometryAuthCompatible}`)

	if (!isBiometryAuthCompatible) return

	const hasBiometryAuthSaved = await LocalAuthentication.isEnrolledAsync()

	if (!hasBiometryAuthSaved) return

	const biometricAuthResult = await LocalAuthentication.authenticateAsync({
		disableDeviceFallback: true,
	})

	const currentRefreshToken = refreshToken.get()

	if (!biometricAuthResult.success) await revalidateToken(currentRefreshToken)

	return biometricAuthResult
}

export async function signOut() {
	const currentRefreshToken = refreshToken.get()

	if (!currentRefreshToken) {
		throw new Error('No refresh token found')
	}

	const payload = createFormUrlEncodedBody({
		client_id: 'portal-web',
		refresh_token: currentRefreshToken,
	})

	await authApi.post<void, AxiosResponse<void>, string>('/logout', payload)
}

export async function getServiceToken() {
	const payload = createFormUrlEncodedBody({
		grant_type: 'client_credentials',
		client_id: 'pi-cidadao-api',
		client_secret: env.EXPO_PUBLIC_USER_ATTR_SERVICE_TOKEN_CLIENT_SECRET,
		scope: 'user-attribute-editor',
	})

	const response = await authApi.post<string, AxiosResponse<authTypes.ServiceToken>>('/token', payload)

	return response.data
}

export async function addOpalRoleToUser(username: string) {
	const serviceToken = await getServiceToken()

	await portalApi.post<string, AxiosResponse<void>>(
		'/catalog/setRoles',
		{
			username,
			role: 'opala',
		},
		{
			headers: {
				Authorization: `${serviceToken.token_type} ${serviceToken.access_token}`,
			},
		},
	)
}
