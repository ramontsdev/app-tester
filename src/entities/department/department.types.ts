import * as v from 'valibot'

import * as departmentModel from '@/entities/department/department.model'

export type Department = v.InferOutput<typeof departmentModel.departmentSchema>
export type DepartmentList = v.InferOutput<typeof departmentModel.departmentListSchema>
