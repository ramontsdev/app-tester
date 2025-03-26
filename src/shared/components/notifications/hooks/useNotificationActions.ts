import { useMemo, useState } from 'react'

import useMarkAllNotificationWithRead from '@/features/notification/useMarkAllNotificationWithRead'
import { Message } from '@/entities/notification/notification.model'

export function useNotificationActions() {
	const [dropDownIsOpen, setDropDownOpen] = useState(false)
	const markAllNotificationsWithRead = useMarkAllNotificationWithRead()

	function toggleModalOpenAndClose() {
		setDropDownOpen((prevState) => !prevState)
	}

	function setAllNotificationsRead() {
		markAllNotificationsWithRead()
		toggleModalOpenAndClose()
	}

	return {
		dropDownIsOpen,
		toggleModalOpenAndClose,
		setAllNotificationsRead,
	}
}

export function useSortedNotifications(notifications?: Message[]) {
	return useMemo(() => {
		if (!notifications || notifications.length === 0) {
			return []
		}

		return [...notifications].sort((a, b) => {
			const getTimeInMinutes = (timeStr: string) => {
				if (!timeStr) return Infinity // Se não tiver data, vai para o final

				const match = timeStr.match(/(\d+)\s+(minuto|hora|dia)s?\s+atrás/)

				if (!match) return Infinity

				const value = parseInt(match[1], 10)
				const unit = match[2]

				switch (unit) {
					case 'minuto':
						return value
					case 'hora':
						return value * 60
					case 'dia':
						return value * 24 * 60
					default:
						return Infinity
				}
			}

			const minutesA = getTimeInMinutes(a.dataCriacaoFormatada)
			const minutesB = getTimeInMinutes(b.dataCriacaoFormatada)

			return minutesA - minutesB
		})
	}, [notifications])
}
