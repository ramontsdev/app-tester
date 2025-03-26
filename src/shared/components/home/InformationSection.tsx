import { ReactNode } from 'react'
import { Linking, View } from 'react-native'

import { GovDoubtsIcon, GovNewsIcon } from '@/shared/assets/images'
import { SectionTitle } from '@/shared/components/SectionTitle'
import { Text } from '@/shared/components/Text'
import { Touchable } from '@/shared/components/Touchable'

type RectangleButtonProps = {
	onPress?: () => void
	label: string
	icon: ReactNode
}
function RectangleButton({ icon, label, onPress }: RectangleButtonProps) {
	return (
		<Touchable
			className="flex-grow justify-center items-center gap-2 p-2 rounded-xl bg-[#DDE3E9]/[0.5]"
			onPress={onPress}
		>
			{icon}

			<Text className="font-semibold text-600">{label}</Text>
		</Touchable>
	)
}

export function InformationSection() {
	return (
		<View className="gap-4 px-4">
			<SectionTitle>Fique informado</SectionTitle>

			<View className="flex flex-row justify-between items-center gap-4">
				<RectangleButton
					label="Dúvidas"
					icon={<GovDoubtsIcon width={60} height={60} />}
					onPress={() =>
						Linking.openURL('https://www.gov.br/ouvidorias/pt-br/central-de-conteudos/perguntas-frequentes-2019')
					}
				/>

				<RectangleButton
					label="Notícias"
					icon={<GovNewsIcon width={60} height={60} />}
					onPress={() => Linking.openURL('https://www.pi.gov.br/noticias')}
				/>
			</View>
		</View>
	)
}
