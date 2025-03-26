import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { SheetSize, TrueSheet } from '@lodev09/react-native-true-sheet'
import { cva, VariantProps } from 'class-variance-authority'

import { Text } from '@/shared/components/Text'
import { cn } from '@/shared/utils/cn'

type BottomSheetProps = {
	title: string
	children: ReactNode
	name?: string
	sizes?: SheetSize[]
	onDismiss?: () => void
}

export const BottomSheet = forwardRef<TrueSheet, BottomSheetProps>(
	({ children, title, name, onDismiss, sizes = ['auto', 'large'] }, ref) => {
		return (
			<TrueSheet
				ref={ref}
				name={name}
				sizes={sizes}
				cornerRadius={8}
				grabber={false}
				backgroundColor={'#DDE3E9'}
				onDismiss={onDismiss}
			>
				<View className="bg-primary-default pt-4 pb-4 px-2 w-full items-center">
					<View className="h-[2px] w-12 bg-[#DDE3E9] rounded-sm mb-3" />
					<Text className="text-base font-semibold tracking-wide text-[#F4F5F7] w-full text-center">{title}</Text>
				</View>
				<View className="px-8 pt-6 pb-10 items-center gap-y-4">{children}</View>
			</TrueSheet>
		)
	},
)

BottomSheet.displayName = 'BottomSheet'

const bottomSheetActionVariants = cva('p-2 rounded-lg w-full items-center justify-center', {
	variants: {
		variant: {
			neutral: 'bg-[#F4F5F7]',
			critical: 'bg-[#EF4123]',
			success: 'bg-success-600',
		},
	},
	defaultVariants: {
		variant: 'neutral',
	},
})

const bottomSheetActionTextVariants = cva('text-sm font-semibold', {
	variants: {
		variant: {
			neutral: 'text-black/80',
			critical: 'text-gray-50',
			success: 'text-gray-50',
		},
	},
	defaultVariants: {
		variant: 'neutral',
	},
})

export interface BottomSheetActionProps
	extends ComponentPropsWithoutRef<typeof TouchableOpacity>,
		VariantProps<typeof bottomSheetActionVariants> {
	label: string
}

export function BottomSheetAction({ label, className, variant, ...props }: BottomSheetActionProps) {
	return (
		<TouchableOpacity className={cn(bottomSheetActionVariants({ variant }), className)} {...props}>
			<Text className={bottomSheetActionTextVariants({ variant })}>{label}</Text>
		</TouchableOpacity>
	)
}
