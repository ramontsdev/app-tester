import { env } from '@/shared/lib/env'

export function resolvePortalUri(link: string) {
	if (link.startsWith('http')) return link

	return `${env.EXPO_PUBLIC_PORTAL_URL}${link}`
}
