import { useContext } from 'react'

import { StepperContext } from './StepperContext'

export function useStepper() {
	return useContext(StepperContext)
}
