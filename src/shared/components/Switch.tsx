import { forwardRef, useEffect } from 'react'
import { Switch as NativeSwitch, Pressable } from 'react-native'
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'
import { Canvas, interpolateColors, RoundedRect, Shadow } from '@shopify/react-native-skia'

import type { ComponentPropsWithoutRef, ElementRef } from 'react'

export const Switch = forwardRef<ElementRef<typeof NativeSwitch>, ComponentPropsWithoutRef<typeof NativeSwitch>>(
	({ onValueChange, value, ...props }, ref) => {
		const progress = useSharedValue(value ? 1 : 0)

		useEffect(() => {
			progress.value = withTiming(value ? 1 : 0)
		}, [value])

		const thumbColor = useDerivedValue(() => {
			return interpolateColors(progress.value, [0, 1], ['rgb(1, 28, 58)', 'rgb(41, 150, 86)'])
		})

		const animatedStyle = useAnimatedStyle(() => {
			return {
				transform: [{ translateX: progress.value * 16 }],
			}
		})

		const handleSwitchPress = () => {
			progress.value = withTiming(1 - progress.value, { duration: 150 })
			if (onValueChange) onValueChange(!value)
		}

		return (
			<>
				<Pressable className="relative" onPress={handleSwitchPress}>
					<Canvas style={{ width: 40, height: 24 }}>
						<RoundedRect x={0} y={0} width={40} height={24} r={24} color={thumbColor}>
							<Shadow dx={2} dy={2} blur={2} color="rgba(0, 0, 0, 0.12)" inner />
						</RoundedRect>
					</Canvas>
					<Animated.View
						className="absolute rounded-full bg-[#F4F5F7]"
						style={[{ width: 16, height: 16, top: 4, left: 4 }, animatedStyle]}
					/>
				</Pressable>
				<NativeSwitch
					className="hidden invisible absolute w-0 h-0 top-0 left-0"
					value={value}
					onValueChange={onValueChange}
					ref={ref}
					{...props}
				/>
			</>
		)
	},
)

Switch.displayName = 'Switch'
