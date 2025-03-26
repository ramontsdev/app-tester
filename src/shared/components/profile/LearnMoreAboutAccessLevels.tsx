import { useCallback, useMemo } from 'react'
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { Hexagon } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { cva, VariantProps } from 'class-variance-authority'
import { capitalize } from 'radash'

import { defaultTheme } from '@/app/styles/theme'
import { authTypes } from '@/entities/auth'
import { Text } from '@/shared/components/Text'

type LearnMoreAboutAccessLevelsProps = {
	levelRole: authTypes.UserLevelRole
	isAbout?: boolean
}

type AccessLevelCardProps = {
	levelRole: authTypes.UserLevelRole
	onPress?: TouchableOpacityProps['onPress']
}

const levelRoleSymbolVariants = cva('h-14 w-14 p-4 items-center justify-center rounded-full', {
	variants: {
		variant: {
			opala: 'bg-level-role-opala',
			ouro: 'bg-level-role-ouro',
			prata: 'bg-level-role-prata',
			bronze: 'bg-level-role-bronze',
		},
	},
	defaultVariants: {
		variant: 'bronze',
	},
})

type LevelRoleSymbolProps = VariantProps<typeof levelRoleSymbolVariants>

function LevelRoleSymbol({ variant }: LevelRoleSymbolProps) {
	return (
		<View className={levelRoleSymbolVariants({ variant })}>
			<Hexagon color={defaultTheme.colors.gray[50]} size={24} />
		</View>
	)
}

function AccessLevelCard({ levelRole, onPress }: AccessLevelCardProps) {
	return (
		<TouchableOpacity className="bg-white items-center rounded-lg px-2 py-4 gap-y-2 flex-1" onPress={onPress}>
			<LevelRoleSymbol variant={levelRole} />
			<Text className="text-sm font-semibold text-[#1C1A1A] w-full text-center tracking-wide">
				{capitalize(levelRole)}
			</Text>
		</TouchableOpacity>
	)
}

export function LearnMoreAboutAccessLevels({ levelRole, isAbout = false }: LearnMoreAboutAccessLevelsProps) {
	const router = useRouter()

	const handleAccessLevelCardPress = useCallback(
		(levelRole: authTypes.UserLevelRole) => () => {
			if (isAbout) return router.replace({ pathname: '/profile/access-level/about/[levelRole]', params: { levelRole } })

			return router.push({ pathname: '/profile/access-level/about/[levelRole]', params: { levelRole } })
		},
		[isAbout, router],
	)

	const AccessLevelCards = useMemo(() => {
		const defaultAccessLevelCards = () => (
			<>
				<AccessLevelCard levelRole="bronze" onPress={handleAccessLevelCardPress('bronze')} />
				<AccessLevelCard levelRole="prata" onPress={handleAccessLevelCardPress('prata')} />
				<AccessLevelCard levelRole="ouro" onPress={handleAccessLevelCardPress('ouro')} />
				<AccessLevelCard levelRole="opala" onPress={handleAccessLevelCardPress('opala')} />
			</>
		)

		if (!isAbout) return defaultAccessLevelCards

		const accessLevelCardMap = new Map<authTypes.UserLevelRole, () => JSX.Element>([
			[
				'bronze',
				() => (
					<>
						<AccessLevelCard levelRole="prata" onPress={handleAccessLevelCardPress('prata')} />
						<AccessLevelCard levelRole="ouro" onPress={handleAccessLevelCardPress('ouro')} />
						<AccessLevelCard levelRole="opala" onPress={handleAccessLevelCardPress('opala')} />
					</>
				),
			],
			[
				'prata',
				() => (
					<>
						<AccessLevelCard levelRole="bronze" onPress={handleAccessLevelCardPress('bronze')} />
						<AccessLevelCard levelRole="ouro" onPress={handleAccessLevelCardPress('ouro')} />
						<AccessLevelCard levelRole="opala" onPress={handleAccessLevelCardPress('opala')} />
					</>
				),
			],
			[
				'ouro',
				() => (
					<>
						<AccessLevelCard levelRole="bronze" onPress={handleAccessLevelCardPress('bronze')} />
						<AccessLevelCard levelRole="prata" onPress={handleAccessLevelCardPress('prata')} />
						<AccessLevelCard levelRole="opala" onPress={handleAccessLevelCardPress('opala')} />
					</>
				),
			],
			[
				'opala',
				() => (
					<>
						<AccessLevelCard levelRole="bronze" onPress={handleAccessLevelCardPress('bronze')} />
						<AccessLevelCard levelRole="prata" onPress={handleAccessLevelCardPress('prata')} />
						<AccessLevelCard levelRole="ouro" onPress={handleAccessLevelCardPress('ouro')} />
					</>
				),
			],
		])

		return accessLevelCardMap.get(levelRole) ?? defaultAccessLevelCards
	}, [isAbout, handleAccessLevelCardPress, levelRole])

	return (
		<View className="flex-1 gap-y-4">
			<Text className="text-sm text-black font-medium tracking-wide">
				Conheça as vantagens e o que é preciso para evoluir seu nível de acesso ao Gov.pi Cidadão.
			</Text>
			<View className="flex-row gap-3">
				<AccessLevelCards />
			</View>
		</View>
	)
}
