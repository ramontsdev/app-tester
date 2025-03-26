type FaceRecognitionStatus = 'DESCONHECIDO' | 'NAO_ENCONTRADA' | 'EM_ANALISE' | 'APROVADA' | 'NEGADA'

type FaceRecognitionType = 'FACIAL' | 'VIDA'

export type ProofOfLifeFromPhotoServicePayload = {
	document: string
	photos: string[]
}

export type ProofOfLifeFromPhotoRawPayload = {
	tipo: FaceRecognitionType
	cpf: string
	fotos: string[]
}

export type ProofOfLifeRaw = {
	chave: string
	status: FaceRecognitionStatus
}

export type ProofOfLife = {
	key: string
	status: FaceRecognitionStatus
}

export type ProofOfLifeStatusServicePayload = {
	key: string
}

export type GetUserBiographicalDataPayload = {
	document: string
}

export type UserBiographicalDataRaw = {
	name: string
	motherName: string
	birhDate: string
	cpf: string
	overralRecord: number
	gender: string
	skin: string
	profession: string
	maritalStatus: string
	nationality: string
	birthCity: string
	birthCityState: string
	rfb: boolean
}

export type UserBiographicalDataService = {
	cin: boolean
}
