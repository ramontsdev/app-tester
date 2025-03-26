import { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, Easing, Image, Platform, StyleSheet, View } from 'react-native'
import LottieView from 'lottie-react-native'
import { hideAsync } from 'expo-splash-screen'

import { useAppStore } from '@/app/useAppStore'
import { localStorage } from '@/shared/lib/localStorage'

import { LocalStorageKeys } from '../utils/localStorageKeys'

type Props = {
	isLoading: boolean
}

export function AnimatedSplash({ isLoading }: Props) {
	const [shouldAnimationRender, setShouldAnimationRender] = useState(isLoading)
	const [animationEnded, setAnimationEnded] = useState(false)
	const opacity = useRef<Animated.Value>(new Animated.Value(1))

	const setIsAnimatedSplashVisible = useAppStore((state) => state.setIsAnimatedSplashVisible)

	const firstRender = useRef(true)

	const handleAnimationFinish = useCallback(() => {
		Animated.timing(opacity.current, {
			delay: 250,
			toValue: 0,
			useNativeDriver: true,
			duration: 250,
			easing: Easing.in(Easing.ease),
		}).start(() => {
			setShouldAnimationRender(false)
			setIsAnimatedSplashVisible(false)
			localStorage.setItem(LocalStorageKeys.FINISHED_ANIMATION, 'true')
			if (firstRender.current) {
				firstRender.current = false
			}
		})
	}, [setIsAnimatedSplashVisible])

	const handleAnimationInit = useCallback(async () => {
		setIsAnimatedSplashVisible(true)

		Animated.timing(opacity.current, {
			delay: 250,
			toValue: 1,
			useNativeDriver: true,
			duration: 250,
			easing: Easing.in(Easing.ease),
		}).start(() => {
			setShouldAnimationRender(true)
		})
	}, [setIsAnimatedSplashVisible])

	useEffect(() => {
		if (isLoading) {
			setShouldAnimationRender(true)
			handleAnimationInit()
		}

		if (animationEnded && !isLoading) {
			handleAnimationFinish()
		}
	}, [isLoading, animationEnded, shouldAnimationRender, handleAnimationFinish, handleAnimationInit])

	function handleTimeout() {
		setTimeout(() => {
			setAnimationEnded(true)
		}, 3000)
	}

	async function hideSplashScreen() {
		await hideAsync()
	}

	if (!shouldAnimationRender) {
		return null
	}

	return (
		<View className="w-full h-full relative top-0 left-0 bg-white z-20" onLayout={hideSplashScreen}>
			<Animated.View style={[StyleSheet.absoluteFill, styles.animatedLoading, { opacity: opacity.current }]}>
				{Platform.OS === 'android' ? (
					<LottieView
						autoPlay
						loop={false}
						onLayout={handleTimeout}
						resizeMode="cover"
						style={{
							width: 300,
							height: 400,
							backgroundColor: '#fff',
						}}
						source={require('../assets/animations/LogoGOVPI.json')}
					/>
				) : (
					<Image
						onLayout={handleTimeout}
						style={{ height: 400, width: 300 }}
						source={require('../assets/images/animation-logo.gif')}
					/>
				)}
			</Animated.View>
		</View>
	)
}

const styles = StyleSheet.create({
	animatedLoading: {
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
})
