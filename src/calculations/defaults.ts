import type { CalculatorInputs } from '../types/inputs'

export const DEFAULT_INPUTS: CalculatorInputs = {
  currentCareer: {
    annualSalary: 75000,
    annualBenefits: 12000,
    annualRetirementContribution: 4500,
    annualRaisePercent: 3,
  },
  transitionCosts: {
    educationCost: 30000,
    incomeGapMonths: 6,
    otherCosts: 2000,
    loan: {
      amountFinanced: 25000,
      interestRate: 6.5,
      termYears: 10,
    },
  },
  newCareer: {
    salaryTrajectory: [
      { year: 1, salary: 55000 },
      { year: 2, salary: 65000 },
      { year: 3, salary: 78000 },
    ],
    defaultRaisePercent: 3,
    annualBenefits: 14000,
    annualRetirementContribution: 5000,
  },
  projectionSettings: {
    timeHorizonYears: 10,
    inflationRate: 3,
    investmentReturnRate: 7,
  },
}
