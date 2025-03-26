import { ReactNode } from 'react'
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native'
import { BadgeCheck, Dot } from 'lucide-react-native'
import { Stack, useRouter } from 'expo-router'

import { defaultTheme } from '@/app/styles/theme'
import { UserProfileCard } from '@/widgets/UserProfileCard'
import { useUserProfile } from '@/features/authenticate/useUserProfile'
import { proofOfLifeQueries } from '@/entities/proofOfLife'
import { NotificationIcon } from '@/shared/components/home/NotificationIcon'
import { Text } from '@/shared/components/Text'
import { cn } from '@/shared/utils/cn'

function TextListItem({ children }: { children: ReactNode }) {
	return (
		<View className="flex-row items-center gap-x-2">
			<Dot color="#000000" size={16} />
			<Text className="text-sm text-black">{children}</Text>
		</View>
	)
}

function TextList({ title, items }: { title: string; items: string[] }) {
	return (
		<View className="gap-y-1">
			<Text className="text-sm tracking-wide text-black">{title}</Text>
			{items.map((item, index) => (
				<TextListItem key={index} children={item} />
			))}
		</View>
	)
}

export default function ProfileUpgrade() {
	const router = useRouter()
	const {
		query: { data: userProfile },
	} = useUserProfile()
	const {
		data: userBiographicalData,
		status: biographicalDataStatus,
		isFetching: isBiographicalDataFetching,
	} = proofOfLifeQueries.useGetUserBiographicalDataQuery(userProfile?.preferred_username ?? '')

	const handleLevelUpgradePress = () => {
		if (biographicalDataStatus === 'success' && !userBiographicalData?.cin) {
			return
		}

		router.push('/profile/access-level/upgrade/face-recognition')
	}

	return (
		<>
			<Stack.Screen
				options={{
					title: 'Nível da conta',
					headerRight: () => <NotificationIcon />,
				}}
			/>

			<UserProfileCard />

			<ScrollView className="px-4 m-4 " persistentScrollbar={true} indicatorStyle="black">
				<View className="gap-y-4 flex-1">
					<Text className="tracking-wide text-sm font-semibold text-black">
						Você precisa possuir a nova CIN para se tornar Nível Opala
					</Text>
					<Text className="text-justify tracking-wide text-sm text-black">
						Compareça ao <Text className="font-semibold">Espaço da Cidadania</Text> portando os seguintes documentos:
					</Text>
					<TextList
						title="Obrigatórios:"
						items={['Certidão de Nascimento/Casamento', 'Comprovante de Residência', 'CPF']}
					/>
					<Text className="text-sm font-semibold tracking-wide text-black">
						Obs: Certidão original atualizada com selo de verificação
					</Text>
					<TextList
						title="Opcionais:"
						items={[
							'NIT/PIS/PASEP',
							'CNH',
							'Título de Eleitor',
							'Tipo Sanguíneo',
							'Carteira Profissional',
							'Certificado de Reservista',
							'Cartão do SUS',
						]}
					/>
					<TextList title="Pessoas com Deficiência:" items={['Laudo Médico']} />
				</View>
			</ScrollView>
			<View className="mx-4">
				{isBiographicalDataFetching ? (
					<View className="w-full justify-center items-center my-4">
						<ActivityIndicator size="large" color={defaultTheme.colors.primary.default} />
					</View>
				) : (
					<TouchableOpacity
						className={cn(
							'my-4 flex-row items-center justify-center w-full p-3 gap-x-2 bg-primary-default rounded-lg border border-primary-default shadow-sm',
							!userBiographicalData?.cin && 'opacity-50',
						)}
						onPress={handleLevelUpgradePress}
						disabled={!userBiographicalData?.cin}
					>
						<Text className="text-base leading-6 font-semibold text-center text-white">Aumentar nível</Text>
						<BadgeCheck color="#ffffff" size={18} />
					</TouchableOpacity>
				)}
			</View>
		</>
	)
}
