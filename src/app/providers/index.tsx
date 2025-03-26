import { ReactNode } from 'react'

import { NotificationListener } from './NotificationListener'
import { ReactQueryProvider } from './ReactQueryProvider'
import { RequestReviewProvider } from './RequestReview'

type Props = {
	children: ReactNode
}

export function Providers({ children }: Props) {
	return (
		<NotificationListener>
			<RequestReviewProvider>
				<ReactQueryProvider>{children}</ReactQueryProvider>
			</RequestReviewProvider>
		</NotificationListener>
	)
}
