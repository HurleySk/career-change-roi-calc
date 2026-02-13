// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { calculateStayYearEarnings, calculateSwitchYearEarnings, calculateTransitionCost, calculateProjection } from '../projection'
import { DEFAULT_INPUTS } from '../defaults'

describe('calculateStayYearEarnings', () => {
  const currentCareer = {
    annualSalary: 75000,
    annualBenefits: 12000,
    annualRetirementContribution: 4500,
    annualRaisePercent: 3,
  }

  it('returns base total for year 1', () => {
    const result = calculateStayYearEarnings(currentCareer, 1)
    expect(result).toBeCloseTo(91500, 0)
  })

  it('applies raise for year 2', () => {
    const result = calculateStayYearEarnings(currentCareer, 2)
    expect(result).toBeCloseTo(94245, 0)
  })

  it('compounds raises for year 5', () => {
    const result = calculateStayYearEarnings(currentCareer, 5)
    expect(result).toBeCloseTo(91500 * Math.pow(1.03, 4), 0)
  })
})

describe('calculateTransitionCost', () => {
  it('calculates total year-0 cost', () => {
    const result = calculateTransitionCost(
      { educationCost: 30000, incomeGapMonths: 6, otherCosts: 2000, loan: { amountFinanced: 25000, interestRate: 6.5, termYears: 10 } },
      75000
    )
    // incomeGapLoss = (75000/12)*6 = 37500
    // outOfPocketEducation = 30000 - 25000 = 5000
    // otherCosts = 2000
    // total = 37500 + 5000 + 2000 = 44500
    expect(result).toBeCloseTo(44500, 0)
  })
})

describe('calculateSwitchYearEarnings', () => {
  const newCareer = {
    salaryTrajectory: [
      { year: 1, salary: 55000 },
      { year: 2, salary: 65000 },
      { year: 3, salary: 78000 },
    ],
    defaultRaisePercent: 3,
    annualBenefits: 14000,
    annualRetirementContribution: 5000,
  }
  const loanAnnualPayment = 3406.44

  it('uses trajectory salary for year 1', () => {
    const result = calculateSwitchYearEarnings(newCareer, 1, loanAnnualPayment, true)
    // 55000 + 14000 + 5000 - 3406.44 = 70593.56
    expect(result).toBeCloseTo(70593.56, 0)
  })

  it('uses trajectory salary for year 3', () => {
    const result = calculateSwitchYearEarnings(newCareer, 3, loanAnnualPayment, true)
    // 78000 + 14000 + 5000 - 3406.44 = 93593.56
    expect(result).toBeCloseTo(93593.56, 0)
  })

  it('applies default raise after trajectory ends', () => {
    const result = calculateSwitchYearEarnings(newCareer, 4, loanAnnualPayment, true)
    // salary = 78000 * 1.03 = 80340
    // 80340 + 14000 + 5000 - 3406.44 = 95933.56
    expect(result).toBeCloseTo(80340 + 14000 + 5000 - 3406.44, 0)
  })

  it('excludes loan payment after loan term ends', () => {
    const result = calculateSwitchYearEarnings(newCareer, 5, loanAnnualPayment, false)
    const salary = 78000 * Math.pow(1.03, 2)
    expect(result).toBeCloseTo(salary + 14000 + 5000, 0)
  })
})

describe('calculateProjection', () => {
  it('returns correct number of yearly projections', () => {
    const result = calculateProjection(DEFAULT_INPUTS)
    expect(result.yearlyProjections).toHaveLength(DEFAULT_INPUTS.projectionSettings.timeHorizonYears)
  })

  it('year 1 stay cumulative is positive', () => {
    const result = calculateProjection(DEFAULT_INPUTS)
    expect(result.yearlyProjections[0].stayCumulative).toBeGreaterThan(0)
  })

  it('year 1 switch cumulative is less than stay (transition costs)', () => {
    const result = calculateProjection(DEFAULT_INPUTS)
    expect(result.yearlyProjections[0].switchCumulative).toBeLessThan(
      result.yearlyProjections[0].stayCumulative
    )
  })

  it('calculates totalTransitionCost including loan interest', () => {
    const result = calculateProjection(DEFAULT_INPUTS)
    expect(result.totalTransitionCost).toBeGreaterThan(0)
  })

  it('returns null breakEvenYear when new career never catches up', () => {
    const inputs = {
      ...DEFAULT_INPUTS,
      newCareer: {
        ...DEFAULT_INPUTS.newCareer,
        salaryTrajectory: [{ year: 1, salary: 30000 }],
        defaultRaisePercent: 1,
      },
      projectionSettings: { ...DEFAULT_INPUTS.projectionSettings, timeHorizonYears: 5 },
    }
    const result = calculateProjection(inputs)
    expect(result.breakEvenYear).toBeNull()
  })

  it('provides both nominal and real cumulative values', () => {
    const result = calculateProjection(DEFAULT_INPUTS)
    const year1 = result.yearlyProjections[0]
    expect(year1.stayNominalCumulative).toBeGreaterThanOrEqual(year1.stayCumulative)
  })
})
