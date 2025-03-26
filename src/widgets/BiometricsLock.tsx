import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'
import * as SplashScreen from 'expo-splash-screen'

import { useAppStore } from '@/app/useAppStore'
import { useSignOut } from '@/features/authenticate/useSignOut'
import { authQueries } from '@/entities/auth'
import { BiometricsIllustration } from '@/shared/assets/images'
import { Text } from '@/shared/components/Text'
import { Touchable } from '@/shared/components/Touchable'
import { accessToken, refreshToken } from '@/shared/lib/localToken'
import { cn } from '@/shared/utils/cn'
import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

export function BiometricsLock() {
	const [loading, setLoading] = useState(false)
	const [biometricAuth, setBiometricAuth] = useState<LocalAuthentication.LocalAuthenticationResult>({
		success: false,
		error: '',
	})

	const signOut = useSignOut()
	const { mutateAsync: revalidateTokenMutation } = authQueries.useRevalidateTokenMutation()

	const setIsAppLocked = useAppStore((state) => state.setIsAppLocked)

	const onLayoutRootView = useCallback(async () => {
		await SplashScreen.hideAsync()
	}, [])

	const shouldShowLogoutButton = biometricAuth.success === false && biometricAuth.error === 'user_cancel'

	const revalidateToken = useCallback(async () => {
		const currentRefreshToken = refreshToken.get()
		const revalidatedToken = await revalidateTokenMutation(currentRefreshToken)

		accessToken.store(revalidatedToken.access_token)
		refreshToken.store(revalidatedToken.refresh_token)
		SecureStore.setItem(LocalStorageKeys.ID_TOKEN, revalidatedToken.id_token)
	}, [revalidateTokenMutation])

	const invokeBiometricAuth = useCallback(async () => {
		setLoading(true)

		const result = await LocalAuthentication.authenticateAsync({
			biometricsSecurityLevel: 'strong',
			promptMessage: 'Autenticação',
			cancelLabel: 'Cancelar',
			fallbackLabel: 'Usar PIN',
			disableDeviceFallback: true,
		})

		await revalidateToken()

		setBiometricAuth(result)

		setLoading(false)
	}, [revalidateToken])

	useEffect(() => {
		invokeBiometricAuth()
	}, [invokeBiometricAuth])

	useEffect(() => {
		if (biometricAuth.success) {
			setIsAppLocked(false)
		}
	}, [biometricAuth, setIsAppLocked])

	return (
		<View className="flex-1 bg-white" onLayout={onLayoutRootView}>
			<View className="flex-grow items-center justify-center px-5">
				<View className="w-full items-center justify-center space-y-6">
					<Text className="text-center text-md font-semibold tracking-wide text-lg w-full text-primary-default">
						Use sua impressão digital ou Face ID para desbloquear o App
					</Text>
					<BiometricsIllustration />
				</View>
				<Touchable
					onPress={invokeBiometricAuth}
					className={cn(
						'items-center jusitfy-center w-full min-h-12 mt-14 px-4 py-3 bg-primary-default rounded-lg',
						loading && 'opacity-50',
					)}
					disabled={loading}
				>
					{loading ? (
						<ActivityIndicator color="white" />
					) : (
						<Text className="text-center font-semibold tracking-wide color-white text-base" style={{ lineHeight: 20 }}>
							Usar biometria
						</Text>
					)}
				</Touchable>
				<View className="w-full min-h-6 mt-6 items-center">
					{shouldShowLogoutButton && (
						<Touchable onPress={signOut}>
							<Text className="text-center text-primary-default text-base">Encerrar sessão</Text>
						</Touchable>
					)}
				</View>
			</View>
		</View>
	)
}
