import { useEffect } from 'react'
import { router } from 'expo-router'
import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useDigitalDocumentStore } from '@/features/wallet/useDigitalDocumentStore'
import { authTypes } from '@/entities/auth'
import * as digitalDocumentApi from '@/entities/digitalDocument/digitalDocument.api'
import * as digitalDocumentTypes from '@/entities/digitalDocument/digitalDocument.types'

const keys = {
	root: () => ['digitalDocument'],
	show: (documentType: string) => [...keys.root(), 'show', documentType],
	list: (user?: string) => [...keys.root(), 'list', user],
	available: (user?: string) => [...keys.root(), 'available', user],
	add: (documentType: string) => [...keys.root(), 'add', documentType],
	remove: (documentId: string) => [...keys.root(), 'add', documentId],
}

export function useDigitalDocumentQuery({ documentType }: { documentType: string }) {
	return useQuery({
		queryKey: keys.show(documentType),
		queryFn: () => digitalDocumentApi.getDigitalDocument(documentType),
		meta: {
			cache: false,
		},
	})
}

export function useDigitalDocumentListQuery({ user }: { user?: string }) {
	const query = useQuery({
		queryKey: keys.list(user),
		queryFn: digitalDocumentApi.getDigitalDocuments,
		meta: {
			cache: false,
		},
	})

	const setAddedDigitalDocuments = useDigitalDocumentStore((state) => state.setAddedDigitalDocuments)

	useEffect(() => {
		if (query.status === 'success') setAddedDigitalDocuments(query.data.map((item) => item.documentType))
	}, [query.status, query.data, setAddedDigitalDocuments])

	return query
}

export function useDigitalDocumentsAvailableQuery({ user }: { user?: string }) {
	const addedDigitalDocuments = useDigitalDocumentStore((state) => state.addedDigitalDocuments)

	return useQuery({
		queryKey: keys.available(user),
		queryFn: digitalDocumentApi.getDocumentsAvailable,
		select: (data) =>
			data.map((item) => {
				const parsedRole = item.selo.toLowerCase() as authTypes.UserLevelRole
				const disabled = addedDigitalDocuments.includes(item.documentType)

				return { ...item, disabled, selo: parsedRole }
			}),
		meta: {
			cache: false,
		},
	})
}

export function useAddDigitalDocumentMutation(documentType: string, user?: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: keys.add(documentType),
		mutationFn: digitalDocumentApi.addDocument,
		onSuccess: async (data) => {
			if (data.sucesso) {
				await queryClient.refetchQueries({ queryKey: keys.list(user), exact: true })
				await TrueSheet.present('add-digital-document-success')
				router.back()

				return
			}

			router.back()
			await TrueSheet.present('add-digital-document-fail')
		},
		onError: async () => {
			router.back()
			await TrueSheet.present('add-digital-document-fail')
		},
	})
}

export function useRemoveDigitalDocumentMutation(documentId: string, user?: string) {
	const queryClient = useQueryClient()
	const digitalDocuments = queryClient.getQueryData<digitalDocumentTypes.DigitalDocument[]>(keys.list())

	return useMutation({
		mutationKey: keys.remove(documentId),
		mutationFn: digitalDocumentApi.removeDocument,
		onSettled: async () => {
			if (digitalDocuments?.length === 1) {
				queryClient.setQueryData(keys.list(), () => [])
				return
			}

			await queryClient.refetchQueries({ queryKey: keys.list(user), exact: true })
			await TrueSheet.dismiss('remove-digital-document')
		},
	})
}
