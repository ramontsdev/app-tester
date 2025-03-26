import axios from 'axios'

import * as serviceModel from '@/entities/service/service.model'
import * as serviceType from '@/entities/service/service.types'
import { ServiceMapper } from '@/shared/helpers/ServiceMapper'
import { env } from '@/shared/lib/env'
import { createFetchApi, ensureResponse } from '@/shared/lib/fetch'

const BASE_URL_SERVICE = `${env.EXPO_PUBLIC_PORTAL_URL}/v1`
const clientApi = createFetchApi(BASE_URL_SERVICE)

export async function getService(searchParms?: serviceType.SearchParams) {
	const response = await clientApi.post('/search', JSON.stringify(searchParms), {
		'Content-Type': 'application/json',
	})

	const result = ensureResponse(response, serviceModel.serviceListSchema)

	return result
}

export const portalApi = axios.create({
	baseURL: env.EXPO_PUBLIC_PORTAL_URL,
})

export async function getServiceBySlug(slug: string) {
	const response = await portalApi.get<serviceModel.ServiceModel>(`/v1/catalog/${slug}/load`)

	return ServiceMapper.toDomain(response.data)
}
