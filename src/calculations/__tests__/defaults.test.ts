// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { DEFAULT_INPUTS } from '../defaults'

describe('DEFAULT_INPUTS', () => {
  it('has valid current career defaults', () => {
    expect(DEFAULT_INPUTS.currentCareer.annualSalary).toBe(75000)
    expect(DEFAULT_INPUTS.currentCareer.annualRaisePercent).toBe(3)
  })

  it('has valid transition cost defaults', () => {
    expect(DEFAULT_INPUTS.transitionCosts.educationCost).toBe(30000)
    expect(DEFAULT_INPUTS.transitionCosts.loan.interestRate).toBe(6.5)
  })

  it('has valid projection settings defaults', () => {
    expect(DEFAULT_INPUTS.projectionSettings.timeHorizonYears).toBe(10)
    expect(DEFAULT_INPUTS.projectionSettings.inflationRate).toBe(3)
    expect(DEFAULT_INPUTS.projectionSettings.investmentReturnRate).toBe(7)
  })

  it('has a salary trajectory with at least one entry', () => {
    expect(DEFAULT_INPUTS.newCareer.salaryTrajectory.length).toBeGreaterThan(0)
  })
})
