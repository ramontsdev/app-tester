import { AxiosResponse } from 'axios'

import * as proofOfLifeTypes from '@/entities/proofOfLife/proofOfLife.types'
import { httpClient } from '@/shared/lib/httpClient'

export async function getProofOfLifeFromPhotos(
	payload: proofOfLifeTypes.ProofOfLifeFromPhotoServicePayload,
): Promise<proofOfLifeTypes.ProofOfLife> {
	const result = await httpClient.post<
		proofOfLifeTypes.ProofOfLifeRaw,
		AxiosResponse<proofOfLifeTypes.ProofOfLifeRaw>,
		proofOfLifeTypes.ProofOfLifeFromPhotoRawPayload
	>('/api/prova-de-vida/solicitar', { tipo: 'VIDA', cpf: payload.document, fotos: payload.photos })

	return {
		key: result.data.chave,
		status: result.data.status,
	}
}

export async function getProofOfLifeStatus(
	payload: proofOfLifeTypes.ProofOfLifeStatusServicePayload,
): Promise<proofOfLifeTypes.ProofOfLife> {
	const result = await httpClient.get<proofOfLifeTypes.ProofOfLifeRaw, AxiosResponse<proofOfLifeTypes.ProofOfLifeRaw>>(
		`/api/prova-de-vida/consultar/${payload.key}`,
	)

	return {
		key: result.data.chave,
		status: result.data.status,
	}
}

export async function getUserBiographicalData(
	payload: proofOfLifeTypes.GetUserBiographicalDataPayload,
): Promise<proofOfLifeTypes.UserBiographicalDataService> {
	const result = await httpClient.get<
		proofOfLifeTypes.UserBiographicalDataRaw,
		AxiosResponse<proofOfLifeTypes.UserBiographicalDataRaw>
	>(`/api/middleware/ibioseg/biograficos/${payload.document}`)

	return {
		cin: Boolean(result.data.cpf),
	}
}
