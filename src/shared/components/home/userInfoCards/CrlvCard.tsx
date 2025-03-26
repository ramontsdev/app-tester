import { View } from 'react-native'
import { SquareCheckBig, X } from 'lucide-react-native'

import { useOpenGlobalLoading } from '@/widgets/GlobalLoding'
import { UserCard } from '@/shared/components/home/UserCard'
import { Service } from '@/shared/components/home/userInfoCards/UserInfoTypes'
import { Text } from '@/shared/components/Text'

type Props = {
	data: {
		placa: string
		modelo: string
		quantMultas: number
		restricaoAdministrativa: boolean
		restricaoJudicial: boolean
		restricaoTributaria: boolean
		licenciamentoAtrasado: boolean
	}
	service: Service
}
export function CrlvCard({ data, service }: Props) {
	const countPendencies = () => {
		let count = 0
		if (data.restricaoJudicial) count++
		if (data.restricaoAdministrativa) count++
		if (data.restricaoTributaria) count++
		if (data.licenciamentoAtrasado) count++
		return count
	}

	const globalLoding = useOpenGlobalLoading()
	const pendenciesCount = countPendencies()

	function handlePress() {
		globalLoding.openGlobalLoading([`Acessando serviço ${service.name}`, 'Aguarde'], {
			nextRoute: '/service/webView',
			routeParams: {
				uri: service.uri,
				name: service.name,
			},
		})
	}

	return (
		<UserCard className={'flex-grow'} onPress={handlePress}>
			<UserCard.Body>
				<UserCard.Title value="CRLV" />
				<Text>{data.placa}</Text>

				{pendenciesCount > 0 || data.quantMultas > 0 ? (
					<View className="flex-row gap-2">
						<UserCard.Badge value={`${pendenciesCount} pendência(s)`} />
						<UserCard.Badge value={`${data.quantMultas} multas(s)`} />
					</View>
				) : (
					<View className="flex-row gap-2">
						<UserCard.Badge value={data.modelo} />
					</View>
				)}
			</UserCard.Body>

			{pendenciesCount > 0 || data.quantMultas > 0 ? (
				<UserCard.Footer className={'bg-red-500'}>
					<>
						<X color={'#fff'} />
						<Text className="text-white font-medium">Veículo irregular</Text>
					</>
				</UserCard.Footer>
			) : (
				<UserCard.Footer>
					<>
						<SquareCheckBig color={'#fff'} />
						<Text className="text-white font-medium">Veículo regular</Text>
					</>
				</UserCard.Footer>
			)}
		</UserCard>
	)
}
