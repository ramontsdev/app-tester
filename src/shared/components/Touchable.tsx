import { useState } from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

type Props = TouchableOpacityProps & {
	onPress?: () => void
}
export function Touchable({ children, onPress, className, ...restProps }: Props) {
	const [isDisabled, setIsDisabled] = useState(false)

	const handlePress = () => {
		if (isDisabled) return

		onPress?.()
		setIsDisabled(true)

		setTimeout(() => {
			setIsDisabled(false)
		}, 750)
	}

	return (
		<TouchableOpacity onPress={handlePress} disabled={isDisabled} className={className} {...restProps}>
			{children}
		</TouchableOpacity>
	)
}
