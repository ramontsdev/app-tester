import React, { useState } from 'react'
import { LayoutAnimation, Platform, TouchableOpacity, UIManager, View } from 'react-native'
import { ChevronDown, Minus } from 'lucide-react-native'

import { serviceModel } from '@/entities/service'

import { Text } from '../Text'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
	UIManager.setLayoutAnimationEnabledExperimental(true)
}

type AccordionItem = {
	title: string
	content: serviceModel.ParsedHtmlResult
}

type Props = {
	items: AccordionItem[]
}
export function Accordion(props: Props) {
	const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

	const toggleExpand = (index: number) => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
		setExpandedIndex(expandedIndex === index ? null : index)
	}

	return (
		<View>
			{props.items.map((item, index) => (
				<View key={index} className="border-b border-gray-300">
					<TouchableOpacity
						className="flex-row justify-between items-center py-5 px-4"
						onPress={() => toggleExpand(index)}
					>
						<Text className="text-base font-semibold text-gray-900">{item.title}</Text>

						{expandedIndex !== index && <ChevronDown color={'#374151'} />}
						{expandedIndex === index && <Minus color={'#374151'} />}
					</TouchableOpacity>

					{expandedIndex === index && (
						<View className="px-6 pb-6 flex-1 gap-4">
							{item.content.map((content, index) => {
								if (content.type === 'paragraph') {
									return (
										<Text key={index} className="text-gray-800 w-full">
											{content.text}
										</Text>
									)
								}

								if (content.type === 'unordered-list') {
									return content.items.map((item, index) => (
										<Text key={`${content.type}-${index}`} className="text-gray-800 w-full">
											{item}
										</Text>
									))
								}
							})}
						</View>
					)}
				</View>
			))}
		</View>
	)
}
