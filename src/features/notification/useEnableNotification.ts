import { useCallback, useEffect } from 'react'
import { Alert } from 'react-native'
import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as ExpoNotifications from 'expo-notifications'

import { notificationQueries } from '@/entities/notification'
import { localStorage } from '@/shared/lib/localStorage'
import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

import { useNotificationStore } from './useNotificationStore'

export function useEnableNotification() {
	const {
		mutate: enableNotifications,
		isSuccess: successWhenEnabling,
		isError: errorWhenEnabling,
	} = notificationQueries.useEnableNotificationsQuery()

	const setNotificationStore = useNotificationStore((state) => state.setNotificationEnable)
	useEffect(() => {
		if (successWhenEnabling) {
			localStorage.setItem(LocalStorageKeys.NOTIFICATION_ENABLE, `${true}`)
			setNotificationStore(true)
		} else if (errorWhenEnabling) {
			Alert.alert('Erro', 'Erro ao tentar habilitar notificações!', [
				{
					text: 'Fechar',
					style: 'cancel',
				},
			])
			setNotificationStore(false)
		}
	}, [successWhenEnabling, errorWhenEnabling])

	return useCallback(async () => {
		if (!Device.isDevice) {
			Alert.alert('Atenção', 'Para utilizar as notificações é necessario um dispositivo fisico!', [
				{
					text: 'Fechar',
					style: 'cancel',
				},
			])
			return
		}

		let token

		const { status: existingStatus } = await ExpoNotifications.getPermissionsAsync()

		let finalStatus = existingStatus

		if (existingStatus !== 'granted') {
			const { status } = await ExpoNotifications.requestPermissionsAsync()
			finalStatus = status
		}

		if (finalStatus !== 'granted') {
			Alert.alert('Atenção', 'É preciso dar permissão ao aplicativo Gov Pi para receber notificações!', [
				{
					text: 'Fechar',
					style: 'cancel',
				},
			])
			return
		}

		try {
			const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId
			if (!projectId) {
				throw new Error('Project ID not found')
			}

			token = (await ExpoNotifications.getExpoPushTokenAsync({ projectId })).data

			enableNotifications({ deviceToken: token })

			console.log('[NOTIFICATIONS] Expo Device Token: ' + token)
		} catch (error) {
			token = `${error}`
		}
	}, [enableNotifications])
}
