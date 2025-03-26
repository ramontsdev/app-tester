import { View } from 'react-native'

import { serviceModel } from '@/entities/service'
import { cn } from '@/shared/utils/cn'

import { Text } from '../Text'
import { StepperFooter, StepperNextButton, StepperPreviousButton } from './Stepper'

type StepProps = {
	index: number
	name: string
	description: string
	richContent: serviceModel.ParsedHtmlResult
	hasNextStep: boolean
}
export function Step(props: StepProps) {
	return (
		<View className="min-h-64 justify-between">
			<View className="gap-4 mt-4">
				<View className="flex-row gap-2 items-center">
					<View className="w-8 h-8 rounded-full bg-primary-default justify-center items-center">
						<Text className="text-white font-semibold">{props.index + 1}</Text>
					</View>

					<Text className="text-lg font-medium mr-1">{props.name}</Text>
				</View>

				<Text className="text-lg ml-3">{props.description}</Text>
			</View>

			<StepperFooter>
				<View className={cn('w-full flex-row gap-2 justify-end', props.index !== 0 && 'justify-between')}>
					{props.index !== 0 && <StepperPreviousButton />}
					{props.hasNextStep && <StepperNextButton />}
				</View>
			</StepperFooter>
		</View>
	)
}
