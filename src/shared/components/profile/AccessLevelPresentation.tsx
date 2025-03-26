import { ReactNode, useMemo } from 'react'
import { View } from 'react-native'
import { capitalize } from 'radash'

import { defaultTheme } from '@/app/styles/theme'
import { authTypes } from '@/entities/auth'
import { AccessLevelSeil } from '@/shared/assets/images'
import { Text } from '@/shared/components/Text'

type AccessLevelPresentationProps = {
	levelRole: authTypes.UserLevelRole
	isAbout?: boolean
}

function LevelRoleSeil({ levelRole }: { levelRole: authTypes.UserLevelRole }) {
	const levelRoleColor = useMemo(() => {
		const levelRoleColorMap: Record<authTypes.UserLevelRole, string> = {
			bronze: defaultTheme.colors['level-role'].bronze,
			prata: defaultTheme.colors['level-role'].prata,
			ouro: defaultTheme.colors['level-role'].ouro,
			opala: defaultTheme.colors['level-role'].opala,
		}

		return levelRoleColorMap[levelRole]
	}, [levelRole])

	return <AccessLevelSeil width={20} height={20} color={levelRoleColor} />
}

function PresentationText({ children }: { children: ReactNode }) {
	return <Text className="text-justify tracking-wide text-sm">{children}</Text>
}

export function AccessLevelPresentation({ levelRole, isAbout = false }: AccessLevelPresentationProps) {
	const LevelRolePresentationText = useMemo(() => {
		const leveRolePresentationMap = new Map<authTypes.UserLevelRole, () => JSX.Element>([
			[
				'bronze',
				() => (
					<PresentationText>
						A sua conta é nível Bronze. O nível Bronze é o nível inicial de acesso e permite o uso de serviços mais
						básicos de consultas e algumas solicitações.
						{'\n\n'}
						Aumente o nível de acesso por meio do aplicativo do Gov.br.
					</PresentationText>
				),
			],
			[
				'prata',
				() => (
					<PresentationText>
						O nível Prata permite o uso dos serviços mais básicos e dos serviços intermediários, como solicitações e
						pagamentos de taxas.
						{'\n\n'}
						Aumente o nível de acesso por meio do aplicativo do Gov.br.
					</PresentationText>
				),
			],
			[
				'ouro',
				() => (
					<PresentationText>
						O nível Ouro é o nível máximo de acesso pelo Gov.Br. Ele permite o uso de quase todos os serviços e
						consultas dentro do Gov.pi Cidadão, porém para acesso completo você deve clicar no botão abaixo e atualizar
						a sua conta para o nível Opala.
					</PresentationText>
				),
			],
			[
				'opala',
				() => (
					<PresentationText>
						Parabéns! A sua conta é nível Opala. O nível Opala é o nível máximo de acesso do Gov.pi Cidadão. Agora você
						pode acessar todos os serviços da plataforma.
					</PresentationText>
				),
			],
		])

		const leveRoleAboutPresentationMap = new Map<authTypes.UserLevelRole, () => JSX.Element>([
			[
				'bronze',
				() => (
					<PresentationText>
						Ao criar sua conta no Gov.br, você já é nível Bronze também no Gov.pi Cidadão. Esse é o nível inicial de
						acesso e permite o uso de serviços mais básicos.
						{'\n\n'}
						Para ter acesso a mais serviços e funcionalidades no Gov.pi Cidadão, acesse o aplicativo do Gov.br e siga as
						instruções para aumentar o nível da conta.
					</PresentationText>
				),
			],
			[
				'prata',
				() => (
					<PresentationText>
						Ao aumentar seu nível de acesso no Gov.br para Prata, seu nível no Gov.pi Cidadão também será atualizado
						automaticamente.
						{'\n\n'}
						Acesse o aplicativo do Gov.br e siga as instruções para aumentar o nível da conta.
					</PresentationText>
				),
			],
			[
				'ouro',
				() => (
					<PresentationText>
						Ao aumentar seu nível de acesso no Gov.br para Ouro, seu nível no Gov.pi Cidadão também será atualizado
						automaticamente.
						{'\n\n'}
						Acesse o aplicativo do Gov.br e siga as instruções para aumentar o nível da conta.
					</PresentationText>
				),
			],
			[
				'opala',
				() => (
					<PresentationText>
						Após realizar todas as validações no Gov.br e obter o nível Ouro, você está apto para se tornar Opala.
						{'\n\n'}O nível Opala, é o nível mais alto e exclusivo do Gov.pi Cidadão. Ao se tornar Opala, você atinge o
						nível máximo do Gov.pi e passa a ter acesso a todos os serviços ofertados.
					</PresentationText>
				),
			],
		])

		const noopComponent = () => <></>

		if (isAbout) return leveRoleAboutPresentationMap.get(levelRole) ?? noopComponent

		return leveRolePresentationMap.get(levelRole) ?? noopComponent
	}, [levelRole, isAbout])

	return (
		<View className="gap-y-4">
			<View className="flex-row items-center justify-center w-full gap-x-2">
				<LevelRoleSeil levelRole={levelRole} />
				{isAbout ? (
					<Text className="tracking-wide text-sm font-semibold">Nível {capitalize(levelRole)}</Text>
				) : (
					<Text className="tracking-wide text-sm font-semibold">A sua conta é nível {capitalize(levelRole)}</Text>
				)}
			</View>

			<LevelRolePresentationText />
		</View>
	)
}
