import { useMemo } from 'react'
import { create } from 'zustand'

import { localStorage } from '@/shared/lib/localStorage'
import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

type RecentService = {
	title: string
	slug: string
	icon: string
	link: string
	category: string
}

type RecentServiceStore = {
	recentServices: RecentService[]
	addRecentServices: (service: RecentService) => void
}

const RECENT_SERVICES_SIZE = 5

const useRecentServiceStore = create<RecentServiceStore>((set) => ({
	recentServices: JSON.parse(localStorage.getItem(LocalStorageKeys.RECENT_SERVICES) || '[]') as RecentService[],
	addRecentServices: (service: RecentService) =>
		set((state) => {
			const filteredServices = state.recentServices.filter((recentService) => recentService.slug !== service.slug)

			const newServices = [service, ...filteredServices]

			if (newServices.length > RECENT_SERVICES_SIZE) {
				newServices.pop()
			}

			localStorage.setItem(LocalStorageKeys.RECENT_SERVICES, JSON.stringify(newServices))

			return { recentServices: newServices }
		}),
}))

export function useAddRecentService() {
	const recentServices = useRecentServiceStore((state) => state.recentServices)
	const addRecentServices = useRecentServiceStore((state) => state.addRecentServices)

	const result = useMemo(
		() => ({
			recentServices: recentServices,
			addRecentServices: (service: RecentService) => addRecentServices(service),
		}),
		[addRecentServices, recentServices],
	)

	return result
}
