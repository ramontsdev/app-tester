import { AxiosResponse } from 'axios'

import * as paycheckTypes from '@/entities/paycheck/paycheck.types'
import { httpClient } from '@/shared/lib/httpClient'

export async function getPaychecks() {
	const response = await httpClient.get<paycheckTypes.PayCheck[], AxiosResponse<paycheckTypes.PayCheck[]>>(
		'/api/contracheque/sead/empresa/ultimos-contracheques',
	)

	return response.data
}
