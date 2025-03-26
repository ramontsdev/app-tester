import { View } from 'react-native'

import { Skeleton } from '@/shared/components/Skeleton'

export function NotificationItemSkeleton({ count = 5 }: { count?: number }) {
	return (
		<>
			{Array.from({ length: count }).map((_, index) => (
				<Skeleton key={index} isLoading={true}>
					<View className="w-full h-12 mb-3 rounded-md" />
				</Skeleton>
			))}
		</>
	)
}
