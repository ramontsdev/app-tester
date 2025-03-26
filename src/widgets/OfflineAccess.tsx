import { useCallback, useState } from 'react'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'
import * as Network from 'expo-network'
import * as SplashScreen from 'expo-splash-screen'
import { useQueryClient } from '@tanstack/react-query'

import { defaultTheme } from '@/app/styles/theme'
import { useAppStore } from '@/app/useAppStore'
import { OfflineAccessIcon } from '@/shared/assets/images'
import { Text } from '@/shared/components/Text'

export function OfflineAccess() {
	const [isLoading, setIsLoading] = useState(false)

	const queryClient = useQueryClient()
	const setIsConnected = useAppStore((state) => state.setIsConnected)

	const onLayoutRootView = useCallback(async () => {
		await SplashScreen.hideAsync()
	}, [])

	const handleRetry = async () => {
		setIsLoading(true)
		await queryClient.refetchQueries()
		const connectivityState = await Network.getNetworkStateAsync()
		setIsConnected(connectivityState.isInternetReachable ?? true)
		setIsLoading(false)
	}

	return (
		<View className="w-full flex-1 flex justify-center items-center px-5" onLayout={onLayoutRootView}>
			<OfflineAccessIcon />
			<Text className="font-semibold text-base mt-16 text-primary-900 text-center">Parece que você está offline.</Text>
			<Text className="font-medium text-sm mt-3 text-primary-800 text-center">
				Verifique sua conexão com a internet e tente acessar o Gov.pi Cidadão novamente.
			</Text>
			{isLoading ? (
				<ActivityIndicator className="mt-6" size="large" color={defaultTheme.colors.primary.default} />
			) : (
				<TouchableOpacity onPress={handleRetry} className="w-full mt-6 px-4 py-3 bg-primary-default rounded-lg">
					<Text className="text-center font-semibold tracking-wide color-white text-base leading-5">
						Tentar novamente
					</Text>
				</TouchableOpacity>
			)}
		</View>
	)
}
