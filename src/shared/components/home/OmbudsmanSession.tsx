import { ReactNode } from 'react'
import { Linking, Platform, StyleSheet, View } from 'react-native'

import {
	GovComplaintIcon,
	GovInformationIcon,
	GovObjectionIcon,
	GovPraiseIcon,
	GovRequestIcon,
	GovSimplifyIcon,
	GovSuggestionIcon,
} from '@/shared/assets/images'
import { SectionTitle } from '@/shared/components/SectionTitle'
import { Text } from '@/shared/components/Text'
import { Touchable } from '@/shared/components/Touchable'

type RectangleButtonProps = {
	onPress?: () => void
	label: string
	icon: ReactNode
}

const isIOS = Platform.OS === 'ios'

function RectangleButton({ icon, label, onPress }: RectangleButtonProps) {
	return isIOS ? (
		<Touchable className="flex-1 justify-center px-6 py-4 rounded-lg bg-[#DDE3E9]/[0.5]" onPress={onPress}>
			<View className="w-full flex flex-row justify-between items-center">
				<Text className="font-semibold text-600">{label}</Text>
				{icon}
			</View>
		</Touchable>
	) : (
		<Touchable
			className="flex-1 justify-center px-4 py-4 rounded-lg bg-[#DDE3E9]/[0.5]"
			onPress={onPress}
			style={styles.shadow}
		>
			<View className="w-full flex-row justify-between items-center py-[4px]">
				<Text className="font-semibold text-600">{label}</Text>
				{icon}
			</View>
		</Touchable>
	)
}

export function OmbudsmanSession() {
	return (
		<View className="gap-4 px-4">
			<SectionTitle>Ouvidoria</SectionTitle>

			<View className="flex flex-row justify-between items-center gap-4">
				<RectangleButton
					label="Denúncia"
					icon={<GovComplaintIcon width={18} height={18} />}
					onPress={() => Linking.openURL('https://falabr.cgu.gov.br/web/manifestacao/criar?tipo=1')}
				/>

				<RectangleButton
					label="Solicitação"
					icon={<GovRequestIcon width={18} height={18} />}
					onPress={() => Linking.openURL('https://falabr.cgu.gov.br/web/manifestacao/criar?tipo=5')}
				/>
			</View>

			<View className="flex flex-row justify-between items-center gap-4">
				<RectangleButton
					label="Sugestão"
					icon={<GovSuggestionIcon width={18} height={18} />}
					onPress={() => Linking.openURL('https://falabr.cgu.gov.br/web/manifestacao/criar?tipo=4')}
				/>

				<RectangleButton
					label="Simplifique"
					icon={<GovSimplifyIcon width={18} height={18} />}
					onPress={() => Linking.openURL('https://falabr.cgu.gov.br/web/manifestacao/criar?tipo=9')}
				/>
			</View>

			<View className="flex flex-row justify-between items-center gap-4">
				<RectangleButton
					label="Elogio"
					icon={<GovPraiseIcon width={18} height={18} />}
					onPress={() => Linking.openURL('https://falabr.cgu.gov.br/web/manifestacao/criar?tipo=3')}
				/>

				<RectangleButton
					label="Reclamação"
					icon={<GovObjectionIcon width={18} height={18} />}
					onPress={() => Linking.openURL('https://falabr.cgu.gov.br/web/manifestacao/criar?tipo=2')}
				/>
			</View>

			<View className="flex flex-row justify-between items-center">
				<Touchable
					className="flex-1 justify-center px-6 py-4 rounded-lg  bg-[#DDE3E9]/[0.5]"
					onPress={() => Linking.openURL('https://falabr.cgu.gov.br/web/manifestacao/criar?tipo=8')}
				>
					<View className="w-full flex flex-row gap-1 justify-center items-center py-1">
						<Text className="font-semibold text-600">Acesso a informação</Text>
						<GovInformationIcon width={18} height={18} stroke="red" strokeWidth={4} />
					</View>
				</Touchable>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	shadow: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
})
