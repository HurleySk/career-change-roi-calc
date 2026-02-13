import type { CurrentCareer } from '../types/inputs'
import type { ValidationError } from '../calculations/validation'
import { NumberInput } from './NumberInput'
import { CollapsibleSection } from './CollapsibleSection'
import { useCallback } from 'react'

interface CurrentCareerInputsProps {
  values: CurrentCareer
  onChange: (values: CurrentCareer) => void
  errors: ValidationError[]
}

export function CurrentCareerInputs({
  values,
  onChange,
  errors,
}: CurrentCareerInputsProps) {
  const getError = useCallback(
    (field: string) =>
      errors.find((e) => e.field === `currentCareer.${field}`)?.message,
    [errors],
  )

  const update = useCallback(
    <K extends keyof CurrentCareer>(key: K, value: CurrentCareer[K]) => {
      onChange({ ...values, [key]: value })
    },
    [values, onChange],
  )

  return (
    <CollapsibleSection title="Current Career" accentColor="border-cyan-500">
      <NumberInput
        label="Annual Salary"
        value={values.annualSalary}
        onChange={(v) => update('annualSalary', v)}
        prefix="$"
        error={getError('annualSalary')}
      />
      <NumberInput
        label="Annual Benefits Value"
        value={values.annualBenefits}
        onChange={(v) => update('annualBenefits', v)}
        prefix="$"
        error={getError('annualBenefits')}
      />
      <NumberInput
        label="Annual Retirement Contribution"
        value={values.annualRetirementContribution}
        onChange={(v) => update('annualRetirementContribution', v)}
        prefix="$"
        error={getError('annualRetirementContribution')}
      />
      <NumberInput
        label="Expected Annual Raise"
        value={values.annualRaisePercent}
        onChange={(v) => update('annualRaisePercent', v)}
        suffix="%"
        error={getError('annualRaisePercent')}
      />
    </CollapsibleSection>
  )
}
