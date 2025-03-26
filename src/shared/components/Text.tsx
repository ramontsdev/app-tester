import { Text as NativeText, TextProps } from 'react-native'

import { defaultTheme } from '@/app/styles/theme'
import { cn } from '@/shared/utils/cn'

type Props = TextProps

function segregateFont(className: string) {
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
		return 'Montserrat-Regular'
	}
	const [, weight] = fontWeightClass.split('-')

	return defaultTheme.fontFamily[weight as keyof typeof defaultTheme.fontFamily]
}

export function Text({ children, className = '', ...restProps }: Props) {
	const { fontWeightClass, classNameSanitized } = segregateFont(className)
	const fontFamily = getFontWeight(fontWeightClass)

	return (
		<NativeText className={cn('text-zinc-900', classNameSanitized)} {...restProps} style={{ fontFamily }}>
			{children}
		</NativeText>
	)
}
