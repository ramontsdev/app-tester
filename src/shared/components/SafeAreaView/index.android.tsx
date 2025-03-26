import { ReactNode } from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context'

import { defaultTheme } from '@/app/styles/theme'

type Props = {
	children: ReactNode
	className?: string
}

export function SafeAreaView({ children, className = '' }: Props) {
	StatusBar.setBarStyle('light-content', true)
	StatusBar.setBackgroundColor(defaultTheme.colors.primary.default)

	return (
		<NativeSafeAreaView style={{ flexGrow: 1 }} className={className}>
			{children}
		</NativeSafeAreaView>
	)
}
