import { create } from 'zustand'

import * as authTypes from '@/entities/auth/auth.types'

type AuthStore = {
	profile?: authTypes.Profile
	setProfile: (profile: authTypes.Profile) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
	setProfile: (profile: authTypes.Profile) => {
		set(() => ({ profile }))
	},
}))
