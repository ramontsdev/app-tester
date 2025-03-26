import { BadgeInfo, icons, LucideProps } from 'lucide-react-native'

type Props = LucideProps & { name: string; color?: string; size?: number }

export function Icon({ name, color, size, ...restProps }: Props) {
	if (!name) return <BadgeInfo color={color} size={24} />

	function convertIconName(iconName: string): string {
		const baseName = iconName.replace(/^lucide-/, '')

		const parts = baseName.split('-')

		const camelCased = parts
			.map((part, index) =>
				index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part.charAt(0).toUpperCase() + part.slice(1),
			)
			.join('')

		return camelCased
	}

	const lucideIcons = icons as Record<string, React.ComponentType<{ color?: string; size?: number }>>
	const LucideIcon = lucideIcons[convertIconName(name)]

	if (!LucideIcon) return <BadgeInfo color="white" size={24} />

	return <LucideIcon color={color} size={size} {...restProps} />
}
