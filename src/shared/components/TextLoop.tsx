import React, { useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'

import { Text } from './Text'

const useFetAnimationValue = (delay: number, duration: number, callBack: Function) => {
	let isMounted = true
	const animationValue = useRef(new Animated.Value(0)).current
	const fadeInOut = () => {
		Animated.sequence([
			Animated.timing(animationValue, {
				delay: 200,
				duration: duration,
				toValue: 0.5,
				useNativeDriver: true,
			}),
			Animated.timing(animationValue, {
				delay: delay,
				duration: duration,
				toValue: 1,
				useNativeDriver: true,
			}),
		]).start(() => {
			if (isMounted) {
				animationValue.setValue(0)
				callBack()
				fadeInOut()
			}
		})
	}
	useEffect(() => {
		fadeInOut()

		return () => {
			animationValue.stopAnimation()
			isMounted = false
		}
	}, [])

	return animationValue
}

type LoopTextProps = {
	textArray: string[]
	className?: string
	delay?: number
	duration?: number
}

export function TextLoop({ textArray, className, delay = 4000, duration = 1000 }: LoopTextProps) {
	const [count, setCount] = useState(0)
	const animationValue = useFetAnimationValue(delay, duration, () => {
		setCount((prevCount) => (prevCount + 1 < textArray.length ? prevCount + 1 : 0))
	})
	return (
		<Animated.Text
			className="text-center px-6"
			style={[
				{
					opacity: animationValue.interpolate({
						inputRange: [0, 0.5, 1],
						outputRange: [0, 1, 0],
					}),
					transform: [
						{
							translateY: animationValue.interpolate({
								inputRange: [0, 0.5, 1],
								outputRange: [-20, 0, 20],
							}),
						},
					],
				},
			]}
		>
			<Text className={className}>{textArray[count]}</Text>
		</Animated.Text>
	)
}
