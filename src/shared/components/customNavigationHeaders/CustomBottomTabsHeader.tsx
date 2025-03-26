import React from 'react'
import { Platform, StatusBar, View } from 'react-native'
import { ArrowLeft } from 'lucide-react-native'
import Constants from 'expo-constants'
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs/src/types'

import { cn } from '../../utils/cn'
import { Text } from '../Text'
import { Touchable } from '../Touchable'

type Props = {
	navigateProps: BottomTabHeaderProps
	className?: string
}

export function CustomBottomTabsHeader({ navigateProps: { options, navigation }, className }: Props) {
	const isIOS = Platform.OS === 'ios'
	const statusBarHeight = isIOS ? Constants.statusBarHeight : StatusBar.currentHeight

	function getHeaderRight() {
		if (options.headerRight) {
			const HeaderRight = options.headerRight
			return <HeaderRight />
		}

		return null
	}

	return (
		<View className={cn('w-full bg-primary-default', className)} style={{ paddingTop: statusBarHeight }}>
			<View className="flex-row items-center gap-2 justify-between p-4 bg-transparent">
				<View className="flex-row items-center gap-2">
					{navigation.canGoBack() && (
						<Touchable onPress={navigation.goBack} hitSlop={5}>
							<ArrowLeft color={'#fff'} size={28} />
						</Touchable>
					)}

					<Text className="font-semibold text-xl text-white" numberOfLines={1}>
						{options.title}
					</Text>
				</View>

				<View>{getHeaderRight()}</View>
			</View>
		</View>
	)
}
