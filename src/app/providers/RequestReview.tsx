import { ReactNode, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'expo-router'
import * as StoreReview from 'expo-store-review'

import { localStorage } from '@/shared/lib/localStorage'
import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

export function RequestReviewProvider({ children }: { children: ReactNode }) {
	const [countRouterTransition, setCountRouterTransition] = useState(0)

	const pathName = usePathname()

	const lastDateRequestedReview = localStorage.getItem(LocalStorageKeys.LAST_DATE_REQUESTED_REVIEW)

	const routerTransitionToShowReview = 5
	const diffBetweenDatesToReviewRequest = 5

	useEffect(() => {
		if (!lastDateRequestedReview) {
			localStorage.setItem(LocalStorageKeys.LAST_DATE_REQUESTED_REVIEW, new Date().toISOString())
		}
	}, [lastDateRequestedReview])

	useEffect(() => {
		setCountRouterTransition((previous) => previous + 1)
	}, [pathName])

	const differenceInDays = useMemo(() => {
		if (!lastDateRequestedReview) return 0

		const lastDate = new Date(lastDateRequestedReview)
		const today = new Date()

		return Math.round((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24))
	}, [lastDateRequestedReview])

	useEffect(() => {
		async function requestReview() {
			if (
				pathName === '/' &&
				countRouterTransition >= routerTransitionToShowReview &&
				differenceInDays >= diffBetweenDatesToReviewRequest &&
				(await StoreReview.hasAction())
			) {
				await StoreReview.requestReview()
				localStorage.setItem(LocalStorageKeys.LAST_DATE_REQUESTED_REVIEW, new Date().toISOString())
			}
		}

		requestReview()
	}, [countRouterTransition, differenceInDays, pathName])

	return <>{children}</>
}
