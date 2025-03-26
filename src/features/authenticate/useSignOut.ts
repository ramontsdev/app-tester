import { useCallback } from 'react'

import { authQueries } from '@/entities/auth'

import { useDisableNotification } from '../notification/useDisableNotification'
import { useNotificationStore } from '../notification/useNotificationStore'

export function useSignOut() {
	const { mutate: signOut } = authQueries.useSignOutMutation()
	const disableNotifications = useDisableNotification()
	const isNotificationEnable = useNotificationStore((state) => state.notificationEnable)

	return useCallback(async () => {
		if (isNotificationEnable) await disableNotifications()

		signOut()
	}, [disableNotifications, isNotificationEnable, signOut])
}
