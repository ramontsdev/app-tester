import { useCallback } from 'react'
import { ActivityIndicator, ImageBackground, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { TrueSheet } from '@lodev09/react-native-true-sheet'

import { defaultTheme } from '@/app/styles/theme'
import { useUserProfile } from '@/features/authenticate/useUserProfile'
import { useDigitalDocumentStore } from '@/features/wallet/useDigitalDocumentStore'
import { digitalDocumentQueries, digitalDocumentTypes } from '@/entities/digitalDocument'
import PiGovCrest from '@/shared/assets/images/piaui-governament-crest.png'
import { Text } from '@/shared/components/Text'
import { Touchable } from '@/shared/components/Touchable'
import { cn } from '@/shared/utils/cn'

type DocumentCardProps = {
	document: digitalDocumentTypes.DigitalDocument
}

export function DigitalDocumentCard({ document }: DocumentCardProps) {
	const router = useRouter()
	const {
		query: { data: userProfile },
	} = useUserProfile()
	const setSelectedDocumentToRemove = useDigitalDocumentStore((state) => state.setSelectedDocumentToRemove)
	const { isPending } = digitalDocumentQueries.useRemoveDigitalDocumentMutation(
		document.id,
		userProfile?.preferred_username,
	)

	const handlePress = useCallback(() => {
		router.push({
			pathname: '/wallet/document-visualizer',
			params: {
				documentType: document.documentType,
				isCarousel: document.metadata.isCarousel.toString(),
			},
		})
	}, [document, router])

	const handleRemovePress = useCallback(async () => {
		if (isPending) return

		setSelectedDocumentToRemove({ id: document.id, title: document.metadata.title })
		await TrueSheet.present('remove-digital-document')
	}, [document, isPending, setSelectedDocumentToRemove])

	function capitalizeText(text: string) {
		return text
			.toLowerCase()
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')
	}

	return (
		<Touchable
			onPress={handlePress}
			className={cn(
				'min-w-[300px] min-h-[148px] z-10 bg-[#F8EDDA] pl-1 pb-4 pr-4 rounded-lg shadow-lg relative overflow-hidden',
				document.metadata.isId ? 'pt-1' : 'pt-6',
				isPending && 'opacity-50',
			)}
		>
			{document.metadata.isId && (
				<View className="bg-primary-500 w-[30px] p-1 justify-center rounded-tl-lg rounded-br-3xl">
					<Text className="font-bold text-base text-white">ID</Text>
				</View>
			)}

			<ImageBackground
				resizeMode="contain"
				className="flex-1 px-6 items-start justify-start"
				source={PiGovCrest}
				imageClassName="right-0 -top-8 bottom-0 left-64 h-40"
			>
				<Text className="font-bold text-sm">{document.metadata.title}</Text>
				<Text className="text-sm">{capitalizeText(document.metadata.owner)}</Text>

				<Text className="font-bold text-sm mt-5">Número:</Text>
				<Text>{document.documentNumber}</Text>
			</ImageBackground>

			{isPending ? (
				<View className="items-center justify-center self-end p-4 -mr-4 -mb-4">
					<ActivityIndicator size="small" color={defaultTheme.colors.gray[800]} />
				</View>
			) : (
				<TouchableOpacity className="self-end p-4 -mr-4 -mb-4" onPress={handleRemovePress} disabled={isPending}>
					<FontAwesomeIcon icon={faTrash} size={18} color={defaultTheme.colors.gray[800]} />
				</TouchableOpacity>
			)}
		</Touchable>
	)
}
