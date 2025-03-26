import * as v from 'valibot'

import * as serviceModel from '@/entities/service/service.model'

export type SearchParams = {
	groups?: string[]
	tags?: string[]
	platforms?: string[]
	slugs?: string[]
	category?: string
	departmentSlug?: string
	departmentSection?: string
	query?: string
	highlighted?: boolean
	top_hit?: number
	from?: number
	size?: number
}

export type Service = v.InferOutput<typeof serviceModel.serviceSchema>
export type ServiceList = v.InferOutput<typeof serviceModel.serviceListSchema>
