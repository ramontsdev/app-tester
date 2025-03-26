import { create } from 'zustand'

import { localStorage } from '@/shared/lib/localStorage'
import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

type NotificationStore = {
	notificationRefresh: boolean
	setNotificationRefreshing: (value: boolean) => void
	notificationEnable: boolean
	setNotificationEnable: (value: boolean) => void
}

const notificationEnableLocal = localStorage.getItem(LocalStorageKeys.NOTIFICATION_ENABLE) === 'true'

export const useNotificationStore = create<NotificationStore>((set) => ({
	notificationRefresh: false,
	notificationEnable: notificationEnableLocal,
	setNotificationEnable: (data) => set({ notificationEnable: data }),
	setNotificationRefreshing: (data) => set({ notificationRefresh: data }),
}))
