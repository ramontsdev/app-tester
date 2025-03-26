import { forwardRef } from 'react'
import { TextInput as NativeTextInput, TextInputProps } from 'react-native'

import { defaultTheme } from '@/app/styles/theme'

import { cn } from '../../utils/cn'

function segregateFont(className?: string) {
	const sentences = className?.split(' ') || []
	const fontWeightClass = sentences.find(
		(sentence) => sentence.startsWith('font') && !['font-sans', 'font-serif', 'font-mono'].includes(sentence),
	)
	const classNameSanitized = sentences
		.filter((sentence) => !sentence.startsWith('font') || ['font-sans', 'font-serif', 'font-mono'].includes(sentence))
		.join(' ')

	return { fontWeightClass, classNameSanitized }
}

function getFontWeight(fontWeightClass: string | undefined) {
	if (!fontWeightClass) {
		return 'Montserrat-normal'
	}
	const [, weight] = fontWeightClass.split('-')

	return `Montserrat-${weight}`
}

export const Input = forwardRef<NativeTextInput, TextInputProps>(({ className, ...restProps }, ref) => {
	const { fontWeightClass, classNameSanitized } = segregateFont(className)
	const fontFamily = getFontWeight(fontWeightClass)
	return (
		<NativeTextInput
			{...restProps}
			className={cn('h-12', classNameSanitized)}
			style={{ fontFamily: defaultTheme.fontFamily.normal }}
			ref={ref}
		/>
	)
})

Input.displayName = 'Input'
