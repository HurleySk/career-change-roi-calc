import type { CalculationResults } from '../types/results'
import { SummaryCards } from './SummaryCards'

interface ResultsPanelProps {
  results: CalculationResults
}

export function ResultsPanel({ results }: ResultsPanelProps) {
  return (
    <div>
      <SummaryCards results={results} />
      <div className="rounded-xl border border-slate-700/40 bg-slate-800/20 p-6 backdrop-blur-sm min-h-[400px] flex items-center justify-center">
        <p className="text-slate-500 text-sm">Chart coming soon</p>
      </div>
    </div>
  )
}
