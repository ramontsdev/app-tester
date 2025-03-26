import { ReactNode } from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'

import { defaultTheme } from '@/app/styles/theme'
import { DigitalDocumentAvailableCard } from '@/widgets/DigitalDocumentAvailableCard'
import { useIsSignedIn } from '@/features/authenticate/useIsSignedIn'
import { useUserProfile } from '@/features/authenticate/useUserProfile'
import { authTypes } from '@/entities/auth'
import { digitalDocumentQueries } from '@/entities/digitalDocument'
import { Text } from '@/shared/components/Text'
import { DigitalDocumentsNotAvailable } from '@/shared/components/wallet/DigitalDocumentsNotAvailable'

export function DigitalDocumentAvailableList() {
	const {
		isGoldLevel,
		isSilverLevel,
		isBronzeLevel,
		query: { data: userProfile },
	} = useUserProfile()

	const { data, status, isLoading } = digitalDocumentQueries.useDigitalDocumentsAvailableQuery({
		user: userProfile?.preferred_username,
	})

	const notAvailableByLevel = (digitalDocumentLevel: authTypes.UserLevelRole) => {
		if ((isGoldLevel || isSilverLevel || isBronzeLevel) && digitalDocumentLevel === 'opala') return true
		if ((isSilverLevel || isBronzeLevel) && digitalDocumentLevel === 'ouro') return true
		if (isBronzeLevel && digitalDocumentLevel === 'prata') return true
	}

	const DigitalDocumentsWrapper = ({ children }: { children: ReactNode }) => {
		return (
			<>
				<ScrollView contentContainerClassName="px-4 flex-1">
					<Text className="text-sm font-medium text-black my-6">
						Escolha o documento que você deseja adicionar à Carteira Gov.pi:
					</Text>

					{children}
				</ScrollView>
			</>
		)
	}

	if (isLoading) {
		return (
			<DigitalDocumentsWrapper>
				<View className="items-center justify-center">
					<ActivityIndicator size="large" color={defaultTheme.colors.primary.default} />
				</View>
			</DigitalDocumentsWrapper>
		)
	}

	if (status === 'error') {
		return (
			<DigitalDocumentsWrapper>
				<View className="flex-1">
					<Text>Erro ao carregar documentos</Text>
				</View>
			</DigitalDocumentsWrapper>
		)
	}

	if (data?.length === 0) {
		return <DigitalDocumentsNotAvailable />
	}

	return (
		<DigitalDocumentsWrapper>
			<View className="flex-1 gap-y-4">
				{data?.map((item) => (
					<DigitalDocumentAvailableCard
						key={item.documentType}
						documentType={item.documentType}
						documentTitle={item.name}
						levelRole={item.selo}
						disabled={item.disabled}
						disabledByLevel={notAvailableByLevel(item.selo)}
					/>
				))}
			</View>
		</DigitalDocumentsWrapper>
	)
}
