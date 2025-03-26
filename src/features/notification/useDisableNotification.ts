import { useCallback, useEffect } from 'react'
import { Alert } from 'react-native'

import { notificationQueries } from '@/entities/notification'
import { localStorage } from '@/shared/lib/localStorage'
import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

import { useNotificationStore } from './useNotificationStore'

export function useDisableNotification() {
	const {
		mutateAsync: disableNotifications,
		isSuccess: successWhenDisabling,
		isError: errorWhenDisabling,
	} = notificationQueries.useDisableNotificationQuery()

	const setNotificationStore = useNotificationStore((state) => state.setNotificationEnable)
	useEffect(() => {
		if (successWhenDisabling) {
			localStorage.setItem(LocalStorageKeys.NOTIFICATION_ENABLE, `${false}`)
			setNotificationStore(false)
		} else if (errorWhenDisabling) {
			Alert.alert('Erro', 'Erro ao tentar desabilitar notificações!', [
				{
					text: 'Fechar',
					style: 'cancel',
				},
			])
		}
	}, [successWhenDisabling, errorWhenDisabling])

	return useCallback(async () => {
		await disableNotifications()
	}, [disableNotifications])
}
