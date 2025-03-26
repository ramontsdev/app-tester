import { ActivityIndicator, ScrollView, View } from 'react-native'

import { defaultTheme } from '@/app/styles/theme'
import { digitalDocumentQueries } from '@/entities/digitalDocument'
import { Text } from '@/shared/components/Text'
import { ErrorToLoadWallet } from '@/shared/components/wallet/ErrorToLoadWallet'
import { GenericDigitalDocument } from '@/shared/components/wallet/GenericDigitalDocument'

import { ShareButton } from './ShareButton'

export function DigitalDocumentNotCarousel({ documentType }: { documentType: string }) {
	const {
		data: digitalDocumentDetail,
		isLoading: digitalDocumentDetailIsLoading,
		error: digitalDocumentDetailError,
	} = digitalDocumentQueries.useDigitalDocumentQuery({ documentType: documentType })

	if (digitalDocumentDetailIsLoading) {
		return (
			<View className="items-center justify-center">
				<ActivityIndicator size="large" color={defaultTheme.colors.primary.default} />
			</View>
		)
	}

	if (digitalDocumentDetailError || !digitalDocumentDetail) {
		return <ErrorToLoadWallet />
	}

	const pathSiglePDF = digitalDocumentDetail.files.find((documentFile) => documentFile.name === 'PDF_UNICO')?.url

	return (
		<ScrollView contentContainerClassName="px-8 pt-6 flex-1">
			<View className="flex-1">
				<GenericDigitalDocument digitalDocument={digitalDocumentDetail} />

				{digitalDocumentDetail.qrCodeUrl && (
					<Text className="text-base font-medium py-11 text-center">Verifique a autenticidade do QR Code.</Text>
				)}
			</View>

			{pathSiglePDF && (
				<ShareButton
					className="self-end mt-6 mb-6"
					fileName={`${digitalDocumentDetail.metadata.title}.pdf`}
					url={pathSiglePDF}
				/>
			)}
		</ScrollView>
	)
}
