import { View } from 'react-native'

import { MappedServiceModel } from '@/entities/service/service.model'

import { Text } from '../Text'
import { Step } from './Step'
import { Stepper } from './Stepper'

type Props = {
	data: MappedServiceModel
}
export function Steps({ data }: Props) {
	return (
		<View className="mt-8 gap-6">
			<Text className="font-semibold text-lg text-primary-default">Quais as etapas?</Text>

			<View className="bg-success-100/50 rounded-lg p-4">
				<Stepper
					steps={data.steps.map((step, index) => ({
						label: step.name,
						content: (
							<Step
								index={index}
								name={step.name}
								description={step.description}
								richContent={step.htmlContent}
								hasNextStep={data.steps.length - 1 !== index}
							/>
						),
					}))}
				/>
			</View>
		</View>
	)
}
