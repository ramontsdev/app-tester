import React, { useCallback } from 'react'
import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native'
import { Plus } from 'lucide-react-native'
import { useRouter } from 'expo-router'

import { defaultTheme } from '@/app/styles/theme'
import { DigitalDocumentCard } from '@/widgets/DigitalDocumentCard'
import { useUserProfile } from '@/features/authenticate/useUserProfile'
import { digitalDocumentQueries } from '@/entities/digitalDocument'
import { EWalletIllustration } from '@/shared/assets/images'
import { Text } from '@/shared/components/Text'
import { Touchable } from '@/shared/components/Touchable'

export function DigitalDocumentsList() {
	const router = useRouter()
	const {
		query: { data: userProfile },
	} = useUserProfile()
	const {
		data: digitalDocuments,
		isFetching,
		refetch,
	} = digitalDocumentQueries.useDigitalDocumentListQuery({ user: userProfile?.preferred_username })

	const hasDigitalDocuments = digitalDocuments && digitalDocuments?.length > 0

	const handleAddDocumentPress = useCallback(() => {
		router.push('/wallet/documents-available')
	}, [router])

	return (
		<View className="flex-1 relative">
			<FlatList
				contentContainerClassName="gap-4 px-4 py-6 flex-grow"
				data={digitalDocuments}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <DigitalDocumentCard document={item} />}
				refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
				ListEmptyComponent={
					<View className="pt-14 gap-y-6 flex-1">
						<View className="gap-y-6 flex-1 items-center">
							<EWalletIllustration />
							<View className="gap-y-4 w-full">
								<View className="flex-row items-center justify-center w-full gap-x-2">
									<Text className="tracking-wide text-center text-primary-800 font-semibold">
										Essa é a carteira digital do Gov.pi Cidadão.
									</Text>
								</View>
								<Text className="tracking-wide text-sm text-center text-primary-800">
									Clique no botão abaixo para adicionar seus documentos digitais na carteira e acessá-los a qualquer
									hora.
								</Text>
							</View>
						</View>
						<TouchableOpacity
							className="bg-success-selected rounded-xl p-4 items-center justify-center gap-x-2 flex-row"
							onPress={handleAddDocumentPress}
						>
							<Plus size={18} color={defaultTheme.colors.gray[50]} strokeWidth={2} />
							<Text className="tracking-wide text-base text-center leading-5 text-gray-50 font-semibold">
								Adicionar documentos
							</Text>
						</TouchableOpacity>
					</View>
				}
			/>

			{hasDigitalDocuments && (
				<Touchable
					className="absolute bg-success-selected w-12 h-12 rounded-full justify-center items-center bottom-6 right-8 z-20 shadow-lg"
					onPress={handleAddDocumentPress}
				>
					<Plus color="white" size={18} />
				</Touchable>
			)}
		</View>
	)
}
