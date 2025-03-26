import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { IconDefinition, IconProp, library } from '@fortawesome/fontawesome-svg-core'
import { faHelmetSafety, faTruckMedical, faUserDoctor } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { capitalize } from 'radash'

import { serviceTypes } from '@/entities/service'
import { Text } from '@/shared/components/Text'
import { cn } from '@/shared/utils/cn'

const importedIcons = [faUserDoctor, faHelmetSafety, faTruckMedical] as IconDefinition[]
library.add(importedIcons)

type Props = {
	data: serviceTypes.Service
	className?: string
	handleRedirect: () => void
}

export function SearchResultCard({ data, className, handleRedirect }: Props) {
	const iconName = data.icon.slice(3)

	return (
		<TouchableOpacity
			className={cn('flex-1 flex-row gap-8 bg-mystic-200 rounded-lg py-3 px-6 justify-between items-center', className)}
			onPress={handleRedirect}
		>
			<View className="flex-1 gap-2 min-h-28">
				<View className="flex flex-row gap-2">
					{data.targets.map((target) => (
						<View key={target} className="flex gap-2 bg-[#1D9878] rounded-full px-2 py-0.5">
							<Text className="font-semibold text-xs text-center text-white">{capitalize(target)}</Text>
						</View>
					))}
				</View>

				<Text className="font-semibold text-sm leading-4 my-1">{data.title}</Text>

				<Text numberOfLines={2} className="font-normal text-sm text-left leading-4">
					{data.description}
				</Text>
			</View>

			<View className="flex-2">
				<View className="w-14 h-14 rounded-full bg-spindle-300 items-center justify-center">
					<FontAwesomeIcon icon={iconName as IconProp} size={16} color="white" />
				</View>
			</View>
		</TouchableOpacity>
	)
}
