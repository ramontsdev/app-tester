import { create } from 'zustand'

type AppStore = {
	isAppReady: boolean
	setIsAppReady: (isAppReady: boolean) => void
	isConnected: boolean
	setIsConnected: (isConnected: boolean) => void
	isAppLocked: boolean
	setIsAppLocked: (isAppLocked: boolean) => void
	isAppFirstRun: boolean
	setIsAppFirstRun: (isAppFirstRun: boolean) => void
	isAnimatedSplashVisible: boolean
	setIsAnimatedSplashVisible: (isAnimatedSplashVisible: boolean) => void
	isLoggedNow: boolean
	setIsLoggedNow: (setIsLoggedNow: boolean) => void

	servicesFavoritesSlugs: string[]
	setServicesFavoritesSlugs: (servicesFavoritesSlugs: string[]) => void
}

export const useAppStore = create<AppStore>((set) => ({
	isAppReady: false,
	setIsAppReady: (isAppReady: boolean) => set({ isAppReady }),
	isConnected: true,
	setIsConnected: (isConnected: boolean) => set({ isConnected }),
	isAppLocked: false,
	setIsAppLocked: (isAppLocked: boolean) => set({ isAppLocked }),
	isAppFirstRun: true,
	setIsAppFirstRun: (isAppFirstRun: boolean) => set({ isAppFirstRun }),
	isAnimatedSplashVisible: false,
	setIsAnimatedSplashVisible: (isAnimatedSplashVisible: boolean) => set({ isAnimatedSplashVisible }),
	isLoggedNow: false,
	setIsLoggedNow: (isLoggedNow: boolean) => set({ isLoggedNow }),

	servicesFavoritesSlugs: [],
	setServicesFavoritesSlugs: (servicesFavoritesSlugs: string[]) => set({ servicesFavoritesSlugs }),
}))
