// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { calculateStayYearEarnings } from '../projection'

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
