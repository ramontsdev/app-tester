import Share from 'react-native-share'
import * as FileSystem from 'expo-file-system'
import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useMutation } from '@tanstack/react-query'

export type DownloadParams = {
	url: string
	filename?: string
	showShareDialog?: boolean
	headers?: Record<string, string>
}

export function useDownloadAndShare() {
	return useMutation({
		mutationKey: ['download-file'],
		mutationFn: async (variables: DownloadParams) => {
			const downloadResumable = FileSystem.createDownloadResumable(
				variables.url,
				FileSystem.documentDirectory + `${variables.filename ? variables.filename : Date.now()}`,
				{ headers: variables.headers },
			)

			return downloadResumable.downloadAsync()
		},
		onSuccess: async (file, variables) => {
			if (!file) {
				await TrueSheet.present('file-download-faliure')
				return
			}

			if (variables.showShareDialog) {
				const shareResult = await Share.open({
					message: variables.filename,
					filename: variables.filename,
					saveToFiles: true,
					showAppsToView: true,
					url: file.uri,
				})

				if (shareResult.success) {
					FileSystem.deleteAsync(file.uri)
				}
			}
		},
	})
}
