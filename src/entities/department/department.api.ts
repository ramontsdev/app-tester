import * as departmentModel from '@/entities/department/department.model'
import { env } from '@/shared/lib/env'
import { createFetchApi, ensureResponse } from '@/shared/lib/fetch'

const BASE_URL_SERVICE = `${env.EXPO_PUBLIC_PORTAL_URL}/v1`
const clientApi = createFetchApi(BASE_URL_SERVICE)

export async function getDepartment() {
	const response = await clientApi.get('/department')

	const result = ensureResponse(response, departmentModel.departmentListSchema)

	return result
}
