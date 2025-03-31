export function parseFavorites(jsonStr: string | undefined | null): string[] {
	if (!jsonStr) return []

	try {
		const parsed = JSON.parse(jsonStr)
		return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
	} catch {
		return []
	}
}
