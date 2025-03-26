import { useCallback } from 'react'

import { localStorage } from '@/shared/lib/localStorage'
import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

import { useDisableNotification } from './useDisableNotification'
import { useEnableNotification } from './useEnableNotification'

export function useNotificationToggle() {
	const enableNotifications = useEnableNotification()
	const disableNotifications = useDisableNotification()

	const notificationEnable = localStorage.getItem(LocalStorageKeys.NOTIFICATION_ENABLE) === 'true'

	return useCallback(() => {
		if (notificationEnable) {
			disableNotifications()
		} else {
			enableNotifications()
		}
	}, [disableNotifications, enableNotifications, notificationEnable])
}
