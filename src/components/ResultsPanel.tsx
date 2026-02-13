import type { CalculationResults } from '../types/results'
import { SummaryCards } from './SummaryCards'
import { ProjectionChart } from './ProjectionChart'

interface ResultsPanelProps {
  results: CalculationResults
}

export function ResultsPanel({ results }: ResultsPanelProps) {
  return (
    <div>
      <SummaryCards results={results} />
      <ProjectionChart results={results} />
    </div>
  )
}
