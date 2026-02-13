export interface CurrentCareer {
  annualSalary: number
  annualBenefits: number
  annualRetirementContribution: number
  annualRaisePercent: number
}

export interface EducationLoan {
  amountFinanced: number
  interestRate: number
  termYears: number
}

export interface TransitionCosts {
  educationCost: number
  incomeGapMonths: number
  otherCosts: number
  loan: EducationLoan
}

export interface SalaryTrajectoryEntry {
  year: number
  salary: number
}

export interface NewCareer {
  salaryTrajectory: SalaryTrajectoryEntry[]
  defaultRaisePercent: number
  annualBenefits: number
  annualRetirementContribution: number
}

export interface ProjectionSettings {
  timeHorizonYears: number
  inflationRate: number
  investmentReturnRate: number
}

export interface CalculatorInputs {
  currentCareer: CurrentCareer
  transitionCosts: TransitionCosts
  newCareer: NewCareer
  projectionSettings: ProjectionSettings
}
