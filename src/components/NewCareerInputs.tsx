import type { NewCareer } from '../types/inputs'
import type { ValidationError } from '../calculations/validation'
import { NumberInput } from './NumberInput'
import { CollapsibleSection } from './CollapsibleSection'
import { SalaryTrajectoryTable } from './SalaryTrajectoryTable'
import { useCallback } from 'react'

interface NewCareerInputsProps {
  values: NewCareer
  onChange: (values: NewCareer) => void
  errors: ValidationError[]
}

export function NewCareerInputs({
  values,
  onChange,
  errors,
}: NewCareerInputsProps) {
  const getError = useCallback(
    (field: string) =>
      errors.find((e) => e.field === `newCareer.${field}`)?.message,
    [errors],
  )

  const update = useCallback(
    <K extends keyof NewCareer>(key: K, value: NewCareer[K]) => {
      onChange({ ...values, [key]: value })
    },
    [values, onChange],
  )

  return (
    <CollapsibleSection title="New Career" accentColor="border-emerald-500">
      <div className="mb-3">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Salary Trajectory
        </label>
        <SalaryTrajectoryTable
          entries={values.salaryTrajectory}
          onChange={(entries) => update('salaryTrajectory', entries)}
        />
        {errors
          .filter((e) => e.field.startsWith('newCareer.salaryTrajectory'))
          .map((e) => (
            <p key={e.field} className="mt-1 text-xs text-red-400">
              {e.message}
            </p>
          ))}
      </div>

      <NumberInput
        label="Default Annual Raise (after trajectory)"
        value={values.defaultRaisePercent}
        onChange={(v) => update('defaultRaisePercent', v)}
        suffix="%"
        error={getError('defaultRaisePercent')}
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
    </CollapsibleSection>
  )
}
