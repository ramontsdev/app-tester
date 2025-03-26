import React from 'react'
import { Download } from 'lucide-react-native'

import { useOpenGlobalLoading } from '@/widgets/GlobalLoding'
import { useDownloadAndShare } from '@/features/downloadAndShare/useDownloadAndShare'
import { paycheckTypes } from '@/entities/paycheck'
import { UserCard } from '@/shared/components/home/UserCard'
import { Text } from '@/shared/components/Text'
import { Touchable } from '@/shared/components/Touchable'

type Props = {
	data: paycheckTypes.PayCheck
}

export function ContrachequeCard({ data }: Props) {
	const { mutate: downloadAndShare } = useDownloadAndShare()
	const globalLoading = useOpenGlobalLoading()

	return (
		<UserCard className={'flex-grow'}>
			<Touchable
				onPress={() =>
					globalLoading.openGlobalLoading([`Acessando serviço Perfil Servidor`, 'Aguarde'], {
						nextRoute: '/service/webView',
						routeParams: {
							uri: '/app/app-perfil-servidor',
							name: 'Serviço',
						},
					})
				}
			>
				<UserCard.Body>
					<UserCard.Title value="Contracheque" />
					<Text>{data.periodo}</Text>

					<UserCard.Badge value={`${data.siglaUrl.toUpperCase()}`} className="bg-[#8AC1A1]" />
				</UserCard.Body>
			</Touchable>
			<Touchable
				onPress={() =>
					downloadAndShare({
						url: `${data.link}`,
						filename: `contracheque-${data.periodo.replace('/', '-')}.pdf`,
						showShareDialog: true,
					})
				}
			>
				<UserCard.Footer className="bg-[#8AC1A1]">
					<>
						<Download color={'#215F3A'} />
						<Text className="font-medium">Baixar</Text>
					</>
				</UserCard.Footer>
			</Touchable>
		</UserCard>
	)
}
