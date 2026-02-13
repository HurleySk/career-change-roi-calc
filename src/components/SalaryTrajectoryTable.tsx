import { useCallback } from 'react'
import type { SalaryTrajectoryEntry } from '../types/inputs'

interface SalaryTrajectoryTableProps {
  entries: SalaryTrajectoryEntry[]
  onChange: (entries: SalaryTrajectoryEntry[]) => void
}

function formatCurrency(value: number): string {
  return value.toLocaleString('en-US')
}

function parseNumber(raw: string): number {
  const cleaned = raw.replace(/[^0-9.-]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

export function SalaryTrajectoryTable({
  entries,
  onChange,
}: SalaryTrajectoryTableProps) {
  const updateEntry = useCallback(
    (index: number, salary: number) => {
      const updated = entries.map((entry, i) =>
        i === index ? { ...entry, salary } : entry,
      )
      onChange(updated)
    },
    [entries, onChange],
  )

  const addRow = useCallback(() => {
    const nextYear =
      entries.length > 0 ? entries[entries.length - 1].year + 1 : 1
    const lastSalary =
      entries.length > 0 ? entries[entries.length - 1].salary : 50000
    onChange([...entries, { year: nextYear, salary: lastSalary }])
  }, [entries, onChange])

  const removeRow = useCallback(
    (index: number) => {
      if (entries.length <= 1) return
      onChange(entries.filter((_, i) => i !== index))
    },
    [entries, onChange],
  )

  return (
    <div>
      <div className="rounded-lg border border-slate-700/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/40 bg-slate-800/40">
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Year
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Salary
              </th>
              <th className="px-2 py-2 w-10" />
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr
                key={index}
                className="border-b border-slate-700/20 last:border-b-0 hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-3 py-2 text-slate-300 font-medium">
                  {entry.year}
                </td>
                <td className="px-3 py-1.5">
                  <div className="flex items-center rounded border border-slate-700/40 bg-slate-800/50 focus-within:border-cyan-500/50 transition-colors">
                    <span className="pl-2 text-slate-500 text-sm">$</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      aria-label={`Year ${entry.year} salary`}
                      value={formatCurrency(entry.salary)}
                      onChange={(e) =>
                        updateEntry(index, parseNumber(e.target.value))
                      }
                      className="w-full bg-transparent px-2 py-1.5 text-slate-100 text-sm outline-none"
                    />
                  </div>
                </td>
                <td className="px-2 py-1.5 text-center">
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    disabled={entries.length <= 1}
                    className="text-slate-600 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg leading-none"
                    title="Remove row"
                  >
                    &#x2715;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addRow}
        className="mt-2 flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <span className="text-lg leading-none">+</span>
        <span>Add Year</span>
      </button>
    </div>
  )
}
