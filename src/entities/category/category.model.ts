export type CategorysList = Category[]

export type Category = {
	id: string
	slug: string
	name: string
	description: string
	hidden: boolean
	icon: string
	orderIndex: number
	corhex: string | null
	iconapp: string | null
	__categories__: any[]
	__has_categories__: boolean
}
