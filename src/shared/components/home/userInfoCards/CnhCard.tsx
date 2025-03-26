import { View } from 'react-native'
import { SquareCheckBig, X } from 'lucide-react-native'

import { useOpenGlobalLoading } from '@/widgets/GlobalLoding'
import { UserCard } from '@/shared/components/home/UserCard'
import { Service } from '@/shared/components/home/userInfoCards/UserInfoTypes'
import { Text } from '@/shared/components/Text'

type Props = {
	data: {
		dataValidadeCNH: string
		numeroRegistro: number
		categoriaCNH: string
		pontuacao: string | null
		processo: string | null
		registro: number
		dataEmissao: string
		bloqueioBca: boolean
		bloqueioCnhApreendida: boolean
		cnhVencida: boolean
	}
	service: Service
}
export function CnhCard({ data, service }: Props) {
	const isCnhExpired = data.cnhVencida
	const cnhIrregular = data.bloqueioCnhApreendida || data.bloqueioBca
	const globalLoding = useOpenGlobalLoading()

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
				<UserCard.Title value="Minha CNH" />
				<Text>{data.numeroRegistro}</Text>

				<View className="flex-row gap-2">
					<UserCard.Badge value={`Categoria ${data.categoriaCNH}`} />
					<UserCard.Badge value={`Vencimento ${data.dataValidadeCNH}`} />
				</View>
			</UserCard.Body>

			<UserCard.Footer className={isCnhExpired || cnhIrregular ? 'bg-red-500' : ''}>
				{isCnhExpired || cnhIrregular ? (
					<X color={'#fff'} />
				) : (
					<>
						<SquareCheckBig color={'#fff'} />
						<Text className="text-white font-medium">Sua CNH está regular</Text>
					</>
				)}
				{isCnhExpired && <Text className="text-white font-medium">Sua CNH está vencida</Text>}
				{cnhIrregular && !isCnhExpired && <Text className="text-white font-medium">Sua CNH está irregular</Text>}
			</UserCard.Footer>
		</UserCard>
	)
}
