import type { CurrentCareer, TransitionCosts, NewCareer } from '../types/inputs'

export function calculateStayYearEarnings(
  current: CurrentCareer,
  year: number
): number {
  const baseTotal =
    current.annualSalary + current.annualBenefits + current.annualRetirementContribution
  return baseTotal * Math.pow(1 + current.annualRaisePercent / 100, year - 1)
}

export function calculateTransitionCost(
  transition: TransitionCosts,
  currentAnnualSalary: number
): number {
  const incomeGapLoss = (currentAnnualSalary / 12) * transition.incomeGapMonths
  const outOfPocketEducation = transition.educationCost - transition.loan.amountFinanced
  return incomeGapLoss + outOfPocketEducation + transition.otherCosts
}

export function calculateSwitchYearEarnings(
  newCareer: NewCareer,
  year: number,
  loanAnnualPayment: number,
  hasLoanPayment: boolean
): number {
  const trajectoryEntry = newCareer.salaryTrajectory.find((e) => e.year === year)
  let salary: number

  if (trajectoryEntry) {
    salary = trajectoryEntry.salary
  } else {
    const lastTrajectory = newCareer.salaryTrajectory[newCareer.salaryTrajectory.length - 1]
    if (!lastTrajectory) {
      salary = 0
    } else {
      const yearsAfterTrajectory = year - lastTrajectory.year
      salary = lastTrajectory.salary * Math.pow(1 + newCareer.defaultRaisePercent / 100, yearsAfterTrajectory)
    }
  }

  const total = salary + newCareer.annualBenefits + newCareer.annualRetirementContribution
  return hasLoanPayment ? total - loanAnnualPayment : total
}
