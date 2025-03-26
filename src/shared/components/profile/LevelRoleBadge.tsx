import { Text, View } from 'react-native'
import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/shared/utils/cn'

const badgeVariants = cva('flex flex-row items-center rounded-lg px-3 py-1 text-xs font-semibold', {
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

export interface LevelRoleBadgeProps
	extends React.ComponentPropsWithoutRef<typeof View>,
		VariantProps<typeof badgeVariants> {
	label: string
	labelClasses?: string
}

function LevelRoleBadge({ label, labelClasses, className, variant, ...props }: LevelRoleBadgeProps) {
	return (
		<View className={cn(badgeVariants({ variant }), className)} {...props}>
			<Text className={cn('font-medium text-center text-xs tracking-wide text-gray-50', labelClasses)}>{label}</Text>
		</View>
	)
}

export { LevelRoleBadge, badgeVariants }
