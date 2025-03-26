import { useCallback, useEffect, useRef } from 'react'
import { AppState, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as LocalAuthentication from 'expo-local-authentication'
import * as Network from 'expo-network'
import { Stack } from 'expo-router/stack'
import { StatusBar } from 'expo-status-bar'

import { Providers } from '@/app/providers'
import { headerScreenOptions } from '@/app/styles/headerStyle'
import { defaultTheme } from '@/app/styles/theme'
import { useAppStore } from '@/app/useAppStore'
import { BiometricsLock } from '@/widgets/BiometricsLock'
import { GlobalLoading } from '@/widgets/GlobalLoding'
import { OfflineAccess } from '@/widgets/OfflineAccess'
import { useIsSignedIn } from '@/features/authenticate/useIsSignedIn'
import { useTokenRevalidation } from '@/features/authenticate/useTokenRevalidation'
import useNotificationObserver from '@/features/notification/useNotificationObserver'
import BottomSheets from '@/shared/components/BottomSheets'
import { localStorage } from '@/shared/lib/localStorage'
import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

function RootStack() {
	const isConnected = useAppStore((state) => state.isConnected)
	const setIsConnected = useAppStore((state) => state.setIsConnected)
	const isAppLocked = useAppStore((state) => state.isAppLocked)
	const setIsAppLocked = useAppStore((state) => state.setIsAppLocked)
	const isAppFirstRun = useAppStore((state) => state.isAppFirstRun)
	const networkStatus = Network.useNetworkState()

	const isSignedIn = useIsSignedIn()
	const revalidateToken = useTokenRevalidation()
	const appState = useRef(AppState.currentState)

	const isBiometricSignInCompatible = localStorage.getItem(LocalStorageKeys.IS_BIOMETRY_COMPATIBLE) === 'true'

	const biometricSignInEnable = localStorage.getItem(LocalStorageKeys.BIOMETRIC_SIGN_IN_ENABLE) === 'true'

	const shouldShowBiometricsLockScreen = isSignedIn && biometricSignInEnable && isAppLocked && isAppFirstRun

	const handleScreenStateChange = useCallback(async () => {
		if (isSignedIn && isConnected) await revalidateToken()
	}, [isConnected, isSignedIn, revalidateToken])

	useEffect(() => {
		const subscription = AppState.addEventListener('change', (nextAppState) => {
			if (appState.current.match(/inactive|background/) && nextAppState === 'active') handleScreenStateChange()

			appState.current = nextAppState
		})

		return () => {
			subscription.remove()
		}
	}, [handleScreenStateChange])

	useEffect(() => {
		if (networkStatus.isInternetReachable !== undefined) {
			setIsConnected(networkStatus.isInternetReachable)
		}
	}, [setIsConnected, networkStatus])

	useEffect(() => {
		const getBiometricSignInCompatibility = async () => {
			if (isBiometricSignInCompatible || biometricSignInEnable) return

			const hasLocalAuthHardware = await LocalAuthentication.hasHardwareAsync()
			const isLocalAuthEnrolled = await LocalAuthentication.isEnrolledAsync()

			localStorage.setItem(LocalStorageKeys.IS_BIOMETRY_COMPATIBLE, `${hasLocalAuthHardware && isLocalAuthEnrolled}`)
		}

		getBiometricSignInCompatibility()
	}, [biometricSignInEnable, isBiometricSignInCompatible, setIsAppLocked])

	useEffect(() => {
		setIsAppLocked(biometricSignInEnable)
	}, [biometricSignInEnable, setIsAppLocked])

	if (!isConnected) {
		return (
			<View className="flex-1 justify-center items-center bg-white">
				<OfflineAccess />
			</View>
		)
	}

	if (shouldShowBiometricsLockScreen) {
		return <BiometricsLock />
	}

	return (
		<Stack screenOptions={headerScreenOptions} screenListeners={{ state: handleScreenStateChange }}>
			<Stack.Screen name="(tabs)" options={{ title: 'Início', headerShown: false }} />
		</Stack>
	)
}

export default function Layout() {
	useNotificationObserver()

	return (
		<Providers>
			<StatusBar backgroundColor={defaultTheme.colors.primary.default} style="light" />
			<GestureHandlerRootView>
				<RootStack />
			</GestureHandlerRootView>
			<GlobalLoading />
			<BottomSheets />
		</Providers>
	)
}
