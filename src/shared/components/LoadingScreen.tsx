import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { Animated, Easing, Image, Modal, Platform, StyleSheet, View } from 'react-native'
import LottieView from 'lottie-react-native'

type Props = {
	isLoading: boolean
	children?: ReactElement
	delayAnimationInit?: number
	onAnimationEnd?: () => void
	onRequestClose?: () => void
}

export function LoadingScreen({
	isLoading,
	children,
	onAnimationEnd,
	onRequestClose,
	delayAnimationInit = 250,
}: Props) {
	const [shouldAnimationRender, setShouldAnimationRender] = useState(isLoading)
	const [animationEnded, setAnimationEnded] = useState(false)
	const opacity = useRef<Animated.Value>(new Animated.Value(1))

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

			if (firstRender.current) {
				firstRender.current = false
				onRequestClose?.()
			}
		})
	}, [opacity, setShouldAnimationRender, onRequestClose])

	const handleAnimationInit = useCallback(() => {
		Animated.timing(opacity.current, {
			delay: delayAnimationInit,
			toValue: 1,
			useNativeDriver: true,
			duration: delayAnimationInit,
			easing: Easing.in(Easing.ease),
		}).start(() => {
			setShouldAnimationRender(true)
		})
	}, [delayAnimationInit])

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
			onAnimationEnd?.()
		}, 3000)
	}

	if (!shouldAnimationRender) {
		return null
	}

	return (
		<Modal transparent>
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

				<View className="w-full h-[46%] absolute bottom-0">{children}</View>
			</Animated.View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	animatedLoading: {
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
})
