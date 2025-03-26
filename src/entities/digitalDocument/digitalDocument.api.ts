import { AxiosResponse } from 'axios'

import * as digitalDocumentTypes from '@/entities/digitalDocument/digitalDocument.types'
import { httpClient } from '@/shared/lib/httpClient'

export async function getDigitalDocuments() {
	const result = await httpClient.get<
		digitalDocumentTypes.DigitalDocumentListResult,
		AxiosResponse<digitalDocumentTypes.DigitalDocumentListResult>
	>('/api/wallet/documentos/listar')

	if (result.status === 204) return []

	return result.data.data
}

export async function getDigitalDocument(documentType: string) {
	const result = await httpClient.get<
		digitalDocumentTypes.DigitalDocumentResult,
		AxiosResponse<digitalDocumentTypes.DigitalDocumentResult>
	>(`/api/wallet/documentos/detalhar/${documentType}`)

	return result.data.data
}

export async function getDocumentsAvailable() {
	const result = await httpClient.get<
		digitalDocumentTypes.DocumentAvailebleListResult,
		AxiosResponse<digitalDocumentTypes.DocumentAvailebleListResult>
	>('/api/wallet/documentos/solicitar')

	if (result.status === 204) return []

	return result.data.data
}

export async function addDocument(documentType: string) {
	const result = await httpClient.post<
		digitalDocumentTypes.DigitalDocumentResult,
		AxiosResponse<digitalDocumentTypes.DigitalDocumentResult>
	>(`/api/wallet/documentos/inserir/${documentType}`)

	return result.data
}

export async function removeDocument(documentId: string) {
	const result = await httpClient.delete<
		digitalDocumentTypes.CommonResult<{}>,
		AxiosResponse<digitalDocumentTypes.CommonResult<{}>>
	>(`/api/wallet/documentos/remover/${documentId}`)

	return result.data
}
