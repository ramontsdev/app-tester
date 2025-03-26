import React from 'react'
import { Image, ImageBackground, View } from 'react-native'

import { digitalDocumentTypes } from '@/entities/digitalDocument'
import NegativeLogo from '@/shared/assets/images/negative-logo.svg'

import { Text } from '../Text'

type GenericDigitalDocumentProps = {
	digitalDocument: digitalDocumentTypes.DigitalDocument
}

export function GenericDigitalDocument({ digitalDocument }: GenericDigitalDocumentProps) {
	return (
		<View>
			<View className="flex flex-row justify-between items-center bg-primary-700 p-3 rounded-t-lg gap-7">
				<Text className="text-sm text-white font-semibold w-3/5">{digitalDocument.metadata.title}</Text>
				<NegativeLogo />
			</View>

			<ImageBackground
				resizeMode="contain"
				className="bg-white p-3 rounded-b-lg flex flex-grow flex-row justify-between overflow-hidden min-h-96"
				source={require('../../assets/images/piaui-governament-crest.png')}
				imageClassName="h-40"
			>
				<View className="flex-1">
					{digitalDocument.photo && <Image className="w-20 h-20 mb-4" source={{ uri: digitalDocument.photo }} />}

					{digitalDocument.fields.map((field) => (
						<View key={field.key} className="mb-4">
							<Text className="text-xs uppercase">{field.key}:</Text>
							<Text className="text-xs font-medium">{field.value || 'Não Informado'}</Text>
						</View>
					))}
				</View>

				{digitalDocument.qrCodeUrl && <Image className="w-20 h-20" source={{ uri: digitalDocument.qrCodeUrl }} />}
			</ImageBackground>
		</View>
	)
}
