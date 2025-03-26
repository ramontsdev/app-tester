import { Stack } from 'expo-router'

import type { Component, FC } from 'react'

import { defaultTheme } from '@/app/styles/theme'
import { CustomStackHeader } from '@/shared/components/customNavigationHeaders'

type PropsFrom<TComponent> =
	TComponent extends FC<infer Props> ? Props : TComponent extends Component<infer Props> ? Props : never

type ScreenOptions = PropsFrom<typeof Stack>['screenOptions']

export const headerScreenOptions: ScreenOptions = {
	headerStyle: {
		backgroundColor: defaultTheme.colors.primary.default,
	},
	headerTintColor: '#ffffff',
	headerTitleStyle: {
		fontFamily: defaultTheme.fontFamily.semibold,
		fontSize: 16,
	},
	headerShadowVisible: false,
	header: (props) => <CustomStackHeader navigateProps={props} />,
}
