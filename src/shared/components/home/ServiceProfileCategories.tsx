import React, { ReactNode } from 'react'
import { View } from 'react-native'
import { useRouter } from 'expo-router'

import { GovDriverIcon, GovServerIcon, GovStudentIcon } from '@/shared/assets/images'
import { Text } from '@/shared/components/Text'
import { Touchable } from '@/shared/components/Touchable'
import { cn } from '@/shared/utils/cn'
import { TypesOfSearch } from '@/shared/utils/typesOfSearch'

type CircleButtonProps = {
	className?: string
	label: string
	onPress?: () => void
	icon: ReactNode
}
function CircleButton({ label, className, icon, onPress }: CircleButtonProps) {
	return (
		<View className="items-center gap-4">
			<Touchable
				className={cn(
					'w-24 h-24 p-4 justify-center items-center rounded-full shadow-sm border border-mystic-300/20 shadow-mystic-200 bg-mystic-200/50',
					className,
				)}
				onPress={onPress}
			>
				{icon}
			</Touchable>

			<Text className="font-semibold text-primary-default">{label}</Text>
		</View>
	)
}

export function ServiceProfileCategories() {
	const router = useRouter()

	function goToSearch(item: { slug: string; name: string }) {
		router.push({
			pathname: '/services/search',
			params: { slug: item.slug, searchType: TypesOfSearch.DEPARTMENT, badgeValue: item.name },
		})
	}

	return (
		<View className="flex-row justify-around">
			<CircleButton
				label="Servidor"
				icon={<GovServerIcon />}
				onPress={() => goToSearch({ slug: 'secretaria-da-administracao-do-estado-do-piaui', name: 'Servidor' })}
			/>

			<CircleButton
				label="Condutor"
				icon={<GovDriverIcon />}
				onPress={() => goToSearch({ slug: 'departamento-estadual-de-transito-do-estado-do-piaui', name: 'Condutor' })}
			/>

			<CircleButton
				label="Estudante"
				icon={<GovStudentIcon />}
				onPress={() => goToSearch({ slug: 'secretaria-de-estado-da-educacao-do-piaui', name: 'Estudante' })}
			/>
		</View>
	)
}
