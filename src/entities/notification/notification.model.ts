export type NotificationsResponse = {
	mensagens: Message[]
	pageIndex: number
	pageSize: number
	pageTotal: number
}

export type Message = {
	id: string
	dataCriacaoFormatada: string
	titulo?: string
	texto?: string
	tipo: string
	bannerUrl?: string
	metadados: Metadados
	visualizada: boolean
}

export type Metadados = Record<string, any>
