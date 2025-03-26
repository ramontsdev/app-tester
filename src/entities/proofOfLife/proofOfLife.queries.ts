import { useEffect } from 'react'
import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import * as proofOfLifeApi from '@/entities/proofOfLife/proofOfLife.api'
import * as proofOfLifeTypes from '@/entities/proofOfLife/proofOfLife.types'

const keys = {
	root: () => ['proof-of-life'],
	fromPhoto: () => [...keys.root(), 'from-photo'],
	status: (key: string) => [...keys.root(), 'status', key],
	biometricData: (key: string) => [...keys.root(), 'biometric-data ', key],
}

export function useGetProofOfLifeFromPhotoMutation() {
	return useMutation({
		mutationKey: keys.fromPhoto(),
		mutationFn: (variables: proofOfLifeTypes.ProofOfLifeFromPhotoServicePayload) =>
			proofOfLifeApi.getProofOfLifeFromPhotos(variables),
		meta: { cache: false },
	})
}

export function useGetProofOfLifeStatusQuery(key: string, { enabled }: { enabled: boolean } = { enabled: false }) {
	const REFETCH_INTERVAL = 1000 * 15

	const query = useQuery({
		queryKey: keys.status(key),
		queryFn: () => proofOfLifeApi.getProofOfLifeStatus({ key }),
		enabled,
		refetchInterval: REFETCH_INTERVAL,
		meta: { cache: false },
	})

	useEffect(() => {
		if (query.status === 'success') {
			if (query.data.status === 'APROVADA') {
				TrueSheet.present('profile-update-success')
				return
			}

			if (
				query.data.status === 'NAO_ENCONTRADA' ||
				query.data.status === 'NEGADA' ||
				query.data.status === 'DESCONHECIDO'
			) {
				TrueSheet.present('profile-update-fail')
				return
			}
		}
	}, [query])

	return query
}

export function useGetUserBiographicalDataQuery(
	document: string,
	{ enabled }: { enabled: boolean } = { enabled: true },
) {
	const queryClient = useQueryClient()
	const query = useQuery({
		queryKey: keys.biometricData(document),
		queryFn: () => proofOfLifeApi.getUserBiographicalData({ document }),
		enabled,
		meta: { cache: false },
	})

	useEffect(() => {
		if (query.status === 'success') {
			queryClient.removeQueries({ queryKey: keys.biometricData(document) })
		}
	}, [document, query.status, queryClient])

	return query
}
