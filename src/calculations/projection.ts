import type { CurrentCareer, TransitionCosts, NewCareer, CalculatorInputs } from '../types/inputs'
import type { CalculationResults, YearlyProjection } from '../types/results'
import { calculateAnnualLoanPayment, calculateTotalLoanInterest } from './loan'

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

export function calculateProjection(inputs: CalculatorInputs): CalculationResults {
  const { currentCareer, transitionCosts, newCareer, projectionSettings } = inputs
  const { timeHorizonYears, inflationRate, investmentReturnRate } = projectionSettings

  const loanPayment = calculateAnnualLoanPayment(
    transitionCosts.loan.amountFinanced,
    transitionCosts.loan.interestRate,
    transitionCosts.loan.termYears
  )
  const totalLoanInterest = calculateTotalLoanInterest(
    transitionCosts.loan.amountFinanced,
    transitionCosts.loan.interestRate,
    transitionCosts.loan.termYears
  )

  const transitionCost = calculateTransitionCost(transitionCosts, currentCareer.annualSalary)

  const monthlyRetirement = currentCareer.annualRetirementContribution / 12
  const lostRetirementBase = monthlyRetirement * transitionCosts.incomeGapMonths
  const lostRetirementCompounded =
    lostRetirementBase * Math.pow(1 + investmentReturnRate / 100, timeHorizonYears)

  const totalTransitionCost = transitionCost + totalLoanInterest + lostRetirementCompounded

  const yearlyProjections: YearlyProjection[] = []
  let stayCumulativeNominal = 0
  let switchCumulativeNominal = -transitionCost
  let stayCumulativeReal = 0
  let switchCumulativeReal = -transitionCost

  let breakEvenYear: number | null = null

  for (let year = 1; year <= timeHorizonYears; year++) {
    const discountFactor = Math.pow(1 + inflationRate / 100, year)

    const stayNominal = calculateStayYearEarnings(currentCareer, year)
    const hasLoan = year <= transitionCosts.loan.termYears
    const switchNominal = calculateSwitchYearEarnings(newCareer, year, loanPayment, hasLoan)

    stayCumulativeNominal += stayNominal
    switchCumulativeNominal += switchNominal

    stayCumulativeReal += stayNominal / discountFactor
    switchCumulativeReal += switchNominal / discountFactor

    const difference = switchCumulativeReal - stayCumulativeReal

    if (breakEvenYear === null && difference >= 0) {
      breakEvenYear = year
    }

    yearlyProjections.push({
      year,
      stayCumulative: stayCumulativeReal,
      switchCumulative: switchCumulativeReal,
      stayNominalCumulative: stayCumulativeNominal,
      switchNominalCumulative: switchCumulativeNominal,
      difference,
    })
  }

  return {
    netROI: yearlyProjections[yearlyProjections.length - 1]?.difference ?? 0,
    breakEvenYear,
    totalTransitionCost,
    yearlyProjections,
  }
}
