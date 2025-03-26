import { Platform } from 'react-native'
import { MMKV } from 'react-native-mmkv'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

const cache = new MMKV()

const cacheStorage = {
	setItem: (key: string, value: string) => {
		cache.set(key, value)
	},
	getItem: (key: string) => {
		const value = cache.getString(key)
		return value === undefined ? null : value
	},
	removeItem: (key: string) => {
		cache.delete(key)
	},
}

function generateCacheKey() {
	const version = '1.0.56'

	if (Platform.OS === 'ios') {
		return `${version}-d300afa1-04fa-4a98-a034-4f0df2d1ccb2`
	} else if (Platform.OS === 'android') {
		return `${version}-227a55ff-2465-46f7-85df-4c687cd1a6a0`
	}
}

export const cachePersister = createSyncStoragePersister({ storage: cacheStorage, key: generateCacheKey() })
