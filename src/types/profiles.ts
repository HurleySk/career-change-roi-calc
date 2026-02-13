import type { CalculatorInputs } from './inputs'

export interface SavedProfile {
  id: string
  name: string
  inputs: CalculatorInputs
  savedAt: string
}
