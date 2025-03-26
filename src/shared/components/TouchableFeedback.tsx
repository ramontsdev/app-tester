import { useState } from 'react'
import { GestureResponderEvent, TouchableNativeFeedback, TouchableNativeFeedbackProps } from 'react-native'

type Props = TouchableNativeFeedbackProps & {}
export function TouchableFeedback({ children, onPress, className, ...restProps }: Props) {
	const [isDisabled, setIsDisabled] = useState(false)

	const handlePress = (event: GestureResponderEvent) => {
		if (isDisabled) return

		onPress?.(event)
		setIsDisabled(true)

		setTimeout(() => {
			setIsDisabled(false)
		}, 250)
	}

	return (
		<TouchableNativeFeedback onPress={handlePress} disabled={isDisabled} className={className} {...restProps}>
			{children}
		</TouchableNativeFeedback>
	)
}
