import { TextProps } from 'react-native'

import { cn } from '@/shared/utils/cn'

import { Text } from './Text'

// Heading
type Props = TextProps
export function SectionTitle({ children, className }: Props) {
	return <Text className={cn('font-semibold text-gray-600', className)}>{children}</Text>
}
