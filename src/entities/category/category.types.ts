import * as v from 'valibot'

import * as categoryModel from '@/entities/category/category.model'

export type Category = v.InferOutput<typeof categoryModel.categorySchema>
export type Categories = v.InferOutput<typeof categoryModel.categoriesSchema>
