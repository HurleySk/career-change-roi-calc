import type { CalculatorInputs } from '../types/inputs'

export interface ValidationError {
  field: string
  message: string
}

export function validateInputs(inputs: CalculatorInputs): ValidationError[] {
  const errors: ValidationError[] = []

  if (inputs.currentCareer.annualSalary < 0) {
    errors.push({ field: 'currentCareer.annualSalary', message: 'Salary must be >= 0' })
  }
  if (inputs.currentCareer.annualBenefits < 0) {
    errors.push({ field: 'currentCareer.annualBenefits', message: 'Benefits must be >= 0' })
  }
  if (inputs.currentCareer.annualRetirementContribution < 0) {
    errors.push({ field: 'currentCareer.annualRetirementContribution', message: 'Retirement contribution must be >= 0' })
  }

  if (inputs.transitionCosts.educationCost < 0) {
    errors.push({ field: 'transitionCosts.educationCost', message: 'Education cost must be >= 0' })
  }
  if (inputs.transitionCosts.incomeGapMonths < 0) {
    errors.push({ field: 'transitionCosts.incomeGapMonths', message: 'Income gap must be >= 0' })
  }
  if (inputs.transitionCosts.loan.interestRate < 0 || inputs.transitionCosts.loan.interestRate > 100) {
    errors.push({ field: 'transitionCosts.loan.interestRate', message: 'Interest rate must be 0-100%' })
  }

  if (inputs.projectionSettings.timeHorizonYears < 1 || inputs.projectionSettings.timeHorizonYears > 30) {
    errors.push({ field: 'projectionSettings.timeHorizonYears', message: 'Time horizon must be 1-30 years' })
  }

  for (const entry of inputs.newCareer.salaryTrajectory) {
    if (entry.salary < 0) {
      errors.push({ field: `newCareer.salaryTrajectory.year${entry.year}`, message: `Year ${entry.year} salary must be >= 0` })
    }
  }

  return errors
}
