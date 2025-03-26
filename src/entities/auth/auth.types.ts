export type Token = {
	access_token: string
	expires_in: number
	id_token: string
	refresh_expires_in: number
	refresh_token: string
	scope: string
	session_state: string
	token_type: string
	'not-before-policy': number
}

export type Profile = {
	piid?: string
	sub: string
	email_verified: boolean
	roles: string[]
	groups: any[]
	preferred_username: string
	given_name: string
	picture?: string
	name: string
	pidigital?: string
	dataNascimento: string
	cartao_fazendario_confirmacao?: boolean
	family_name: string
	catalog_favorite: string
	email: string
	nomeMae: string
	nomeCompleto: string
	veiculos?: {
		licenciamentoAtrasado: boolean
		modelo: string
		placa: string
		quantMultas: number
		restricaoAdministrativa: boolean
		restricaoJudicial: boolean
		restricaoTributaria: boolean
	}[]
	cnh?:
		| {
				dataValidadeCNH: string
				numeroRegistro: number
				categoriaCNH: string
				pontuacao: string | null
				processo: string | null
				registro: number
				dataEmissao: string
				bloqueioBca: boolean
				bloqueioCnhApreendida: boolean
				cnhVencida: boolean
		  }[]
		| {}
}

export type ServiceToken = {
	access_token: string
	expires_in: number
	'not-before-policy': number
	refresh_expires_in: number
	scope: string
	token_type: string
}

export type TokenIntrospection = {
	active: boolean
}

export type UserLevelRole = 'opala' | 'ouro' | 'prata' | 'bronze'
