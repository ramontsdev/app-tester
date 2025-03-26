import { createFormUrlEncodedBody } from '@/shared/lib/fetch'
import { httpClient } from '@/shared/lib/httpClient'

import { NotificationsResponse } from './notification.model'

export async function getNotifications(pageIndex: number, pageSize: number): Promise<NotificationsResponse> {
	const urlParams = createFormUrlEncodedBody({ channel: 'push', pageIndex: pageIndex, pageSize: pageSize })

	const { data } = await httpClient.get(`/api/middleware/notificacoes/mensagem/buscar?${urlParams}`)

	return data
}

export async function enableNotifications(deviceToken: string): Promise<string> {
	const deviceTokenEncoded = encodeURI(deviceToken)

	const { data } = await httpClient.put(
		`/api/middleware/notificacoes/mensagem/habilitarNotificacaoPush/${deviceTokenEncoded}`,
	)

	return data
}

export async function disableNotifications() {
	await httpClient.delete(`/api/middleware/notificacoes/mensagem/desabilitarNotificacaoPush`)
}

export async function markNotificationWithRead(messagesIds: string[]) {
	const { data } = await httpClient.post('/api/middleware/notificacoes/mensagem/marcarComoLidas', messagesIds)

	return data
}
