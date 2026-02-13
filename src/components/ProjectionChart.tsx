import { useState, useMemo } from 'react'
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts'
import type { CalculationResults } from '../types/results'

interface ProjectionChartProps {
  results: CalculationResults
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function formatYAxis(value: number): string {
  const absValue = Math.abs(value)
  if (absValue >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  if (absValue >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}k`
  }
  return `$${value}`
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string | number
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-lg border border-slate-600/50 bg-slate-900/90 backdrop-blur-md px-4 py-3 shadow-xl">
      <p className="text-xs font-medium text-slate-400 mb-2">Year {label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1 last:mb-0">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-slate-300">{entry.name}:</span>
          <span className="text-xs font-semibold text-slate-100 ml-auto">
            {currencyFormatter.format(entry.value)}
          </span>
        </div>
      ))}
      {payload.length >= 2 && (
        <div className="mt-2 pt-2 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Difference:</span>
            <span
              className={`text-xs font-semibold ${
                payload[0].value - payload[1].value >= 0
                  ? 'text-emerald-400'
                  : 'text-red-400'
              }`}
            >
              {currencyFormatter.format(payload[0].value - payload[1].value)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

interface CustomLegendProps {
  payload?: Array<{ value: string; color: string }>
}

function CustomLegendContent({ payload }: CustomLegendProps) {
  if (!payload) return null
  return (
    <div className="flex items-center justify-center gap-6 mt-2">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-2">
          <span
            className="w-3 h-0.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-slate-400">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export function ProjectionChart({ results }: ProjectionChartProps) {
  const [showNominal, setShowNominal] = useState(false)

  const chartData = useMemo(() => {
    return results.yearlyProjections.map((proj) => ({
      year: proj.year,
      switch: showNominal ? proj.switchNominalCumulative : proj.switchCumulative,
      stay: showNominal ? proj.stayNominalCumulative : proj.stayCumulative,
    }))
  }, [results.yearlyProjections, showNominal])

  const breakEvenPoint = useMemo(() => {
    if (results.breakEvenYear === null) return null
    const proj = results.yearlyProjections.find(
      (p) => p.year === results.breakEvenYear,
    )
    if (!proj) return null
    return {
      year: proj.year,
      value: showNominal ? proj.switchNominalCumulative : proj.switchCumulative,
    }
  }, [results.breakEvenYear, results.yearlyProjections, showNominal])

  return (
    <div className="rounded-xl border border-slate-700/40 bg-slate-800/20 p-4 sm:p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-slate-200">
          Cumulative Earnings Projection
        </h3>
        <div className="flex items-center gap-1 rounded-lg bg-slate-800/60 border border-slate-700/40 p-0.5">
          <button
            type="button"
            onClick={() => setShowNominal(false)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
              !showNominal
                ? 'bg-cyan-500/20 text-cyan-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Real
          </button>
          <button
            type="button"
            onClick={() => setShowNominal(true)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
              showNominal
                ? 'bg-cyan-500/20 text-cyan-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Nominal
          </button>
        </div>
      </div>

      <div className="w-full h-[350px] sm:h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradSwitch" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradStay" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#64748b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 6"
              stroke="#334155"
              strokeOpacity={0.4}
              vertical={false}
            />

            <XAxis
              dataKey="year"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickFormatter={(v: number) => `Yr ${v}`}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickFormatter={formatYAxis}
              width={60}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegendContent />} />

            <Area
              type="monotone"
              dataKey="switch"
              name="Career Switch"
              fill="url(#gradSwitch)"
              stroke="none"
              animationDuration={800}
              animationEasing="ease-in-out"
            />
            <Area
              type="monotone"
              dataKey="stay"
              name="Stay Put"
              fill="url(#gradStay)"
              stroke="none"
              animationDuration={800}
              animationEasing="ease-in-out"
            />

            <Line
              type="monotone"
              dataKey="switch"
              name="Career Switch"
              stroke="#06b6d4"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                fill: '#06b6d4',
                stroke: '#0e1729',
                strokeWidth: 2,
              }}
              animationDuration={800}
              animationEasing="ease-in-out"
            />
            <Line
              type="monotone"
              dataKey="stay"
              name="Stay Put"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={false}
              activeDot={{
                r: 5,
                fill: '#94a3b8',
                stroke: '#0e1729',
                strokeWidth: 2,
              }}
              animationDuration={800}
              animationEasing="ease-in-out"
            />

            {breakEvenPoint && (
              <ReferenceDot
                x={breakEvenPoint.year}
                y={breakEvenPoint.value}
                r={6}
                fill="#10b981"
                stroke="#0e1729"
                strokeWidth={2}
                label={{
                  value: `Break-even: Year ${breakEvenPoint.year}`,
                  position: 'top',
                  fill: '#10b981',
                  fontSize: 11,
                  fontWeight: 600,
                  offset: 12,
                }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
