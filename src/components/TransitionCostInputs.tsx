import type { TransitionCosts } from '../types/inputs'
import type { ValidationError } from '../calculations/validation'
import { NumberInput } from './NumberInput'
import { CollapsibleSection } from './CollapsibleSection'
import { useCallback } from 'react'

interface TransitionCostInputsProps {
  values: TransitionCosts
  onChange: (values: TransitionCosts) => void
  errors: ValidationError[]
}

export function TransitionCostInputs({
  values,
  onChange,
  errors,
}: TransitionCostInputsProps) {
  const getError = useCallback(
    (field: string) =>
      errors.find((e) => e.field === `transitionCosts.${field}`)?.message,
    [errors],
  )

  const update = useCallback(
    <K extends keyof TransitionCosts>(key: K, value: TransitionCosts[K]) => {
      onChange({ ...values, [key]: value })
    },
    [values, onChange],
  )

  const updateLoan = useCallback(
    (key: keyof TransitionCosts['loan'], value: number) => {
      onChange({
        ...values,
        loan: { ...values.loan, [key]: value },
      })
    },
    [values, onChange],
  )

  return (
    <CollapsibleSection
      title="Transition Costs"
      accentColor="border-amber-500"
    >
      <NumberInput
        label="Education / Training Cost"
        value={values.educationCost}
        onChange={(v) => update('educationCost', v)}
        prefix="$"
        error={getError('educationCost')}
      />
      <NumberInput
        label="Income Gap"
        value={values.incomeGapMonths}
        onChange={(v) => update('incomeGapMonths', v)}
        suffix="months"
        error={getError('incomeGapMonths')}
      />
      <NumberInput
        label="Other Transition Costs"
        value={values.otherCosts}
        onChange={(v) => update('otherCosts', v)}
        prefix="$"
        error={getError('otherCosts')}
      />

      <div className="mt-4 mb-2">
        <h4 className="text-sm font-medium text-slate-400 tracking-wide uppercase">
          Education Loan
        </h4>
        <div className="mt-1 border-t border-slate-700/40" />
      </div>

      <NumberInput
        label="Amount Financed"
        value={values.loan.amountFinanced}
        onChange={(v) => updateLoan('amountFinanced', v)}
        prefix="$"
        error={getError('loan.amountFinanced')}
      />
      <NumberInput
        label="Interest Rate"
        value={values.loan.interestRate}
        onChange={(v) => updateLoan('interestRate', v)}
        suffix="%"
        error={getError('loan.interestRate')}
      />
      <NumberInput
        label="Loan Term"
        value={values.loan.termYears}
        onChange={(v) => updateLoan('termYears', v)}
        suffix="years"
        error={getError('loan.termYears')}
      />
    </CollapsibleSection>
  )
}
