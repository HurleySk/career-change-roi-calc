import type { CalculatorInputs } from '../types/inputs'
import type { ValidationError } from '../calculations/validation'
import { CurrentCareerInputs } from './CurrentCareerInputs'
import { TransitionCostInputs } from './TransitionCostInputs'
import { NewCareerInputs } from './NewCareerInputs'
import { ProjectionSettingsInputs } from './ProjectionSettingsInputs'
import { useCallback } from 'react'

interface InputPanelProps {
  inputs: CalculatorInputs
  onChange: (inputs: CalculatorInputs) => void
  errors: ValidationError[]
}

export function InputPanel({ inputs, onChange, errors }: InputPanelProps) {
  const handleCurrentCareerChange = useCallback(
    (currentCareer: CalculatorInputs['currentCareer']) => {
      onChange({ ...inputs, currentCareer })
    },
    [inputs, onChange],
  )

  const handleTransitionCostsChange = useCallback(
    (transitionCosts: CalculatorInputs['transitionCosts']) => {
      onChange({ ...inputs, transitionCosts })
    },
    [inputs, onChange],
  )

  const handleNewCareerChange = useCallback(
    (newCareer: CalculatorInputs['newCareer']) => {
      onChange({ ...inputs, newCareer })
    },
    [inputs, onChange],
  )

  const handleProjectionSettingsChange = useCallback(
    (projectionSettings: CalculatorInputs['projectionSettings']) => {
      onChange({ ...inputs, projectionSettings })
    },
    [inputs, onChange],
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
