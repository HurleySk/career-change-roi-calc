import type { CurrentCareer } from '../types/inputs'

export function calculateStayYearEarnings(
  current: CurrentCareer,
  year: number
): number {
  const baseTotal =
    current.annualSalary + current.annualBenefits + current.annualRetirementContribution
  return baseTotal * Math.pow(1 + current.annualRaisePercent / 100, year - 1)
}
