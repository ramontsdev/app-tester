import * as v from 'valibot'

export const departmentSchema = v.object({
	id: v.string(),
	slug: v.string(),
	name: v.string(),
	shortName: v.string(),
	link: v.string(),
	description: v.string(),
	mission: v.string(),
	vision: v.string(),
	values: v.string(),
	hidden: v.boolean(),
	active: v.boolean(),
})

export const departmentListSchema = v.array(departmentSchema)
