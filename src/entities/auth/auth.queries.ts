import { revokeAsync as revokeAuthSessionAsync, useAutoDiscovery } from 'expo-auth-session'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import * as authApi from '@/entities/auth/auth.api'
import * as authLib from '@/entities/auth/auth.lib'
import { env } from '@/shared/lib/env'
import { accessToken, refreshToken } from '@/shared/lib/localToken'
import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

const keys = {
	root: () => ['auth'],
	token: () => [...keys.root(), 'token'],
	profile: () => [...keys.root(), 'profile'],
	biometryAuth: () => [...keys.root(), 'biometry-auth'],
	introspectToken: () => [...keys.token(), 'introspect'],
	revalidateToken: () => [...keys.token(), 'revalidate'],
	addOpalaRoleToUser: () => [...keys.root(), 'add-opala-role-to-user'],
	signOut: () => [...keys.root(), 'sign-out'],
}

export function useTokenMutation() {
	return useMutation({
		mutationKey: keys.token(),
		mutationFn: (variables: { code: string; codeVerifier: string; redirectUri: string }) =>
			authApi.getToken(variables.code, variables.codeVerifier, variables.redirectUri),
		onSuccess: (tokenResult) => {
			accessToken.store(tokenResult.access_token)
			refreshToken.store(tokenResult.refresh_token)
			SecureStore.setItem(LocalStorageKeys.ID_TOKEN, tokenResult.id_token)

			authLib.authEvent.emit('createTokens')
		},
		meta: { cache: false },
	})
}

export function useProfileQuery({ enabled }: { enabled: boolean } = { enabled: true }) {
	return useQuery({
		queryKey: keys.profile(),
		queryFn: authApi.getProfile,
		enabled,
		meta: { cache: false },
	})
}

export function useBiometryAuthMutation() {
	return useMutation({
		mutationKey: keys.biometryAuth(),
		mutationFn: authApi.biometryAuth,
		meta: { cache: false },
	})
}

export function useIntrospectTokenMutation() {
	return useMutation({
		mutationKey: keys.introspectToken(),
		mutationFn: authApi.introspectToken,
		meta: { cache: false },
	})
}

export function useRevalidateTokenMutation() {
	return useMutation({
		mutationKey: keys.revalidateToken(),
		mutationFn: authApi.revalidateToken,
		onSuccess: (tokenResult) => {
			accessToken.store(tokenResult.access_token)
			refreshToken.store(tokenResult.refresh_token)

			authLib.authEvent.emit('createTokens')
		},
		meta: { cache: false },
	})
}

export function useSignOutMutation() {
	const queryClient = useQueryClient()
	const discovery = useAutoDiscovery(`${env.EXPO_PUBLIC_PORTAL_AUTH_URL}/auth/realms/pi`)
	const currentRefreshToken = refreshToken.get()

	return useMutation({
		mutationKey: keys.signOut(),
		mutationFn: authApi.signOut,
		onSettled: async () => {
			if (discovery && currentRefreshToken) {
				await revokeAuthSessionAsync(
					{
						clientId: 'portal-web',
						token: currentRefreshToken,
					},
					discovery,
				)
			}

			await accessToken.remove()
			await refreshToken.remove()
			await SecureStore.deleteItemAsync(LocalStorageKeys.ID_TOKEN)

			authLib.authEvent.emit('removeTokens')

			queryClient.removeQueries({ queryKey: keys.token(), exact: true })
			queryClient.removeQueries({ queryKey: keys.profile(), exact: true })

			router.replace('/')
		},
		meta: { cache: false },
	})
}

export function useAddOpalaRoleToUserMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: keys.addOpalaRoleToUser(),
		mutationFn: (variables: { username: string }) => authApi.addOpalRoleToUser(variables.username),
		onSuccess: async () => {
			await queryClient.refetchQueries({ queryKey: keys.profile(), exact: true })
		},
		meta: { cache: false },
	})
}
