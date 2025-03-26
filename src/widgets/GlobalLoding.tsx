import React, { useEffect, useState } from 'react'
import { Linking, View } from 'react-native'
import { ExternalPathString, Href, RelativePathString, usePathname, useRouter } from 'expo-router'
import { create } from 'zustand'

import { useIsSignedIn } from '@/features/authenticate/useIsSignedIn'
import { useServiceBySlugQuery } from '@/entities/service/service.queries'
import { LoadingScreen } from '@/shared/components/LoadingScreen'
import { TextLoop } from '@/shared/components/TextLoop'
import { resolvePortalUri } from '@/shared/helpers/resolvePortalURI'

// Tipagem dos parâmetros de redirecionamento
type RedirectParams = {
	nextRoute?: Href
	routeParams?: Record<string, string | undefined>
}

// Estado global de loading
type GlobalLoadingStore = {
	open: boolean
	messages: string[]
	autoClose: boolean
	redirectParams: RedirectParams
	openGlobalLoading: (messages?: string[], redirectParams?: RedirectParams, autoClose?: boolean) => void
	closeGlobalLoading: () => void
}

export const useGlobalLoadingStore = create<GlobalLoadingStore>((set) => ({
	open: false,
	messages: ['Carregando', 'Aguarde!'],
	autoClose: true,
	redirectParams: {},
	openGlobalLoading: (messages = ['Carregando', 'Aguarde!'], redirectParams = {}, autoClose = true) =>
		set({ open: true, messages, redirectParams, autoClose }),
	closeGlobalLoading: () => set({ open: false, redirectParams: {} }),
}))

export function useOpenGlobalLoading() {
	const { openGlobalLoading, closeGlobalLoading } = useGlobalLoadingStore()
	return { openGlobalLoading, closeGlobalLoading }
}

export function GlobalLoading() {
	const { open, messages, autoClose, redirectParams, closeGlobalLoading } = useGlobalLoadingStore()
	const router = useRouter()
	const currentPath = usePathname()
	const isSignedIn = useIsSignedIn()
	const [animationEnded, setAnimationEnded] = useState(false)

	const { data } = useServiceBySlugQuery(
		redirectParams.routeParams?.category?.toLowerCase()?.includes('empresa')
			? (redirectParams.routeParams?.slug ?? '')
			: '',
	)

	// Função auxiliar para processar redirecionamentos
	const handleRedirect = () => {
		if (!isSignedIn) return

		const { routeParams, nextRoute } = redirectParams

		if (routeParams?.uri?.includes('lookerstudio.google.com')) {
			router.push('/(tabs)')
			Linking.openURL(resolvePortalUri(routeParams.uri))
			return
		}

		if (data?.catalogDataRow?.openMode?.value === 'external') {
			router.push('/(tabs)')
			Linking.openURL(resolvePortalUri(data.link))
			return
		}

		if (nextRoute) {
			router.push({ pathname: nextRoute as RelativePathString | ExternalPathString, params: routeParams })
		}
	}

	useEffect(handleRedirect, [isSignedIn, redirectParams, data, router])

	useEffect(() => {
		if (
			animationEnded &&
			open &&
			autoClose &&
			isSignedIn &&
			(currentPath === redirectParams.nextRoute || !redirectParams.nextRoute)
		) {
			closeGlobalLoading()
			setAnimationEnded(false)
		}
	}, [animationEnded, open, autoClose, isSignedIn, currentPath, redirectParams.nextRoute, closeGlobalLoading])

	return (
		<LoadingScreen isLoading={open} delayAnimationInit={0} onAnimationEnd={() => setAnimationEnded(true)}>
			<View className="mt-12">
				<TextLoop textArray={messages} className="text-lg" duration={500} delay={500} />
			</View>
		</LoadingScreen>
	)
}
