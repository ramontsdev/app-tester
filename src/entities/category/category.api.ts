import axios from 'axios'

import { env } from '@/shared/lib/env'

import { CategorysList } from './category.model'

const categoryApi = axios.create({
	baseURL: `${env.EXPO_PUBLIC_PORTAL_URL}/v1`,
})

export async function getCategories(): Promise<CategorysList> {
	const { data } = await categoryApi.get('/category')

	return data
}
