export interface YearlyProjection {
  year: number
  stayCumulative: number
  switchCumulative: number
  stayNominalCumulative: number
  switchNominalCumulative: number
  difference: number
}

export interface CalculationResults {
  netROI: number
  breakEvenYear: number | null
  totalTransitionCost: number
  yearlyProjections: YearlyProjection[]
}
