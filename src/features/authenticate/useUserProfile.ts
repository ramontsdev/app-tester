import { useEffect, useMemo } from 'react'
import { capitalize } from 'radash'

import { useAppStore } from '@/app/useAppStore'
import { authQueries, authTypes } from '@/entities/auth'

import { useAuthStore } from './useAuthStore'

export function useUserProfile({ enabled }: { enabled: boolean } = { enabled: true }) {
	const isAnimatedSplashVisible = useAppStore((state) => state.isAnimatedSplashVisible)
	const setProfile = useAuthStore((state) => state.setProfile)

	const profileQuery = authQueries.useProfileQuery({ enabled: enabled && !isAnimatedSplashVisible })

	useEffect(() => {
		if (profileQuery.data) setProfile(profileQuery.data)
	}, [profileQuery, setProfile])

	const userInitials = useMemo(() => {
		const userNames = profileQuery.data?.name?.split(' ')
		const firstNameFirstLetter = userNames?.[0].charAt(0).toUpperCase() ?? ''
		const lastNameFirstLetter = userNames?.[userNames.length - 1].charAt(0).toUpperCase() ?? ''

		return `${firstNameFirstLetter}${lastNameFirstLetter}`
	}, [profileQuery.data?.name])

	const userLevelRole: authTypes.UserLevelRole = useMemo(() => {
		if (profileQuery.data?.roles.some((role) => role === 'opala')) return 'opala'
		if (profileQuery.data?.roles.some((role) => role === 'ouro')) return 'ouro'
		if (profileQuery.data?.roles.some((role) => role === 'prata')) return 'prata'
		if (profileQuery.data?.roles.some((role) => role === 'bronze')) return 'bronze'

		return 'bronze'
	}, [profileQuery.data?.roles])

	const userFullname = useMemo(() => {
		const prepositions = ['de', 'do', 'dos', 'da', 'das', 'e']

		return (
			profileQuery.data?.name?.split(' ').reduce<string>((accumulator, current) => {
				if (prepositions.includes(current.toLowerCase())) return `${accumulator} ${current.toLowerCase()}`

				return `${accumulator} ${capitalize(current)}`.trim()
			}, '') ?? ''
		)
	}, [profileQuery.data?.name])

	const isBronzeLevel = useMemo(() => {
		return userLevelRole === 'bronze'
	}, [userLevelRole])

	const isSilverLevel = useMemo(() => {
		return userLevelRole === 'prata'
	}, [userLevelRole])

	const isGoldLevel = useMemo(() => {
		return userLevelRole === 'ouro'
	}, [userLevelRole])

	const isOpalLevel = useMemo(() => {
		return userLevelRole === 'opala'
	}, [userLevelRole])

	return {
		query: profileQuery,
		initials: userInitials,
		levelRole: userLevelRole,
		fullname: userFullname,
		isBronzeLevel,
		isSilverLevel,
		isGoldLevel,
		isOpalLevel,
	}
}
