import { mmkvStorage } from '@/shared/lib/localStorage'

import { favoriteEvents, FavoriteEventTypes } from './favoriteEvents'

export const parseFavorites = (jsonStr: string | undefined | null): string[] => {
	if (!jsonStr) return []
	try {
		const parsed = JSON.parse(jsonStr)
		if (Array.isArray(parsed)) {
			return parsed.filter((item): item is string => typeof item === 'string')
		}
		return []
	} catch (error) {
		return []
	}
}

export const getFavorites = (): string[] => {
	const favorites = mmkvStorage.getString('favorites')
	return parseFavorites(favorites)
}

export const addFavorite = (slug: string): boolean => {
	try {
		const favoritesList = getFavorites()

		if (!favoritesList.includes(slug)) {
			favoritesList.push(slug)
			mmkvStorage.set('favorites', JSON.stringify(favoritesList))
			favoriteEvents.emit(FavoriteEventTypes.ADDED, slug)
			favoriteEvents.emit(FavoriteEventTypes.UPDATED, favoritesList)
			return true
		}
		return false
	} catch (error) {
		favoriteEvents.emit(FavoriteEventTypes.ERROR, error)
		return false
	}
}

export const removeFavorite = (slug: string): boolean => {
	try {
		let favoritesList = getFavorites()

		if (favoritesList.includes(slug)) {
			favoritesList = favoritesList.filter((item) => item !== slug)
			mmkvStorage.set('favorites', JSON.stringify(favoritesList))
			favoriteEvents.emit(FavoriteEventTypes.REMOVED, slug)
			favoriteEvents.emit(FavoriteEventTypes.UPDATED, favoritesList)
			return true
		}
		return false
	} catch (error) {
		favoriteEvents.emit(FavoriteEventTypes.ERROR, error)
		return false
	}
}

export const toggleFavorite = (slug: string): boolean => {
	const favoritesList = getFavorites()

	if (favoritesList.includes(slug)) {
		return removeFavorite(slug)
	} else {
		return addFavorite(slug)
	}
}

export const syncProfileFavorites = (profileFavorites: string | undefined): void => {
	if (!profileFavorites) return

	const storedFavorites = getFavorites()
	if (storedFavorites.length === 0) {
		const parsedProfileFavorites = parseFavorites(profileFavorites)
		if (parsedProfileFavorites.length > 0) {
			mmkvStorage.set('favorites', JSON.stringify(parsedProfileFavorites))
			favoriteEvents.emit(FavoriteEventTypes.UPDATED, parsedProfileFavorites)
		}
	}
}
