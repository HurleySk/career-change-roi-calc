import type { CalculationResults } from '../types/results'

interface SummaryCardsProps {
  results: CalculationResults
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function SummaryCards({ results }: SummaryCardsProps) {
  const isPositiveROI = results.netROI >= 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* Net ROI Card */}
      <div
        className={`relative overflow-hidden rounded-xl border p-5 backdrop-blur-sm transition-all duration-500 ${
          isPositiveROI
            ? 'border-emerald-500/30 bg-emerald-950/20'
            : 'border-red-500/30 bg-red-950/20'
        }`}
      >
        <div
          className={`absolute inset-0 opacity-20 blur-2xl ${
            isPositiveROI
              ? 'bg-gradient-to-br from-emerald-500/30 to-transparent'
              : 'bg-gradient-to-br from-red-500/30 to-transparent'
          }`}
        />
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
            Net ROI
          </p>
          <p
            className={`text-3xl font-bold font-display tracking-tight ${
              isPositiveROI ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {isPositiveROI ? '+' : ''}
            {formatCurrency(results.netROI)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Over projection period
          </p>
        </div>
      </div>

      {/* Break-Even Year Card */}
      <div className="relative overflow-hidden rounded-xl border border-slate-700/40 bg-slate-800/30 p-5 backdrop-blur-sm">
        <div className="absolute inset-0 opacity-10 blur-2xl bg-gradient-to-br from-cyan-500/20 to-transparent" />
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
            Break-Even
          </p>
          <p className="text-3xl font-bold font-display tracking-tight text-slate-100">
            {results.breakEvenYear !== null ? (
              <>
                Year {results.breakEvenYear}
              </>
            ) : (
              <span className="text-slate-500">N/A</span>
            )}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {results.breakEvenYear !== null
              ? 'Switch overtakes stay'
              : 'Not reached in period'}
          </p>
        </div>
      </div>

      {/* Total Transition Cost Card */}
      <div className="relative overflow-hidden rounded-xl border border-amber-500/20 bg-amber-950/10 p-5 backdrop-blur-sm">
        <div className="absolute inset-0 opacity-10 blur-2xl bg-gradient-to-br from-amber-500/20 to-transparent" />
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
            Total Transition Cost
          </p>
          <p className="text-3xl font-bold font-display tracking-tight text-amber-400">
            {formatCurrency(results.totalTransitionCost)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Including loan interest &amp; opportunity cost
          </p>
        </div>
      </div>
    </div>
  )
}
