export type PayCheck = {
	id: number
	link: string
	servidor: Servidor
	siglaUrl: string
	periodo: string
}

type Servidor = {
	documento: string
	success: boolean
	ultimaGeracao: string
	qtdErros: number
}
