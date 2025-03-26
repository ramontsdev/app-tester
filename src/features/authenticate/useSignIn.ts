import { useCallback, useEffect } from 'react'
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session'
import * as Location from 'expo-location'
import { Href } from 'expo-router'
import { TrueSheet } from '@lodev09/react-native-true-sheet'

import { useAppStore } from '@/app/useAppStore'
import { useOpenGlobalLoading } from '@/widgets/GlobalLoding'
import { authQueries } from '@/entities/auth'
import { env } from '@/shared/lib/env'
import { localStorage } from '@/shared/lib/localStorage'
import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

type SigInParams = {
	nextRoute: Href
	routeParams?: Record<string, string>
}

export function useSignIn() {
	const discovery = useAutoDiscovery(`${env.EXPO_PUBLIC_PORTAL_AUTH_URL}/auth/realms/pi`)
	const globalLoding = useOpenGlobalLoading()
	const setIsLoggedNow = useAppStore((state) => state.setIsLoggedNow)

	const redirectUri = makeRedirectUri({
		scheme: 'pidigital',
		path: '.',
	})

	const [request, result, promptAsync] = useAuthRequest(
		{
			clientId: 'portal-web',
			redirectUri,
			scopes: ['openid', 'profile', 'offline_access'],
			extraParams: {
				client_source_app_universal_link: 'pidigital://',
				client_source_app_bundle: 'br.gov.pi.pidigital',
			},
		},
		discovery,
	)

	const { mutate: getToken, error: erroToken } = authQueries.useTokenMutation()

	useEffect(() => {
		if (result?.type !== 'success') return

		if (!request?.codeVerifier) return

		getToken({
			code: result.params.code,
			codeVerifier: request.codeVerifier,
			redirectUri,
		})

		setIsLoggedNow(true)
	}, [result, request, getToken, redirectUri])

	useEffect(() => {
		if (erroToken) {
			globalLoding.closeGlobalLoading()
			TrueSheet.present('login-fail')
			return
		}
	}, [erroToken, globalLoding])

	useEffect(() => {
		if (result?.type !== 'success' && result?.type !== undefined) {
			globalLoding.closeGlobalLoading()
			return
		}
	}, [globalLoding, result])

	useEffect(() => {
		const getLocationPermissionState = async () => {
			const permissions = await Location.getForegroundPermissionsAsync()

			if (permissions.granted) {
				localStorage.setItem(LocalStorageKeys.LOCATION_ENABLE, 'true')
			}
		}

		getLocationPermissionState()
	}, [])

	return useCallback(
		(params?: SigInParams, autoClose: boolean = true) => {
			globalLoding.openGlobalLoading(
				['Fazendo login', 'Aguarde'],
				{
					nextRoute: params?.nextRoute,
					routeParams: params?.routeParams,
				},
				autoClose,
			)
			promptAsync()
		},
		[globalLoding, promptAsync],
	)
}
