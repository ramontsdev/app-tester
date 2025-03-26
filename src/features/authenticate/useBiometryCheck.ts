import { useCallback } from 'react'

import { authQueries } from '@/entities/auth'

export function useBiometryCheck() {
	const { mutate: biometryAuth } = authQueries.useBiometryAuthMutation()

	return useCallback(() => {
		biometryAuth()
	}, [biometryAuth])
}
