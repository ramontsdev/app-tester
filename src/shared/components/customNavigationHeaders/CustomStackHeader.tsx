import React from 'react'
import { Platform, StatusBar, View } from 'react-native'
import WebView from 'react-native-webview'
import { ArrowLeft } from 'lucide-react-native'
import Constants from 'expo-constants'
import { NativeStackHeaderProps } from '@react-navigation/native-stack/src/types'

import { cn } from '../../utils/cn'
import { Text } from '../Text'
import { Touchable } from '../Touchable'

type Props = {
	navigateProps: NativeStackHeaderProps
	className?: string
	webViewCanGoBack?: boolean
	webviewRef?: React.RefObject<WebView<{}>>
}

export function CustomStackHeader({
	navigateProps: { options, navigation },
	webViewCanGoBack,
	webviewRef,
	className,
}: Props) {
	const isIOS = Platform.OS === 'ios'
	const statusBarHeight = isIOS ? Constants.statusBarHeight : StatusBar.currentHeight

	function getHeaderRight() {
		if (options.headerRight) {
			const HeaderRight = options.headerRight
			return <HeaderRight canGoBack={navigation.canGoBack()} />
		}

		return null
	}

	function goBack() {
		if (webViewCanGoBack) {
			webviewRef?.current?.goBack()
		} else {
			navigation.goBack()
		}
	}

	return (
		<View className={cn('w-full bg-primary-default', className)} style={{ paddingTop: statusBarHeight }}>
			<View className="flex-row items-center gap-2 justify-between p-4 bg-transparent">
				<View className="flex-row items-center gap-2">
					<Touchable onPress={goBack} hitSlop={5}>
						<ArrowLeft color={'#fff'} size={28} />
					</Touchable>

					<Text className="font-semibold text-xl text-white" numberOfLines={1}>
						{options.title}
					</Text>
				</View>

				<View>{getHeaderRight()}</View>
			</View>
		</View>
	)
}
