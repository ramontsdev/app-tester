import type { EnvSchema } from '@/shared/lib/env'

declare global {
	namespace NodeJS {
		interface ProcessEnv extends EnvSchema {}
	}
}
