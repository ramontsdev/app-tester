import axios from 'axios'

import { authLib } from '@/entities/auth'
import { env } from '@/shared/lib/env'

export const httpClient = axios.create({
	baseURL: env.EXPO_PUBLIC_PORTAL_URL,
})

authLib.createAuthInterceptor(httpClient)
