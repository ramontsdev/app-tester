import axios from 'axios'

import { env } from '@/shared/lib/env'

import { serviceTypes } from '../service'

const RECOMMENDATION_SERVICE_URL = env.EXPO_PUBLIC_PORTAL_URL || ''

export interface RecommendedServicesResponse {
	recommended_services: serviceTypes.ServiceList
	deprecated_services: serviceTypes.ServiceList
}

const EMPTY_RESPONSE: RecommendedServicesResponse = {
	recommended_services: [],
	deprecated_services: [],
}

function isValidResponse(data: any): data is RecommendedServicesResponse {
	return (
		!!data &&
		typeof data === 'object' &&
		'recommended_services' in data &&
		'deprecated_services' in data &&
		Array.isArray(data.recommended_services) &&
		Array.isArray(data.deprecated_services)
	)
}

function mapToRecommendedServicesResponse(data: any): RecommendedServicesResponse {
	if (
		!!data &&
		typeof data === 'object' &&
		Array.isArray(data.recommended_services) &&
		Array.isArray(data.deprecated_services)
	) {
		return {
			recommended_services: data.recommended_services,
			deprecated_services: data.deprecated_services,
		}
	}

	return EMPTY_RESPONSE
}

export async function getRecommendedServices(cpf?: string): Promise<RecommendedServicesResponse> {
	try {
		const url = `${RECOMMENDATION_SERVICE_URL}/api/recommendations/recommend_services/${cpf}`

		const response = await axios.get(url, {
			headers: {
				accept: 'application/json',
			},
		})

		const data = response.data
		return isValidResponse(data) ? data : EMPTY_RESPONSE
	} catch (error) {
		console.warn('[RecommendedServices] Error:', error)
		return EMPTY_RESPONSE
	}
}

export async function getRelevant(accessToken?: string): Promise<RecommendedServicesResponse> {
	try {
		const response = await axios.post(
			`${RECOMMENDATION_SERVICE_URL}/v1/search`,
			{
				groups: ['CATALOG'],
				highlighted: true,
			},
			{
				headers: {
					Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
					accept: 'application/json',
				},
			},
		)

		const data = mapToRecommendedServicesResponse({
			recommended_services: Array.isArray(response.data) ? response.data : [],
			deprecated_services: [],
		})

		return data
	} catch (error) {
		console.warn('[RecommendedServices] Error:', error)
		return EMPTY_RESPONSE
	}
}
