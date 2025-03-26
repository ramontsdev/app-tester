import type { Component, FC } from 'react'

export type PropsFrom<TComponent> =
	TComponent extends FC<infer Props> ? Props : TComponent extends Component<infer Props> ? Props : never
