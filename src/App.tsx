import { useState, useMemo, useCallback } from 'react'
import type { CalculatorInputs } from './types/inputs'
import { DEFAULT_INPUTS } from './calculations/defaults'
import { validateInputs } from './calculations/validation'
import { useCalculation } from './hooks/useCalculation'
import { useProfiles } from './hooks/useProfiles'
import { InputPanel } from './components/InputPanel'
import { ResultsPanel } from './components/ResultsPanel'
import { ProfileManager } from './components/ProfileManager'

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>(() =>
    deepClone(DEFAULT_INPUTS),
  )

  // Stabilize the inputs reference for useMemo inside useCalculation
  const inputsJson = JSON.stringify(inputs)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableInputs = useMemo(() => inputs, [inputsJson])

  const results = useCalculation(stableInputs)
  const { profiles, save, remove, load } = useProfiles()

  const errors = useMemo(
    () => validateInputs(stableInputs),
    [stableInputs],
  )

  const handleApplyProfile = useCallback(
    (loadedInputs: CalculatorInputs) => {
      setInputs(deepClone(loadedInputs))
    },
    [],
  )

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <header className="border-b border-slate-800/60 bg-surface-950/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
                Career Change ROI Calculator
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Model the financial impact of your next career move
              </p>
            </div>
          </div>
          <div className="mt-4">
            <ProfileManager
              profiles={profiles}
              currentInputs={inputs}
              onSave={save}
              onLoad={load}
              onDelete={remove}
              onApply={handleApplyProfile}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Input Panel — Left Side */}
          <aside className="w-full lg:w-[40%] lg:flex-shrink-0">
            <div className="lg:sticky lg:top-[140px] lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto input-panel-scroll lg:pr-2">
              <InputPanel
                inputs={inputs}
                onChange={setInputs}
                errors={errors}
              />
            </div>
          </aside>

          {/* Results Panel — Right Side */}
          <section className="w-full lg:w-[60%] lg:flex-grow min-w-0">
            <div className="lg:sticky lg:top-[140px]">
              <ResultsPanel results={results} />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/40 mt-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-slate-600 text-center">
            This calculator provides estimates for educational purposes only. Consult a financial advisor for personalized advice.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
