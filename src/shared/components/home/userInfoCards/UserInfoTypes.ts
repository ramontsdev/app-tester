export type ServiceName = 'cnh' | 'crlv'

export type Service = {
	uri: string
	name: string
}

export type UserInfoCardsServices = Record<ServiceName, Service>
