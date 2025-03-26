import { useRouter } from 'expo-router'
import { cva, VariantProps } from 'class-variance-authority'

import { useServiceBySlugQuery } from '@/entities/service/service.queries'

export const levelRoleVariants = cva(null, {
	variants: {
		variant: {
			opala: 'bg-level-role-opala',
			ouro: 'bg-level-role-ouro',
			prata: 'bg-level-role-prata',
			bronze: 'bg-level-role-bronze',
		},
	},
	defaultVariants: {
		variant: 'bronze',
	},
})

type LevelRoleSymbolProps = VariantProps<typeof levelRoleVariants>['variant']

export function useServiceDetailsScreenController(serviceSlug: string) {
	const { data, isFetching } = useServiceBySlugQuery(serviceSlug)

	const levelRole = data?.accessProfile.name.toLowerCase() as LevelRoleSymbolProps
	function toFirstLetterUpperCase(word: string) {
		return word.charAt(0).toUpperCase() + word.slice(1)
	}

	const hasSteps = data?.steps.length !== 0

	const router = useRouter()

	return {
		service: data,
		isLoading: isFetching,
		levelRole,
		toFirstLetterUpperCase,
		hasSteps,
		router,
	}
}
