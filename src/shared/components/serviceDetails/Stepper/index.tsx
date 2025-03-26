import React, { useCallback, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { ArrowLeft, ArrowRight } from 'lucide-react-native'

import { defaultTheme } from '@/app/styles/theme'
import { cn } from '@/shared/utils/cn'

import { StepperContext } from './StepperContext'
import { useStepper } from './useStepper'

type StepperProps = {
	initialStep?: number
	steps: {
		label: string
		content: React.ReactNode
	}[]
}

export function Stepper({ steps, initialStep = 0 }: StepperProps) {
	const [currentStep, setCurrentStep] = useState(initialStep)

	const previousStep = useCallback(() => {
		setCurrentStep((prevState) => Math.max(0, prevState - 1))
	}, [])

	const nextStep = useCallback(() => {
		setCurrentStep((prevState) => Math.min(steps.length - 1, prevState + 1))
	}, [steps])

	const progress = (() => {
		if (steps.length === 0) return 0

		const totalSteps = steps.length - 1
		const stepWidth = 100 / totalSteps

		if (currentStep === totalSteps) return 100

		return currentStep * stepWidth + stepWidth / 2
	})()

	return (
		<StepperContext.Provider value={{ previousStep, nextStep }}>
			<View>
				<View
					className={cn(
						'h-4 w-full relative justify-center bg-white px-4 rounded-full',
						currentStep === steps.length - 1 && 'bg-primary-default',
					)}
				>
					<View className="relative my-2 items-center">
						{/* Barra de progresso */}
						<View className="h-4 absolute top-1/2 left-0 right-0 bg-white rounded-full -translate-y-1/2">
							<View style={[{ width: `${progress}%` }]} className="h-full bg-primary-default rounded-full" />
						</View>

						{/* Pontos de progresso */}
						<View className="w-full h-4 flex-row justify-between items-center py-2 -translate-y-1/2">
							{steps.map((_, index) => (
								<View
									key={index}
									className={cn(
										'w-1.5 h-1.5 rounded-full bg-primary-default',
										index <= currentStep && 'bg-primary-50 border-none',
									)}
								/>
							))}
						</View>
					</View>

					<View className="h-full w-full absolute bg-primary-default -z-10 rounded-full" />
				</View>

				{/* Conteúdo do passo atual */}
				<View className="mt-3">{steps[currentStep].content}</View>
			</View>
		</StepperContext.Provider>
	)
}

export function StepperFooter({ children, className }: { children: React.ReactNode; className?: string }) {
	return <View className={cn('flex-row justify-between gap-1 mt-1', className)}>{children}</View>
}

export function StepperPreviousButton({ onPress, ...props }: React.ComponentPropsWithoutRef<typeof TouchableOpacity>) {
	const { previousStep } = useStepper()

	return (
		<TouchableOpacity onPress={onPress ?? previousStep} {...props}>
			<ArrowLeft color={defaultTheme.colors.primary.default} />
		</TouchableOpacity>
	)
}

export function StepperNextButton({ onPress, ...props }: React.ComponentPropsWithoutRef<typeof TouchableOpacity>) {
	const { nextStep } = useStepper()

	return (
		<TouchableOpacity onPress={onPress ?? nextStep} {...props}>
			<ArrowRight color={defaultTheme.colors.primary.default} />
		</TouchableOpacity>
	)
}
