import * as SecureStore from 'expo-secure-store'
import { mapEntries as mapObjectEntries } from 'radash'
import * as v from 'valibot'

import { tokenIntrospectionSchema, tokenSchema } from '@/entities/auth/auth.model'
import { env } from '@/shared/lib/env'
import { accessToken, refreshToken } from '@/shared/lib/localToken'
import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

type FetchMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type FetchRecordValue = string | string[] | number | boolean | null | undefined

type FetchApiRecord = Record<string, FetchRecordValue>

type SendParams<PayloadType> = {
	baseUrl: string
	method: FetchMethods
	path: string
	headers: FetchApiRecord
	data?: PayloadType
	requireAuth: boolean
}

type SendOptions = {
	method: FetchMethods
	headers: Headers
	body?: string
}

function clearValue(value: FetchRecordValue) {
	if (typeof value === 'number' || typeof value === 'boolean') {
		return value.toString()
	}

	return value ?? null
}

function formatHeaders(headersRecord: FetchApiRecord): Headers {
	const headers = new Headers()

	Object.entries(headersRecord).forEach(([key, value]) => {
		const cleanValue = clearValue(value)

		if (!cleanValue) return

		if (!Array.isArray(cleanValue)) {
			headers.append(key, cleanValue)

			return
		}

		cleanValue.forEach((v) => headers.append(key, v))
	})

	return headers
}

async function send<PayloadType>({ baseUrl, method, headers = {}, path, data, requireAuth }: SendParams<PayloadType>) {
	const formattedHeaders = formatHeaders(headers)
	const opts: SendOptions = { method, headers: new Headers(formattedHeaders) }

	if (data) {
		if (!opts.headers.has('Content-Type')) {
			opts.headers.append('Content-Type', 'application/json')
			opts.body = JSON.stringify(data)
		}

		opts.body = `${data}`
	}

	if (requireAuth) {
		const currentToken = accessToken.get()

		if (currentToken) opts.headers.append('Authorization', `Bearer ${currentToken}`)
	}

	const response = await fetch(`${baseUrl}${path}`, opts)

	if (response.ok || response.status === 422) {
		const text = await response.text()

		if (!text) return {}

		return JSON.parse(text)
	}

	return { status: response.status }
}

export function createFetchApi(baseUrl: string, opts: { requireAuth: boolean } = { requireAuth: false }) {
	const get = async (path: string, headers: FetchApiRecord = {}) =>
		await send({ baseUrl, method: 'GET', headers, path, requireAuth: opts.requireAuth })

	const post = async <PayloadType>(path: string, data: PayloadType, headers: FetchApiRecord = {}) =>
		await send({ baseUrl, method: 'POST', headers, path, data, requireAuth: opts.requireAuth })

	const put = async <PayloadType>(path: string, data: PayloadType, headers: FetchApiRecord = {}) =>
		await send({ baseUrl, method: 'PUT', headers, path, data, requireAuth: opts.requireAuth })

	const patch = async <PayloadType>(path: string, data: PayloadType, headers: FetchApiRecord = {}) =>
		await send({ baseUrl, method: 'PATCH', headers, path, data, requireAuth: opts.requireAuth })

	const del = async (path: string, headers: FetchApiRecord = {}) =>
		await send({ baseUrl, method: 'DELETE', headers, path, requireAuth: opts.requireAuth })

	return { get, post, put, patch, del }
}

export function createAuthedFetchApi(baseUrl: string) {
	const internalAuthApi = createFetchApi(`${env.EXPO_PUBLIC_PORTAL_AUTH_URL}/auth/realms/pi/protocol/openid-connect`, {
		requireAuth: true,
	})

	const introspectToken = async () => {
		const currentToken = accessToken.get()

		if (!currentToken) return { success: false } as const

		const payload = {
			client_id: env.EXPO_PUBLIC_SERVICE_TOKEN_CLIENT_ID,
			client_secret: env.EXPO_PUBLIC_SERVICE_TOKEN_CLIENT_SECRET,
			token: currentToken,
		}

		const body = createFormUrlEncodedBody(payload)

		const response = await internalAuthApi.post('/token/introspect', body, {
			'Content-Type': 'application/x-www-form-urlencoded',
		})

		const result = ensureResponse(response, tokenIntrospectionSchema)

		return result
	}

	const revalidateToken = async () => {
		const introspectTokenResult = await introspectToken()

		if (!introspectTokenResult.success) return

		if (introspectTokenResult.data.active) return

		const currentRefreshToken = refreshToken.get()

		if (!currentRefreshToken) return

		const payload = {
			grant_type: 'refresh_token',
			client_id: 'portal-web',
			refresh_token: currentRefreshToken,
		}

		const body = createFormUrlEncodedBody(payload)

		const response = await internalAuthApi.post('/token', body, {
			'Content-Type': 'application/x-www-form-urlencoded',
		})

		const result = ensureResponse(response, tokenSchema)

		if (!result.success) return

		await accessToken.remove()
		await refreshToken.remove()
		await SecureStore.deleteItemAsync(LocalStorageKeys.ID_TOKEN)

		accessToken.store(result.data.access_token)
		refreshToken.store(result.data.refresh_token)
		SecureStore.setItem(LocalStorageKeys.ID_TOKEN, result.data.id_token)
	}

	const get = async (path: string, headers: FetchApiRecord = {}) => {
		await revalidateToken()
		await send({ baseUrl, method: 'GET', headers, path, requireAuth: true })
	}

	const post = async <PayloadType>(path: string, data: PayloadType, headers: FetchApiRecord = {}) => {
		await revalidateToken()
		await send({ baseUrl, method: 'POST', headers, path, data, requireAuth: true })
	}

	const put = async <PayloadType>(path: string, data: PayloadType, headers: FetchApiRecord = {}) => {
		await revalidateToken()
		await send({ baseUrl, method: 'PUT', headers, path, data, requireAuth: true })
	}

	const patch = async <PayloadType>(path: string, data: PayloadType, headers: FetchApiRecord = {}) => {
		await revalidateToken()
		await send({ baseUrl, method: 'PATCH', headers, path, data, requireAuth: true })
	}

	const del = async (path: string, headers: FetchApiRecord = {}) => {
		await revalidateToken()
		await send({ baseUrl, method: 'DELETE', headers, path, requireAuth: true })
	}

	return { get, post, put, patch, del }
}

export function ensureResponse<Schema extends v.GenericSchema>(serviceResponse: unknown, schema: Schema) {
	const parsedResult = v.safeParse(schema, serviceResponse)

	if (!parsedResult.success) return { success: false, issues: parsedResult.issues } as const

	return {
		success: true,
		data: parsedResult.output,
	} as const
}

export function createFormUrlEncodedBody(payload: Record<string, unknown>) {
	const parsedPayload = mapObjectEntries(payload, (key, value) => [key, `${value}`])
	const urlEncodedPayload = new URLSearchParams(parsedPayload)

	return urlEncodedPayload.toString()
}
