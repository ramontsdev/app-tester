import React, { ReactNode } from 'react'
import { SafeAreaView as NativeSafeAreaView, StatusBar } from 'react-native'

import { defaultTheme } from '@/app/styles/theme'

type Props = {
	children: ReactNode
	className?: string
}

export function SafeAreaView({ children, className = '' }: Props) {
	StatusBar.setBarStyle('light-content', true)

	return (
		<NativeSafeAreaView
			style={{ flexGrow: 1, backgroundColor: defaultTheme.colors.primary.default }}
			className={className}
		>
			{children}
		</NativeSafeAreaView>
	)
}
