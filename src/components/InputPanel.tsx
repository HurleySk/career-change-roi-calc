import type { CalculatorInputs } from '../types/inputs'
import type { ValidationError } from '../calculations/validation'
import { CurrentCareerInputs } from './CurrentCareerInputs'
import { TransitionCostInputs } from './TransitionCostInputs'
import { NewCareerInputs } from './NewCareerInputs'
import { ProjectionSettingsInputs } from './ProjectionSettingsInputs'
import { useCallback } from 'react'

interface InputPanelProps {
  inputs: CalculatorInputs
  onChange: (inputs: CalculatorInputs | ((prev: CalculatorInputs) => CalculatorInputs)) => void
  errors: ValidationError[]
}

export function InputPanel({ inputs, onChange, errors }: InputPanelProps) {
  const handleCurrentCareerChange = useCallback(
    (currentCareer: CalculatorInputs['currentCareer']) => {
      onChange((prev: CalculatorInputs) => ({ ...prev, currentCareer }))
    },
    [onChange],
  )

  const handleTransitionCostsChange = useCallback(
    (transitionCosts: CalculatorInputs['transitionCosts']) => {
      onChange((prev: CalculatorInputs) => ({ ...prev, transitionCosts }))
    },
    [onChange],
  )

  const handleNewCareerChange = useCallback(
    (newCareer: CalculatorInputs['newCareer']) => {
      onChange((prev: CalculatorInputs) => ({ ...prev, newCareer }))
    },
    [onChange],
  )

  const handleProjectionSettingsChange = useCallback(
    (projectionSettings: CalculatorInputs['projectionSettings']) => {
      onChange((prev: CalculatorInputs) => ({ ...prev, projectionSettings }))
    },
    [onChange],
  )

  return (
    <div className="space-y-1">
      <CurrentCareerInputs
        values={inputs.currentCareer}
        onChange={handleCurrentCareerChange}
        errors={errors}
      />
      <TransitionCostInputs
        values={inputs.transitionCosts}
        onChange={handleTransitionCostsChange}
        errors={errors}
      />
      <NewCareerInputs
        values={inputs.newCareer}
        onChange={handleNewCareerChange}
        errors={errors}
      />
      <ProjectionSettingsInputs
        values={inputs.projectionSettings}
        onChange={handleProjectionSettingsChange}
        errors={errors}
      />
    </div>
  )
}
