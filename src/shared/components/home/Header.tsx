import React from 'react'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'

import type { AnimatedStyle } from 'react-native-reanimated'

import { SearchServicesInput } from '@/widgets/SearchServicesInput'
import { UserCorner } from '@/widgets/UserConer'
import { useIsSignedIn } from '@/features/authenticate/useIsSignedIn'
import NegativeLogo from '@/shared/assets/images/negative-logo.svg'

type Props = {
	contentAnimatedStyle: AnimatedStyle
	searchBarAnimatedStyle: AnimatedStyle
}

export function Header({ contentAnimatedStyle, searchBarAnimatedStyle }: Props) {
	const isSignedIn = useIsSignedIn()

	return (
		<View className="w-full items-center justify-center bg-primary-default relative z-10 py-8">
			<Animated.View className="flex-row w-full px-4 justify-between items-center" style={contentAnimatedStyle}>
				<NegativeLogo />
				{isSignedIn && <UserCorner />}
			</Animated.View>

			<View className="h-2 rounded-b-lg bg-primary-default w-full absolute -bottom-2" />

			<Animated.View className="px-4 absolute w-full z-20" style={searchBarAnimatedStyle}>
				<SearchServicesInput />
			</Animated.View>
		</View>
	)
}
