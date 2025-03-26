export type CommonResult<TData> = {
	status: string
	message: string
	data: TData
	totalElements: number
	totalPages: number
	sucesso: boolean
}

export type PaginatedResult<TData> = {
	status: string
	message: string
	data: TData[]
	totalElements: number
	totalPages: number
	sucesso: boolean
}

type DigitalDocumentFile = {
	name: string
	path: string
	mimeType: string
	url: string
}

type DigitalDocumentField = {
	key: string
	value: string
}

type DigitalDocumentMetadata = {
	title: string
	isId: boolean
	isCarousel: boolean
	description: string
	owner: string
	validity: string
	createdAt: string
	fields: DigitalDocumentField[]
	footerTitle: string
	footerDescription: string
}

export type DigitalDocument = {
	id: string
	userId: string
	files: DigitalDocumentFile[]
	fields: DigitalDocumentField[]
	metadata: DigitalDocumentMetadata
	photo: string
	qrCodeUrl: string
	hash: string
	documentType: string
	documentNumber: string
}

export type DocumentAvaileble = {
	idUser: string
	documentType: string
	documentNumber: string
	selo: string
	name: string
}

export type DigitalDocumentListResult = PaginatedResult<DigitalDocument>

export type DigitalDocumentResult = CommonResult<DigitalDocument>

export type DocumentAvailebleListResult = PaginatedResult<DocumentAvaileble>
