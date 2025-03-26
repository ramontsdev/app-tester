import { useMemo } from 'react'
import { View } from 'react-native'
import { Check } from 'lucide-react-native'
import { capitalize } from 'radash'

import { authTypes } from '@/entities/auth'
import { Text } from '@/shared/components/Text'

type Props = {
	levelRole: authTypes.UserLevelRole
}

export function AccessLevelsAdvantages({ levelRole }: Props) {
	const levelRoleAdvantages = useMemo(() => {
		const levelRoleAdvantagesMap: Record<authTypes.UserLevelRole, string[]> = {
			bronze: [
				'Acesse serviços da Educação e Cartilhas Informativas;',
				'Solicite e Renove as carteiras de Passe Livre Cultura e Intermunicipal, Carteira de identificação de Autista.',
			],
			prata: ['Acesse simulações de crédito;', 'Consulte as restrições e gravames do seu veículo.'],
			ouro: ['Acesse o Perfil do Servidor;', 'Assine documentos por meio do Assinador Digital Gov.pi Cidadão.'],
			opala: ['Acesso a todos os serviços ofertados no Gov.pi;', 'Segurança máxima e confiabilidade '],
		}

		return levelRoleAdvantagesMap[levelRole]
	}, [levelRole])

	return (
		<View className="gap-y-4 ">
			<Text className="text-sm font-semibold tracking-wide text-black">Vantagens do nível {capitalize(levelRole)}</Text>
			{levelRoleAdvantages.map((advantage, index) => (
				<View key={index} className="flex-row items-start gap-x-2 w-80">
					<Check color="#000000" size={16} />
					<Text className="text-sm text-black">{advantage}</Text>
				</View>
			))}
		</View>
	)
}
