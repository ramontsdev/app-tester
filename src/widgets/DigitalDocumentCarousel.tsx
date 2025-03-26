import { useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Pdf from 'react-native-pdf'

import { defaultTheme } from '@/app/styles/theme'
import { digitalDocumentQueries } from '@/entities/digitalDocument'
import { Text } from '@/shared/components/Text'
import { ErrorToLoadWallet } from '@/shared/components/wallet/ErrorToLoadWallet'

import { ShareButton } from './ShareButton'

export function DigitalDocumentCarousel({ documentType }: { documentType: string }) {
	const {
		data: digitalDocumentDetail,
		isLoading: digitalDocumentDetailIsLoading,
		error: digitalDocumentDetailError,
	} = digitalDocumentQueries.useDigitalDocumentQuery({ documentType: documentType })

	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(0)

	const slides = new Array(totalPages).fill(0).map((_, i) => ({ id: i + 1 }))

	const onPageChanged = (page: number, numberOfPages: number) => {
		setCurrentPage(page)
		setTotalPages(numberOfPages)
	}

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

	const pathPaginatedPDF = digitalDocumentDetail.files.find((documentFile) => documentFile.name === 'PDF_PAGINADO')?.url

	const pathSiglePDF = digitalDocumentDetail.files.find((documentFile) => documentFile.name === 'PDF_UNICO')?.url

	return (
		<ScrollView contentContainerClassName="px-8 pt-6 flex-grow">
			<View className="flex-1 items-center">
				{digitalDocumentDetail.metadata.isId && (
					<Text className="text-xs font-semibold text-center text-white bg-primary-700 rounded-md px-2 py-1 max-w-52">
						Documento de Identificação
					</Text>
				)}

				<View className="w-full h-full -rotate-90 flex justify-center">
					<Pdf
						trustAllCerts={false}
						renderActivityIndicator={() => <ActivityIndicator size="large" color="#034EA2" />}
						enablePaging={true}
						enableRTL={false}
						onLoadComplete={(numberOfPages, filePath) => {
							setTotalPages(numberOfPages)
						}}
						onPageChanged={(page, numberOfPages) => onPageChanged(page, numberOfPages)}
						onError={(error) => console.log({ error })}
						style={{
							width: '100%',
							height: '100%',
							overflow: 'hidden',
							backgroundColor: 'transparent',
						}}
						source={{ uri: pathPaginatedPDF, cache: true }}
						enableDoubleTapZoom={false}
					/>
				</View>
			</View>

			<View className="w-full flex-row justify-center">
				{slides?.map((slide, i) => (
					<View
						key={slide.id}
						className="w-3 h-3 rounded-full m-1 bg-[#555]"
						style={{ backgroundColor: i === currentPage - 1 ? '#7F7D7D' : '#BABABC' }}
					/>
				))}
			</View>

			<Text className="text-base font-medium mt-7 text-center">Verifique a autenticidade do QR Code.</Text>

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
