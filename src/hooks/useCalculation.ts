import { useMemo } from 'react'
import type { CalculatorInputs } from '../types/inputs'
import type { CalculationResults } from '../types/results'
import { calculateProjection } from '../calculations/projection'

export function useCalculation(inputs: CalculatorInputs): CalculationResults {
  return useMemo(() => calculateProjection(inputs), [inputs])
}
