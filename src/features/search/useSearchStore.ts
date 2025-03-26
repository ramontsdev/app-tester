import { create } from 'zustand'

type SearchStore = {
	value: string
	showModal: boolean
	setValue: (value: string) => void
	setShowModal: (value: boolean) => void
}

export const useSearchStore = create<SearchStore>((set) => ({
	value: '',
	showModal: false,
	setValue: (data) => set({ value: data }),
	setShowModal: (showModal) => set({ showModal }),
}))
