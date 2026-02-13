import { useCallback, useState } from 'react'

interface NumberInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  prefix?: string
  suffix?: string
  error?: string
  min?: number
  max?: number
  step?: number
  id?: string
}

function formatWithCommas(value: number): string {
  return value.toLocaleString('en-US')
}

function parseNumericInput(raw: string): number {
  const cleaned = raw.replace(/[^0-9.-]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

export function NumberInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  error,
  min,
  max,
  step,
  id,
}: NumberInputProps) {
  const [focused, setFocused] = useState(false)
  const [rawValue, setRawValue] = useState('')

  const displayValue = focused ? rawValue : formatWithCommas(value)

  const handleFocus = useCallback(() => {
    setFocused(true)
    setRawValue(String(value))
  }, [value])

  const handleBlur = useCallback(() => {
    setFocused(false)
    let parsed = parseNumericInput(rawValue)
    if (min !== undefined) parsed = Math.max(min, parsed)
    if (max !== undefined) parsed = Math.min(max, parsed)
    onChange(parsed)
  }, [rawValue, onChange, min, max])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      setRawValue(raw)
      const parsed = parseNumericInput(raw)
      onChange(parsed)
    },
    [onChange],
  )

  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="mb-3">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-slate-300 mb-1"
      >
        {label}
      </label>
      <div
        className={`flex items-center rounded-lg border transition-all duration-200 ${
          error
            ? 'border-red-500/60 bg-red-950/20'
            : focused
              ? 'border-cyan-500/50 bg-slate-800/80 shadow-[0_0_12px_rgba(6,182,212,0.1)]'
              : 'border-slate-700/50 bg-slate-800/50 hover:border-slate-600/60'
        }`}
      >
        {prefix && (
          <span className="pl-3 text-slate-500 text-sm select-none">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          className="w-full bg-transparent px-3 py-2.5 text-slate-100 text-sm outline-none placeholder-slate-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {suffix && (
          <span className="pr-3 text-slate-500 text-sm select-none">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400" role="alert">{error}</p>
      )}
    </div>
  )
}
