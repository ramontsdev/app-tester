import { serviceLib } from '@/entities/service'
import { MappedServiceModel, ServiceModel } from '@/entities/service/service.model'

export class ServiceMapper {
	static toDomain(persistenceService: ServiceModel): MappedServiceModel {
		return {
			id: persistenceService.id,
			accessCounter: persistenceService.access_counter,
			accessProfile: persistenceService.accessProfile,
			active: persistenceService.active,
			averageRatings: persistenceService.averageRatings,
			category: persistenceService.category,
			createdAt: persistenceService.created_at,
			department: persistenceService.department,
			departmentSections: persistenceService.departmentSections,
			description: persistenceService.description,
			highlighted: persistenceService.highlighted,
			icon: persistenceService.icon,
			imageUrl: persistenceService.imageUrl,
			info: persistenceService.info.map((information) => ({
				...information,
				text: serviceLib.parseHtmlFromService(information.text),
			})),
			isDigital: persistenceService.isDigital,
			isFree: persistenceService.isFree,
			isOnline: persistenceService.isOnline,
			isSelfService: persistenceService.isSelfService,
			link: persistenceService.link,
			name: persistenceService.name,
			pageCount: persistenceService.page_count,
			popularNames: persistenceService.popularNames,
			resultCategory: persistenceService.resultCategory,
			slug: persistenceService.slug,
			steps: persistenceService.steps.map((step) => ({
				...step,
				htmlContent: serviceLib.parseHtmlFromService(step.htmlContent),
			})),
			tags: persistenceService.tags,
			targets: persistenceService.targets,
			updatedAt: persistenceService.updated_at,
			catalogDataRow: persistenceService.catalogDataRow?.reduce(
				(acc, row) => {
					acc[row.name] = { id: row.id, value: row.value, catalogItemId: row.catalogItemId }
					return acc
				},
				{} as Record<string, { id: string; value: string; catalogItemId: string }>,
			),
		}
	}

	static toPersistence(domainService: MappedServiceModel): ServiceModel {
		return {
			id: domainService.id,
			access_counter: domainService.accessCounter,
			accessProfile: domainService.accessProfile,
			active: domainService.active,
			averageRatings: domainService.averageRatings,
			category: domainService.category,
			created_at: domainService.createdAt,
			department: domainService.department,
			departmentSections: domainService.departmentSections,
			description: domainService.description,
			highlighted: domainService.highlighted,
			icon: domainService.icon,
			imageUrl: domainService.imageUrl,
			info: domainService.info.map((information) => ({
				...information,
				text: serviceLib.convertParsedHtmlToString(information.text),
			})),
			isDigital: domainService.isDigital,
			isFree: domainService.isFree,
			isOnline: domainService.isOnline,
			isSelfService: domainService.isSelfService,
			link: domainService.link,
			name: domainService.name,
			page_count: domainService.pageCount,
			popularNames: domainService.popularNames,
			resultCategory: domainService.resultCategory,
			slug: domainService.slug,
			steps: domainService.steps.map((step) => ({
				...step,
				htmlContent: serviceLib.convertParsedHtmlToString(step.htmlContent),
			})),
			tags: domainService.tags,
			targets: domainService.targets,
			updated_at: domainService.updatedAt,
			catalogDataRow: domainService.catalogDataRow
				? Object.entries(domainService.catalogDataRow).map(([name, { id, value, catalogItemId }]) => ({
						id,
						name,
						value,
						catalogItemId,
					}))
				: undefined,
		}
	}
}
