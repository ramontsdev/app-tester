import { ReactElement, useEffect, useRef } from 'react'
import { Animated } from 'react-native'

type SkeletonProps = {
	className?: string
	children?: ReactElement
	isLoading?: boolean
	colors?: [string, string]
}

export function Skeleton({ children, isLoading, className, colors = ['#DDE3E9', '#d1d1d1'] }: SkeletonProps) {
	const colorAnimation = useRef(new Animated.Value(0)).current

	const classNameItself = className ?? children?.props?.className

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(colorAnimation, {
					toValue: 1,
					duration: 1000,
					useNativeDriver: false,
				}),
				Animated.timing(colorAnimation, {
					toValue: 0,
					duration: 1000,
					useNativeDriver: false,
				}),
			]),
		).start()
	}, [colorAnimation])

	const backgroundColor = colorAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: colors,
	})

	if (!isLoading) {
		return children
	}

	return (
		<Animated.View
			className={classNameItself}
			style={[!classNameItself && { ...children?.props?.style }, { backgroundColor }]}
		/>
	)
}
