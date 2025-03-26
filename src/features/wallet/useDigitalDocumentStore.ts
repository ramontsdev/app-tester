import { create } from 'zustand'

type DocumentToRemove = {
	title: string
	id: string
}

type DigitalDocumentStore = {
	pressedDigitalDocumentToAddTitle: string
	selectedDocumentToRemove: DocumentToRemove
	addedDigitalDocuments: string[]
	setPressedDigitalDocumentToAddTitle: (title: string) => void
	setSelectedDocumentToRemove: (doucmentToRemove: DocumentToRemove) => void
	setAddedDigitalDocuments: (documentTypeList: string[]) => void
}

export const useDigitalDocumentStore = create<DigitalDocumentStore>((set) => ({
	pressedDigitalDocumentToAddTitle: '',
	selectedDocumentToRemove: { id: '', title: '' },
	addedDigitalDocuments: [],
	setPressedDigitalDocumentToAddTitle: (title) => set({ pressedDigitalDocumentToAddTitle: title }),
	setSelectedDocumentToRemove: (doucmentToRemove) => set({ selectedDocumentToRemove: doucmentToRemove }),
	setAddedDigitalDocuments: (documentTypeList) => set({ addedDigitalDocuments: documentTypeList }),
}))
