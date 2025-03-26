import { Text } from '@/shared/components/Text'
import { Touchable } from '@/shared/components/Touchable'
import { cn } from '@/shared/utils/cn'

type Props = {
	title: string
	icon: string
	handleRedirect: () => void
	className?: string
}

export function DepartmentCard({ title, icon, className, handleRedirect }: Props) {
	return (
		<Touchable
			className={cn(
				'flex flex-row justify-between items-center max-w-[48%] py-6 px-4 gap-1 bg-mystic-200 rounded-lg',
				className,
			)}
			onPress={handleRedirect}
		>
			<Text numberOfLines={1} className="font-semibold text-primary-700 text-sm">
				{title.toUpperCase()}
			</Text>

			{/* <Building color={defaultTheme.colors.primary[700]} /> */}
		</Touchable>
	)
}
