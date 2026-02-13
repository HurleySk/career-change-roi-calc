// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { validateInputs } from '../validation'
import type { ValidationError } from '../validation'
import { DEFAULT_INPUTS } from '../defaults'

describe('validateInputs', () => {
  it('returns no errors for valid defaults', () => {
    expect(validateInputs(DEFAULT_INPUTS)).toEqual([])
  })

  it('rejects negative salary', () => {
    const inputs = {
      ...DEFAULT_INPUTS,
      currentCareer: { ...DEFAULT_INPUTS.currentCareer, annualSalary: -1 },
    }
    const errors = validateInputs(inputs)
    expect(errors.some((e: ValidationError) => e.field.includes('annualSalary'))).toBe(true)
  })

  it('rejects time horizon outside 1-30', () => {
    const inputs = {
      ...DEFAULT_INPUTS,
      projectionSettings: { ...DEFAULT_INPUTS.projectionSettings, timeHorizonYears: 0 },
    }
    const errors = validateInputs(inputs)
    expect(errors.some((e: ValidationError) => e.field.includes('timeHorizon'))).toBe(true)
  })

  it('rejects loan interest rate over 100', () => {
    const inputs = {
      ...DEFAULT_INPUTS,
      transitionCosts: {
        ...DEFAULT_INPUTS.transitionCosts,
        loan: { ...DEFAULT_INPUTS.transitionCosts.loan, interestRate: 101 },
      },
    }
    const errors = validateInputs(inputs)
    expect(errors.some((e: ValidationError) => e.field.includes('interestRate'))).toBe(true)
  })
})
