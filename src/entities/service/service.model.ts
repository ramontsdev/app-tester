import * as v from 'valibot'

export const serviceSchema = v.object({
	type: v.string(),
	title: v.string(),
	slug: v.string(),
	description: v.string(),
	tags: v.array(v.string()),
	isFree: v.boolean(),
	isOnline: v.boolean(),
	category: v.string(),
	targets: v.array(v.string()),
	department: v.string(),
	departmentSlug: v.string(),
	departmentSections: v.array(v.string()),
	categorySlug: v.string(),
	icon: v.string(),
	highlighted: v.boolean(),
	link: v.string(),
	pageCount: v.number(),
	imageUrl: v.string(),
	platforms: v.array(v.string()),
	isDigital: v.boolean(),
	active: v.boolean(),
	popularNames: v.array(v.any()),
	resultCategory: v.string(),
	accessProfile: v.string(),
	isSelfService: v.boolean(),
	score: v.any(),
	resultTotal: v.number(),
	iconService: v.optional(v.nullable(v.string())),
})

export const serviceListSchema = v.array(serviceSchema)

export interface ServiceModel {
	isOnline: boolean
	isDigital: boolean
	highlighted: boolean
	page_count: number
	active: boolean
	isSelfService: boolean
	id: string
	description: string
	isFree: boolean
	link: string
	name: string
	icon: any
	imageUrl: string
	access_counter: string
	tags: any[]
	targets: string[]
	slug: string
	created_at: string
	updated_at: string
	averageRatings: AverageRatings
	popularNames: any[]
	category: Category
	department: Department
	info: Info[]
	steps: Step[]
	departmentSections: DepartmentSection[]
	resultCategory: ResultCategory
	accessProfile: AccessProfile
	catalogDataRow?: CatalogDataRow[]
}

export interface AverageRatings {
	count: number
	average: number
}

export interface Category {
	id: string
	slug: string
	name: string
	description: string
	hidden: boolean
	icon: string
	orderIndex: number
	corhex: string
	iconapp: string
}

export interface Department {
	id: string
	slug: string
	name: string
	shortName: string
	link: string
	description: string
	mission: string
	vision: string
	values: string
	hidden: boolean
	active: boolean
}

export interface Info {
	id: string
	title: string
	text: string
	orderIndex: number
	icon: string
	catalogItemId: string
}

export interface Step {
	id: string
	name: string
	description: string
	channel: string
	htmlContent: string
	orderIndex: number
	documents: any[]
	catalogItemId: string
}

export interface DepartmentSection {
	id: string
	name: string
	address: string
	postalCode: string
	district: string
	complement: string
	city: string
	state: string
	countryCode: string
	openingTime: string
	mapUrl: string
	active: boolean
	department: Department
}

interface CatalogDataRow {
	id: string
	name: string
	value: string
	catalogItemId: string
}

export interface ResultCategory {
	id: string
	name: string
}

export interface AccessProfile {
	id: string
	name: string
	weight: number
}

export type ParsedHtmlResult = Readonly<
	{ type: 'paragraph'; text: string } | { type: 'unordered-list'; items: string[] }
>[]

type ParsedInfo = {
	id: string
	title: string
	text: ParsedHtmlResult
	orderIndex: number
	icon: string
	catalogItemId: string
}

type ParsedStep = {
	id: string
	name: string
	description: string
	channel: string
	htmlContent: ParsedHtmlResult
	orderIndex: number
	documents: any[]
	catalogItemId: string
}

export type MappedServiceModel = {
	isOnline: boolean
	isDigital: boolean
	highlighted: boolean
	pageCount: number
	active: boolean
	isSelfService: boolean
	id: string
	description: string
	isFree: boolean
	link: string
	name: string
	icon: any
	imageUrl: string
	accessCounter: string
	tags: any[]
	targets: string[]
	slug: string
	createdAt: string
	updatedAt: string
	averageRatings: AverageRatings
	popularNames: any[]
	category: Category
	department: Department
	info: ParsedInfo[]
	steps: ParsedStep[]
	departmentSections: DepartmentSection[]
	resultCategory: ResultCategory
	accessProfile: AccessProfile
	catalogDataRow?: { [name: string]: { id: string; value: string; catalogItemId: string } }
}
