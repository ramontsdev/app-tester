import axios from 'axios'

import { env } from '@/shared/lib/env'

import { Favorite } from './favorite.model'

const BASE_URL = env.EXPO_PUBLIC_PORTAL_URL || ''
const AXIOS_TIMEOUT = 10000

const axiosClient = axios.create({
	baseURL: BASE_URL,
	timeout: AXIOS_TIMEOUT,
	headers: {
		'Content-Type': 'application/json',
	},
})

export async function setFavorites(accessToken?: string, favoriteList?: Favorite): Promise<string[]> {
	const response = await axiosClient.post('/v1/catalog/setFavorite', favoriteList, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})
	return response.data
}
