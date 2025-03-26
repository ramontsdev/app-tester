import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BackHandler, View } from 'react-native'
import { WebView } from 'react-native-webview'
import * as Location from 'expo-location'
import { Stack, useGlobalSearchParams } from 'expo-router'

import { useAddRecentService } from '@/features/addRecentService/useAddRecentService'
import { useAuthStore } from '@/features/authenticate/useAuthStore'
import { DownloadParams, useDownloadAndShare } from '@/features/downloadAndShare/useDownloadAndShare'
import { CustomStackHeader } from '@/shared/components/customNavigationHeaders/CustomStackHeader'
import { env } from '@/shared/lib/env'
import { accessToken } from '@/shared/lib/localToken'

type Message = {
	type: string
	payload: unknown
}

export default function ServicesWebView() {
	const service = useGlobalSearchParams<{ uri: string; name: string; slug: string; icon: string; category: string }>()
	const token = accessToken.get()

	const profile = useAuthStore((state) => state.profile)

	const { mutate: downloadAndShare } = useDownloadAndShare()

	const { addRecentServices: addRecentServices } = useAddRecentService()

	const webViewRef = useRef<WebView>(null)
	const [webViewCanGoBack, setWebViewCanGoBack] = useState(false)

	const [message, setMessage] = useState<Message | null>(null)

	const headers = useMemo(
		() => ({
			Authorization: `Bearer ${token}`,
			xviaNoHeader: 'true',
		}),
		[token],
	)

	const newTokenMessage = useCallback(() => {
		if (!token) return

		webViewRef.current?.injectJavaScript(
			`
        document.cookie='kcToken=${btoa(token)};path=/';
        window.postMessage({type: "NEW_TOKEN", payload: "${token}"});
      `,
		)
	}, [webViewRef, token])

	useEffect(() => {
		if (service.slug && service.icon) {
			addRecentServices({
				title: service.name,
				slug: service.slug,
				icon: service.icon,
				link: service.uri,
				category: service.category,
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [service])

	useEffect(() => {
		newTokenMessage()
	}, [webViewRef, newTokenMessage, token])

	useEffect(() => {
		if (message) {
			webViewRef.current?.injectJavaScript(`
        window.postMessage(${JSON.stringify(message)})
      `)
		}
	}, [message])

	useEffect(() => {
		const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			if (webViewCanGoBack) {
				webViewRef.current?.goBack()
				return true
			} else {
				return false
			}
		})

		return () => backHandler.remove()
	}, [webViewCanGoBack])

	const resolveWebviewUri = useCallback(() => {
		if (service.uri.startsWith('http')) {
			return service.uri
		}
		return `${env.EXPO_PUBLIC_PORTAL_URL}${service.uri}`
	}, [service.uri])

	return (
		<>
			<Stack.Screen
				options={{
					title: 'Serviço',
					headerShown: true,
					animation: 'none',
					header: (props) => (
						<CustomStackHeader webviewRef={webViewRef} webViewCanGoBack={webViewCanGoBack} navigateProps={props} />
					),
				}}
			/>

			<View className="flex flex-1 relative">
				{token && service.uri && (
					<WebView
						ref={webViewRef}
						originWhitelist={['http://*', 'https://*', 'intent://*']}
						source={{
							uri: resolveWebviewUri(),
							headers,
						}}
						onLoadEnd={newTokenMessage}
						onLoadProgress={({ nativeEvent }) => {
							setWebViewCanGoBack(nativeEvent.canGoBack)
						}}
						onMessage={async (event) => {
							if (event.nativeEvent.data) {
								let eventData
								try {
									eventData = JSON.parse(event.nativeEvent.data) as { type: string; payload: unknown }
									switch (eventData?.type) {
										case 'ACCESS_TOKEN':
											setMessage({
												type: 'ACCESS_TOKEN_RESPONSE',
												payload: token,
											})
											break

										case 'USER_INFO':
											setMessage({
												type: 'USER_INFO_RESPONSE',
												payload: profile,
											})
											break

										case 'DOWNLOAD':
											downloadAndShare(eventData?.payload as DownloadParams)
											break

										case 'GET_CURRENT_POSITION': {
											const { status } = await Location.requestForegroundPermissionsAsync()

											try {
												if (status === 'granted') {
													const { coords } = await Location.getCurrentPositionAsync({})

													setMessage({
														type: 'GET_CURRENT_POSITION_RESPONSE',
														payload: coords,
													})
												} else {
													setMessage({
														type: 'GET_CURRENT_POSITION_RESPONSE',
														payload: {},
													})
												}
											} catch (e) {
												const error = e as Error
												setMessage({
													type: 'GET_CURRENT_POSITION_RESPONSE',
													payload: { error: error.message },
												})
											}

											break
										}

										default:
											setMessage({
												type: eventData?.type,
												payload: eventData?.payload,
											})
											break
									}
								} catch {
									// console.log(`Error while parse json nativeEvent: ${error}`);
								}
							}
						}}
						sharedCookiesEnabled
						thirdPartyCookiesEnabled
						javaScriptEnabled
						startInLoadingState
					/>
				)}
			</View>
		</>
	)
}
