import type { ProjectionSettings } from '../types/inputs'
import type { ValidationError } from '../calculations/validation'
import { NumberInput } from './NumberInput'
import { CollapsibleSection } from './CollapsibleSection'
import { useCallback } from 'react'

interface ProjectionSettingsInputsProps {
  values: ProjectionSettings
  onChange: (values: ProjectionSettings) => void
  errors: ValidationError[]
}

export function ProjectionSettingsInputs({
  values,
  onChange,
  errors,
}: ProjectionSettingsInputsProps) {
  const getError = useCallback(
    (field: string) =>
      errors.find((e) => e.field === `projectionSettings.${field}`)?.message,
    [errors],
  )

  const update = useCallback(
    <K extends keyof ProjectionSettings>(
      key: K,
      value: ProjectionSettings[K],
    ) => {
      onChange({ ...values, [key]: value })
    },
    [values, onChange],
  )

  return (
    <CollapsibleSection
      title="Projection Settings"
      accentColor="border-violet-500"
    >
      <div className="mb-3">
        <label
          htmlFor="time-horizon"
          className="block text-sm font-medium text-slate-300 mb-1"
        >
          Time Horizon
        </label>
        <div className="flex items-center gap-3">
          <input
            id="time-horizon"
            type="range"
            min={1}
            max={30}
            step={1}
            value={values.timeHorizonYears}
            onChange={(e) =>
              update('timeHorizonYears', parseInt(e.target.value, 10))
            }
            className="flex-1 h-1.5 rounded-full appearance-none bg-slate-700 accent-cyan-500 cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(6,182,212,0.4)] [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-400 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          />
          <span className="min-w-[4rem] text-center text-sm font-medium text-slate-200 bg-slate-800/60 border border-slate-700/40 rounded px-2 py-1.5">
            {values.timeHorizonYears} yr{values.timeHorizonYears !== 1 ? 's' : ''}
          </span>
        </div>
        {getError('timeHorizonYears') && (
          <p className="mt-1 text-xs text-red-400">
            {getError('timeHorizonYears')}
          </p>
        )}
      </div>

      <NumberInput
        label="Inflation Rate"
        value={values.inflationRate}
        onChange={(v) => update('inflationRate', v)}
        suffix="%"
        error={getError('inflationRate')}
      />
      <NumberInput
        label="Investment Return Rate"
        value={values.investmentReturnRate}
        onChange={(v) => update('investmentReturnRate', v)}
        suffix="%"
        error={getError('investmentReturnRate')}
      />
    </CollapsibleSection>
  )
}
