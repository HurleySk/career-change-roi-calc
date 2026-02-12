# Career Change ROI Calculator — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a client-side React calculator that projects the financial impact of a career change over a configurable time horizon.

**Architecture:** Single-page reactive app — inputs on the left, live-updating chart + summary on the right. Calculation engine is pure TypeScript functions, fully decoupled from UI. Profiles saved to localStorage.

**Tech Stack:** React 18, TypeScript, Vite, Recharts, Tailwind CSS, Vitest

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`

**Step 1: Scaffold Vite + React + TypeScript project**

Run:
```bash
npm create vite@latest . -- --template react-ts
```

Select "Ignore files and continue" if prompted about existing files.

**Step 2: Install dependencies**

Run:
```bash
npm install recharts
npm install -D tailwindcss @tailwindcss/vite vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Step 3: Configure Tailwind**

Add Tailwind Vite plugin to `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Replace contents of `src/index.css` with:

```css
@import "tailwindcss";
```

**Step 4: Configure Vitest**

Add to `vite.config.ts`:

```ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
})
```

Create `src/test-setup.ts`:

```ts
import '@testing-library/jest-dom'
```

Add to `tsconfig.app.json` compilerOptions:

```json
"types": ["vitest/globals"]
```

Add test script to `package.json`:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

**Step 5: Verify setup**

Run:
```bash
npm run dev
```

Expected: Vite dev server starts, page loads at localhost:5173.

Run:
```bash
npm run build
```

Expected: Build succeeds with no errors.

**Step 6: Clean up boilerplate**

- Replace `src/App.tsx` with a minimal component:

```tsx
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold p-8">Career Change ROI Calculator</h1>
    </div>
  )
}

export default App
```

- Delete `src/App.css` and remove its import from `App.tsx` (if present).
- Delete `src/assets/` directory.

**Step 7: Verify Tailwind is working**

Run `npm run dev`, confirm the h1 renders with bold styling and gray background.

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold project with Vite, React, TypeScript, Tailwind, Vitest"
```

---

### Task 2: TypeScript Types

**Files:**
- Create: `src/types/inputs.ts`
- Create: `src/types/results.ts`
- Create: `src/types/profiles.ts`

**Step 1: Define input types**

Create `src/types/inputs.ts`:

```ts
export interface CurrentCareer {
  annualSalary: number
  annualBenefits: number
  annualRetirementContribution: number
  annualRaisePercent: number
}

export interface EducationLoan {
  amountFinanced: number
  interestRate: number
  termYears: number
}

export interface TransitionCosts {
  educationCost: number
  incomeGapMonths: number
  otherCosts: number
  loan: EducationLoan
}

export interface SalaryTrajectoryEntry {
  year: number
  salary: number
}

export interface NewCareer {
  salaryTrajectory: SalaryTrajectoryEntry[]
  defaultRaisePercent: number
  annualBenefits: number
  annualRetirementContribution: number
}

export interface ProjectionSettings {
  timeHorizonYears: number
  inflationRate: number
  investmentReturnRate: number
}

export interface CalculatorInputs {
  currentCareer: CurrentCareer
  transitionCosts: TransitionCosts
  newCareer: NewCareer
  projectionSettings: ProjectionSettings
}
```

**Step 2: Define result types**

Create `src/types/results.ts`:

```ts
export interface YearlyProjection {
  year: number
  stayCumulative: number
  switchCumulative: number
  stayNominalCumulative: number
  switchNominalCumulative: number
  difference: number
}

export interface CalculationResults {
  netROI: number
  breakEvenYear: number | null
  totalTransitionCost: number
  yearlyProjections: YearlyProjection[]
}
```

**Step 3: Define profile types**

Create `src/types/profiles.ts`:

```ts
import { CalculatorInputs } from './inputs'

export interface SavedProfile {
  id: string
  name: string
  inputs: CalculatorInputs
  savedAt: string
}
```

**Step 4: Commit**

```bash
git add src/types/
git commit -m "feat: add TypeScript type definitions for inputs, results, and profiles"
```

---

### Task 3: Default Values

**Files:**
- Create: `src/calculations/defaults.ts`
- Test: `src/calculations/__tests__/defaults.test.ts`

**Step 1: Write the test**

Create `src/calculations/__tests__/defaults.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { DEFAULT_INPUTS } from '../defaults'

describe('DEFAULT_INPUTS', () => {
  it('has valid current career defaults', () => {
    expect(DEFAULT_INPUTS.currentCareer.annualSalary).toBe(75000)
    expect(DEFAULT_INPUTS.currentCareer.annualRaisePercent).toBe(3)
  })

  it('has valid transition cost defaults', () => {
    expect(DEFAULT_INPUTS.transitionCosts.educationCost).toBe(30000)
    expect(DEFAULT_INPUTS.transitionCosts.loan.interestRate).toBe(6.5)
  })

  it('has valid projection settings defaults', () => {
    expect(DEFAULT_INPUTS.projectionSettings.timeHorizonYears).toBe(10)
    expect(DEFAULT_INPUTS.projectionSettings.inflationRate).toBe(3)
    expect(DEFAULT_INPUTS.projectionSettings.investmentReturnRate).toBe(7)
  })

  it('has a salary trajectory with at least one entry', () => {
    expect(DEFAULT_INPUTS.newCareer.salaryTrajectory.length).toBeGreaterThan(0)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/calculations/__tests__/defaults.test.ts`
Expected: FAIL — module not found.

**Step 3: Implement defaults**

Create `src/calculations/defaults.ts`:

```ts
import { CalculatorInputs } from '../types/inputs'

export const DEFAULT_INPUTS: CalculatorInputs = {
  currentCareer: {
    annualSalary: 75000,
    annualBenefits: 12000,
    annualRetirementContribution: 4500,
    annualRaisePercent: 3,
  },
  transitionCosts: {
    educationCost: 30000,
    incomeGapMonths: 6,
    otherCosts: 2000,
    loan: {
      amountFinanced: 25000,
      interestRate: 6.5,
      termYears: 10,
    },
  },
  newCareer: {
    salaryTrajectory: [
      { year: 1, salary: 55000 },
      { year: 2, salary: 65000 },
      { year: 3, salary: 78000 },
    ],
    defaultRaisePercent: 3,
    annualBenefits: 14000,
    annualRetirementContribution: 5000,
  },
  projectionSettings: {
    timeHorizonYears: 10,
    inflationRate: 3,
    investmentReturnRate: 7,
  },
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/calculations/__tests__/defaults.test.ts`
Expected: PASS — all tests green.

**Step 5: Commit**

```bash
git add src/calculations/
git commit -m "feat: add default input values with tests"
```

---

### Task 4: Loan Amortization Calculator

**Files:**
- Create: `src/calculations/loan.ts`
- Test: `src/calculations/__tests__/loan.test.ts`

**Step 1: Write the tests**

Create `src/calculations/__tests__/loan.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { calculateAnnualLoanPayment, calculateTotalLoanInterest } from '../loan'

describe('calculateAnnualLoanPayment', () => {
  it('returns 0 when amount is 0', () => {
    expect(calculateAnnualLoanPayment(0, 6.5, 10)).toBe(0)
  })

  it('returns 0 when term is 0', () => {
    expect(calculateAnnualLoanPayment(25000, 6.5, 0)).toBe(0)
  })

  it('calculates correct annual payment for a standard loan', () => {
    // $25,000 at 6.5% over 10 years
    const annual = calculateAnnualLoanPayment(25000, 6.5, 10)
    // Monthly payment ~$284.03, annual ~$3408.36
    expect(annual).toBeCloseTo(3408.36, 0)
  })

  it('handles 0% interest rate', () => {
    const annual = calculateAnnualLoanPayment(25000, 0, 10)
    expect(annual).toBeCloseTo(2500, 0)
  })
})

describe('calculateTotalLoanInterest', () => {
  it('returns 0 when amount is 0', () => {
    expect(calculateTotalLoanInterest(0, 6.5, 10)).toBe(0)
  })

  it('calculates total interest paid over loan term', () => {
    const interest = calculateTotalLoanInterest(25000, 6.5, 10)
    // Total paid ~$34,083.60 - principal $25,000 = ~$9,083.60
    expect(interest).toBeCloseTo(9083.60, -1)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/calculations/__tests__/loan.test.ts`
Expected: FAIL — module not found.

**Step 3: Implement loan calculations**

Create `src/calculations/loan.ts`:

```ts
export function calculateAnnualLoanPayment(
  principal: number,
  annualRatePercent: number,
  termYears: number
): number {
  if (principal <= 0 || termYears <= 0) return 0

  if (annualRatePercent === 0) {
    return principal / termYears
  }

  const monthlyRate = annualRatePercent / 100 / 12
  const numPayments = termYears * 12
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)

  return monthlyPayment * 12
}

export function calculateTotalLoanInterest(
  principal: number,
  annualRatePercent: number,
  termYears: number
): number {
  if (principal <= 0 || termYears <= 0) return 0

  const totalPaid = calculateAnnualLoanPayment(principal, annualRatePercent, termYears) * termYears
  return totalPaid - principal
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/calculations/__tests__/loan.test.ts`
Expected: PASS — all tests green.

**Step 5: Commit**

```bash
git add src/calculations/loan.ts src/calculations/__tests__/loan.test.ts
git commit -m "feat: add loan amortization calculator with tests"
```

---

### Task 5: Projection Engine — "Stay" Scenario

**Files:**
- Create: `src/calculations/projection.ts`
- Test: `src/calculations/__tests__/projection.test.ts`

**Step 1: Write the tests for "stay" scenario**

Create `src/calculations/__tests__/projection.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { calculateStayYearEarnings } from '../projection'

describe('calculateStayYearEarnings', () => {
  const currentCareer = {
    annualSalary: 75000,
    annualBenefits: 12000,
    annualRetirementContribution: 4500,
    annualRaisePercent: 3,
  }

  it('returns base total for year 1', () => {
    const result = calculateStayYearEarnings(currentCareer, 1)
    // 75000 + 12000 + 4500 = 91500
    expect(result).toBeCloseTo(91500, 0)
  })

  it('applies raise for year 2', () => {
    const result = calculateStayYearEarnings(currentCareer, 2)
    // 91500 * 1.03 = 94245
    expect(result).toBeCloseTo(94245, 0)
  })

  it('compounds raises for year 5', () => {
    const result = calculateStayYearEarnings(currentCareer, 5)
    // 91500 * 1.03^4
    expect(result).toBeCloseTo(91500 * Math.pow(1.03, 4), 0)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/calculations/__tests__/projection.test.ts`
Expected: FAIL — module not found.

**Step 3: Implement stay scenario**

Create `src/calculations/projection.ts`:

```ts
import { CurrentCareer } from '../types/inputs'

export function calculateStayYearEarnings(
  current: CurrentCareer,
  year: number
): number {
  const baseTotal =
    current.annualSalary + current.annualBenefits + current.annualRetirementContribution
  return baseTotal * Math.pow(1 + current.annualRaisePercent / 100, year - 1)
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/calculations/__tests__/projection.test.ts`
Expected: PASS — all tests green.

**Step 5: Commit**

```bash
git add src/calculations/projection.ts src/calculations/__tests__/projection.test.ts
git commit -m "feat: add stay scenario projection calculation"
```

---

### Task 6: Projection Engine — "Switch" Scenario

**Files:**
- Modify: `src/calculations/projection.ts`
- Modify: `src/calculations/__tests__/projection.test.ts`

**Step 1: Write the tests for "switch" scenario**

Append to `src/calculations/__tests__/projection.test.ts`:

```ts
import { calculateSwitchYearEarnings, calculateTransitionCost } from '../projection'

describe('calculateTransitionCost', () => {
  it('calculates total year-0 cost', () => {
    const result = calculateTransitionCost(
      { educationCost: 30000, incomeGapMonths: 6, otherCosts: 2000, loan: { amountFinanced: 25000, interestRate: 6.5, termYears: 10 } },
      75000 // current salary to calculate gap income loss
    )
    // Income gap: 75000/12 * 6 = 37500
    // Out of pocket education: 30000 - 25000 = 5000
    // Other: 2000
    // Total: 37500 + 5000 + 2000 = 44500
    expect(result).toBeCloseTo(44500, 0)
  })
})

describe('calculateSwitchYearEarnings', () => {
  const newCareer = {
    salaryTrajectory: [
      { year: 1, salary: 55000 },
      { year: 2, salary: 65000 },
      { year: 3, salary: 78000 },
    ],
    defaultRaisePercent: 3,
    annualBenefits: 14000,
    annualRetirementContribution: 5000,
  }
  const loanAnnualPayment = 3408.36

  it('uses trajectory salary for year 1', () => {
    const result = calculateSwitchYearEarnings(newCareer, 1, loanAnnualPayment, true)
    // 55000 + 14000 + 5000 - 3408.36 = 70591.64
    expect(result).toBeCloseTo(70591.64, 0)
  })

  it('uses trajectory salary for year 3', () => {
    const result = calculateSwitchYearEarnings(newCareer, 3, loanAnnualPayment, true)
    // 78000 + 14000 + 5000 - 3408.36 = 93591.64
    expect(result).toBeCloseTo(93591.64, 0)
  })

  it('applies default raise after trajectory ends', () => {
    const result = calculateSwitchYearEarnings(newCareer, 4, loanAnnualPayment, true)
    // Year 4: last trajectory salary 78000 * 1.03 = 80340 + 14000 + 5000 - 3408.36
    expect(result).toBeCloseTo(80340 + 14000 + 5000 - 3408.36, 0)
  })

  it('excludes loan payment after loan term ends', () => {
    const result = calculateSwitchYearEarnings(newCareer, 5, loanAnnualPayment, false)
    // Year 5: 78000 * 1.03^2 + 14000 + 5000 (no loan payment)
    const salary = 78000 * Math.pow(1.03, 2)
    expect(result).toBeCloseTo(salary + 14000 + 5000, 0)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/calculations/__tests__/projection.test.ts`
Expected: FAIL — functions not exported.

**Step 3: Implement switch scenario**

Add to `src/calculations/projection.ts`:

```ts
import { CurrentCareer, TransitionCosts, NewCareer } from '../types/inputs'

export function calculateTransitionCost(
  transition: TransitionCosts,
  currentAnnualSalary: number
): number {
  const incomeGapLoss = (currentAnnualSalary / 12) * transition.incomeGapMonths
  const outOfPocketEducation = transition.educationCost - transition.loan.amountFinanced
  return incomeGapLoss + outOfPocketEducation + transition.otherCosts
}

export function calculateSwitchYearEarnings(
  newCareer: NewCareer,
  year: number,
  loanAnnualPayment: number,
  hasLoanPayment: boolean
): number {
  const trajectoryEntry = newCareer.salaryTrajectory.find((e) => e.year === year)
  let salary: number

  if (trajectoryEntry) {
    salary = trajectoryEntry.salary
  } else {
    const lastTrajectory = newCareer.salaryTrajectory[newCareer.salaryTrajectory.length - 1]
    if (!lastTrajectory) {
      salary = 0
    } else {
      const yearsAfterTrajectory = year - lastTrajectory.year
      salary = lastTrajectory.salary * Math.pow(1 + newCareer.defaultRaisePercent / 100, yearsAfterTrajectory)
    }
  }

  const total = salary + newCareer.annualBenefits + newCareer.annualRetirementContribution
  return hasLoanPayment ? total - loanAnnualPayment : total
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/calculations/__tests__/projection.test.ts`
Expected: PASS — all tests green.

**Step 5: Commit**

```bash
git add src/calculations/projection.ts src/calculations/__tests__/projection.test.ts
git commit -m "feat: add switch scenario and transition cost calculations"
```

---

### Task 7: Full Projection Engine — Combining Scenarios

**Files:**
- Modify: `src/calculations/projection.ts`
- Modify: `src/calculations/__tests__/projection.test.ts`

**Step 1: Write the test for full projection**

Append to `src/calculations/__tests__/projection.test.ts`:

```ts
import { calculateProjection } from '../projection'
import { DEFAULT_INPUTS } from '../defaults'

describe('calculateProjection', () => {
  it('returns correct number of yearly projections', () => {
    const result = calculateProjection(DEFAULT_INPUTS)
    expect(result.yearlyProjections).toHaveLength(DEFAULT_INPUTS.projectionSettings.timeHorizonYears)
  })

  it('year 1 stay cumulative is positive', () => {
    const result = calculateProjection(DEFAULT_INPUTS)
    expect(result.yearlyProjections[0].stayCumulative).toBeGreaterThan(0)
  })

  it('year 1 switch cumulative is negative (transition costs)', () => {
    const result = calculateProjection(DEFAULT_INPUTS)
    // Switch starts negative due to transition costs in year 0
    expect(result.yearlyProjections[0].switchCumulative).toBeLessThan(
      result.yearlyProjections[0].stayCumulative
    )
  })

  it('calculates totalTransitionCost including loan interest', () => {
    const result = calculateProjection(DEFAULT_INPUTS)
    expect(result.totalTransitionCost).toBeGreaterThan(0)
  })

  it('returns null breakEvenYear when new career never catches up', () => {
    const inputs = {
      ...DEFAULT_INPUTS,
      newCareer: {
        ...DEFAULT_INPUTS.newCareer,
        salaryTrajectory: [{ year: 1, salary: 30000 }],
        defaultRaisePercent: 1,
      },
      projectionSettings: { ...DEFAULT_INPUTS.projectionSettings, timeHorizonYears: 5 },
    }
    const result = calculateProjection(inputs)
    expect(result.breakEvenYear).toBeNull()
  })

  it('provides both nominal and real cumulative values', () => {
    const result = calculateProjection(DEFAULT_INPUTS)
    const year1 = result.yearlyProjections[0]
    // Nominal should be >= real (inflation discounting reduces real values)
    expect(year1.stayNominalCumulative).toBeGreaterThanOrEqual(year1.stayCumulative)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/calculations/__tests__/projection.test.ts`
Expected: FAIL — `calculateProjection` not found.

**Step 3: Implement full projection**

Add to `src/calculations/projection.ts`:

```ts
import { CalculatorInputs } from '../types/inputs'
import { CalculationResults, YearlyProjection } from '../types/results'
import { calculateAnnualLoanPayment, calculateTotalLoanInterest } from './loan'

export function calculateProjection(inputs: CalculatorInputs): CalculationResults {
  const { currentCareer, transitionCosts, newCareer, projectionSettings } = inputs
  const { timeHorizonYears, inflationRate, investmentReturnRate } = projectionSettings

  const loanPayment = calculateAnnualLoanPayment(
    transitionCosts.loan.amountFinanced,
    transitionCosts.loan.interestRate,
    transitionCosts.loan.termYears
  )
  const totalLoanInterest = calculateTotalLoanInterest(
    transitionCosts.loan.amountFinanced,
    transitionCosts.loan.interestRate,
    transitionCosts.loan.termYears
  )

  const transitionCost = calculateTransitionCost(transitionCosts, currentCareer.annualSalary)

  // Lost retirement: employer contributions during gap, compounded
  const monthlyRetirement = currentCareer.annualRetirementContribution / 12
  const lostRetirementBase = monthlyRetirement * transitionCosts.incomeGapMonths
  const lostRetirementCompounded =
    lostRetirementBase * Math.pow(1 + investmentReturnRate / 100, timeHorizonYears)

  const totalTransitionCost = transitionCost + totalLoanInterest + lostRetirementCompounded

  const yearlyProjections: YearlyProjection[] = []
  let stayCumulativeNominal = 0
  let switchCumulativeNominal = -transitionCost // starts negative
  let stayCumulativeReal = 0
  let switchCumulativeReal = -transitionCost

  let breakEvenYear: number | null = null

  for (let year = 1; year <= timeHorizonYears; year++) {
    const discountFactor = Math.pow(1 + inflationRate / 100, year)

    const stayNominal = calculateStayYearEarnings(currentCareer, year)
    const hasLoan = year <= transitionCosts.loan.termYears
    const switchNominal = calculateSwitchYearEarnings(newCareer, year, loanPayment, hasLoan)

    stayCumulativeNominal += stayNominal
    switchCumulativeNominal += switchNominal

    stayCumulativeReal += stayNominal / discountFactor
    switchCumulativeReal += switchNominal / discountFactor

    const difference = switchCumulativeReal - stayCumulativeReal

    if (breakEvenYear === null && difference >= 0) {
      breakEvenYear = year
    }

    yearlyProjections.push({
      year,
      stayCumulative: stayCumulativeReal,
      switchCumulative: switchCumulativeReal,
      stayNominalCumulative: stayCumulativeNominal,
      switchNominalCumulative: switchCumulativeNominal,
      difference,
    })
  }

  return {
    netROI: yearlyProjections[yearlyProjections.length - 1]?.difference ?? 0,
    breakEvenYear,
    totalTransitionCost,
    yearlyProjections,
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/calculations/__tests__/projection.test.ts`
Expected: PASS — all tests green.

**Step 5: Commit**

```bash
git add src/calculations/projection.ts src/calculations/__tests__/projection.test.ts
git commit -m "feat: add full projection engine combining stay and switch scenarios"
```

---

### Task 8: useCalculation Hook

**Files:**
- Create: `src/hooks/useCalculation.ts`

**Step 1: Implement the hook**

Create `src/hooks/useCalculation.ts`:

```ts
import { useMemo } from 'react'
import { CalculatorInputs } from '../types/inputs'
import { CalculationResults } from '../types/results'
import { calculateProjection } from '../calculations/projection'

export function useCalculation(inputs: CalculatorInputs): CalculationResults {
  return useMemo(() => calculateProjection(inputs), [inputs])
}
```

**Step 2: Commit**

```bash
git add src/hooks/useCalculation.ts
git commit -m "feat: add useCalculation hook"
```

---

### Task 9: useProfiles Hook

**Files:**
- Create: `src/hooks/useProfiles.ts`
- Test: `src/hooks/__tests__/useProfiles.test.ts`

**Step 1: Write the test**

Create `src/hooks/__tests__/useProfiles.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { loadProfiles, saveProfile, deleteProfile } from '../useProfiles'
import { DEFAULT_INPUTS } from '../../calculations/defaults'

beforeEach(() => {
  localStorage.clear()
})

describe('profile persistence', () => {
  it('returns empty array when no profiles saved', () => {
    expect(loadProfiles()).toEqual([])
  })

  it('saves and loads a profile', () => {
    saveProfile('Test Profile', DEFAULT_INPUTS)
    const profiles = loadProfiles()
    expect(profiles).toHaveLength(1)
    expect(profiles[0].name).toBe('Test Profile')
    expect(profiles[0].inputs).toEqual(DEFAULT_INPUTS)
  })

  it('deletes a profile', () => {
    saveProfile('To Delete', DEFAULT_INPUTS)
    const profiles = loadProfiles()
    deleteProfile(profiles[0].id)
    expect(loadProfiles()).toHaveLength(0)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/__tests__/useProfiles.test.ts`
Expected: FAIL — module not found.

**Step 3: Implement profile persistence**

Create `src/hooks/useProfiles.ts`:

```ts
import { useState, useCallback } from 'react'
import { CalculatorInputs } from '../types/inputs'
import { SavedProfile } from '../types/profiles'

const STORAGE_KEY = 'career-roi-profiles'

export function loadProfiles(): SavedProfile[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveProfile(name: string, inputs: CalculatorInputs): SavedProfile {
  const profiles = loadProfiles()
  const profile: SavedProfile = {
    id: crypto.randomUUID(),
    name,
    inputs,
    savedAt: new Date().toISOString(),
  }
  profiles.push(profile)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
  return profile
}

export function deleteProfile(id: string): void {
  const profiles = loadProfiles().filter((p) => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<SavedProfile[]>(loadProfiles)

  const save = useCallback((name: string, inputs: CalculatorInputs) => {
    const profile = saveProfile(name, inputs)
    setProfiles(loadProfiles())
    return profile
  }, [])

  const remove = useCallback((id: string) => {
    deleteProfile(id)
    setProfiles(loadProfiles())
  }, [])

  const load = useCallback((id: string): CalculatorInputs | null => {
    const profile = profiles.find((p) => p.id === id)
    return profile?.inputs ?? null
  }, [profiles])

  return { profiles, save, remove, load }
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/__tests__/useProfiles.test.ts`
Expected: PASS — all tests green.

**Step 5: Commit**

```bash
git add src/hooks/
git commit -m "feat: add profile save/load/delete with localStorage persistence"
```

---

### Task 10: Input Validation

**Files:**
- Create: `src/calculations/validation.ts`
- Test: `src/calculations/__tests__/validation.test.ts`

**Step 1: Write the tests**

Create `src/calculations/__tests__/validation.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { validateInputs, ValidationError } from '../validation'
import { DEFAULT_INPUTS } from '../defaults'

describe('validateInputs', () => {
  it('returns no errors for valid defaults', () => {
    expect(validateInputs(DEFAULT_INPUTS)).toEqual([])
  })

  it('rejects negative salary', () => {
    const inputs = {
      ...DEFAULT_INPUTS,
      currentCareer: { ...DEFAULT_INPUTS.currentCareer, annualSalary: -1 },
    }
    const errors = validateInputs(inputs)
    expect(errors.some((e: ValidationError) => e.field.includes('annualSalary'))).toBe(true)
  })

  it('rejects time horizon outside 1-30', () => {
    const inputs = {
      ...DEFAULT_INPUTS,
      projectionSettings: { ...DEFAULT_INPUTS.projectionSettings, timeHorizonYears: 0 },
    }
    const errors = validateInputs(inputs)
    expect(errors.some((e: ValidationError) => e.field.includes('timeHorizon'))).toBe(true)
  })

  it('rejects loan interest rate over 100', () => {
    const inputs = {
      ...DEFAULT_INPUTS,
      transitionCosts: {
        ...DEFAULT_INPUTS.transitionCosts,
        loan: { ...DEFAULT_INPUTS.transitionCosts.loan, interestRate: 101 },
      },
    }
    const errors = validateInputs(inputs)
    expect(errors.some((e: ValidationError) => e.field.includes('interestRate'))).toBe(true)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/calculations/__tests__/validation.test.ts`
Expected: FAIL — module not found.

**Step 3: Implement validation**

Create `src/calculations/validation.ts`:

```ts
import { CalculatorInputs } from '../types/inputs'

export interface ValidationError {
  field: string
  message: string
}

export function validateInputs(inputs: CalculatorInputs): ValidationError[] {
  const errors: ValidationError[] = []

  if (inputs.currentCareer.annualSalary < 0) {
    errors.push({ field: 'currentCareer.annualSalary', message: 'Salary must be >= 0' })
  }
  if (inputs.currentCareer.annualBenefits < 0) {
    errors.push({ field: 'currentCareer.annualBenefits', message: 'Benefits must be >= 0' })
  }
  if (inputs.currentCareer.annualRetirementContribution < 0) {
    errors.push({ field: 'currentCareer.annualRetirementContribution', message: 'Retirement contribution must be >= 0' })
  }

  if (inputs.transitionCosts.educationCost < 0) {
    errors.push({ field: 'transitionCosts.educationCost', message: 'Education cost must be >= 0' })
  }
  if (inputs.transitionCosts.incomeGapMonths < 0) {
    errors.push({ field: 'transitionCosts.incomeGapMonths', message: 'Income gap must be >= 0' })
  }
  if (inputs.transitionCosts.loan.interestRate < 0 || inputs.transitionCosts.loan.interestRate > 100) {
    errors.push({ field: 'transitionCosts.loan.interestRate', message: 'Interest rate must be 0-100%' })
  }

  if (inputs.projectionSettings.timeHorizonYears < 1 || inputs.projectionSettings.timeHorizonYears > 30) {
    errors.push({ field: 'projectionSettings.timeHorizonYears', message: 'Time horizon must be 1-30 years' })
  }

  for (const entry of inputs.newCareer.salaryTrajectory) {
    if (entry.salary < 0) {
      errors.push({ field: `newCareer.salaryTrajectory.year${entry.year}`, message: `Year ${entry.year} salary must be >= 0` })
    }
  }

  return errors
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/calculations/__tests__/validation.test.ts`
Expected: PASS — all tests green.

**Step 5: Commit**

```bash
git add src/calculations/validation.ts src/calculations/__tests__/validation.test.ts
git commit -m "feat: add input validation with tests"
```

---

### Task 11: UI — Input Panel Components

> **REQUIRED SUB-SKILL:** Use @frontend-design:frontend-design for all UI component design.

**Files:**
- Create: `src/components/InputPanel.tsx`
- Create: `src/components/CurrentCareerInputs.tsx`
- Create: `src/components/TransitionCostInputs.tsx`
- Create: `src/components/NewCareerInputs.tsx`
- Create: `src/components/ProjectionSettingsInputs.tsx`
- Create: `src/components/SalaryTrajectoryTable.tsx`
- Create: `src/components/NumberInput.tsx`

**Step 1: Build a reusable NumberInput component**

A labeled number input with inline validation error display. All number inputs in the app use this.

**Step 2: Build each input section component**

Each section (CurrentCareerInputs, TransitionCostInputs, NewCareerInputs, ProjectionSettingsInputs) renders its fields using NumberInput. Each section is collapsible.

**Step 3: Build SalaryTrajectoryTable**

A dynamic table with add/remove row buttons. Each row has a year number and salary input.

**Step 4: Build InputPanel that composes all sections**

InputPanel renders all section components, receives the full `CalculatorInputs` state and an `onChange` callback.

**Step 5: Verify in browser**

Run `npm run dev` and confirm inputs render correctly, sections collapse/expand, trajectory table adds/removes rows.

**Step 6: Commit**

```bash
git add src/components/
git commit -m "feat: add input panel UI components"
```

---

### Task 12: UI — Results Panel & Summary Cards

> **REQUIRED SUB-SKILL:** Use @frontend-design:frontend-design for all UI component design.

**Files:**
- Create: `src/components/ResultsPanel.tsx`
- Create: `src/components/SummaryCards.tsx`

**Step 1: Build SummaryCards component**

Displays three cards:
- Net ROI — large number, green if positive, red if negative
- Break-even year — or "Does not break even" message
- Total transition cost

**Step 2: Build ResultsPanel that wraps SummaryCards and Chart (placeholder for now)**

ResultsPanel receives `CalculationResults` and renders SummaryCards at top with a placeholder for the chart below.

**Step 3: Verify in browser**

Run `npm run dev`, confirm summary cards display with correct formatting and colors.

**Step 4: Commit**

```bash
git add src/components/ResultsPanel.tsx src/components/SummaryCards.tsx
git commit -m "feat: add results panel with summary cards"
```

---

### Task 13: UI — Chart Component

> **REQUIRED SUB-SKILL:** Use @frontend-design:frontend-design for all UI component design. Charts should be polished with smooth gradients, clear annotations at break-even point, and satisfying transitions.

**Files:**
- Create: `src/components/ProjectionChart.tsx`
- Modify: `src/components/ResultsPanel.tsx`

**Step 1: Build ProjectionChart component**

Using Recharts, render:
- Two lines: "Stay" cumulative (one color) and "Switch" cumulative (another color)
- Shaded area between the lines (green where switch > stay, red where stay > switch)
- Break-even point annotation/dot if it exists
- Toggle button for nominal vs inflation-adjusted values
- Polished styling: smooth gradients, tooltips on hover, responsive

**Step 2: Wire into ResultsPanel**

Replace chart placeholder with ProjectionChart, passing yearlyProjections and breakEvenYear.

**Step 3: Verify in browser**

Run `npm run dev`, confirm chart renders with both lines, shading, and break-even annotation. Resize window to confirm responsive behavior.

**Step 4: Commit**

```bash
git add src/components/ProjectionChart.tsx src/components/ResultsPanel.tsx
git commit -m "feat: add polished projection chart with break-even annotation"
```

---

### Task 14: UI — Profile Management

> **REQUIRED SUB-SKILL:** Use @frontend-design:frontend-design for all UI component design.

**Files:**
- Create: `src/components/ProfileManager.tsx`

**Step 1: Build ProfileManager component**

- Dropdown showing saved profiles
- "Save" button that prompts for a name (inline input, not browser prompt)
- "Load" button to apply a saved profile's inputs
- "Delete" button with confirmation
- Receives: profiles list, onSave, onLoad, onDelete callbacks

**Step 2: Verify in browser**

Save a profile, reload the page, confirm it persists. Load it back, confirm inputs restore. Delete it, confirm removal.

**Step 3: Commit**

```bash
git add src/components/ProfileManager.tsx
git commit -m "feat: add profile save/load/delete UI"
```

---

### Task 15: Wire Everything Together in App.tsx

**Files:**
- Modify: `src/App.tsx`

**Step 1: Compose the full app**

Wire together:
- `useState` for `CalculatorInputs` (initialized from `DEFAULT_INPUTS`)
- `useCalculation` hook for live results
- `useProfiles` hook for profile management
- `validateInputs` for inline errors
- Layout: ProfileManager at top, two-column layout (InputPanel left, ResultsPanel right) on desktop, stacked on mobile

**Step 2: Verify full flow in browser**

- Change inputs → results update live
- Save a profile → appears in dropdown
- Load a profile → inputs restore
- Negative ROI scenario → red summary card
- Positive ROI scenario → green summary card
- Chart updates on every input change

**Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire all components together in App with live calculation"
```

---

### Task 16: Polish & Final Testing

**Files:**
- Various UI tweaks

**Step 1: Run all tests**

Run: `npx vitest run`
Expected: All tests pass.

**Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors.

**Step 3: Manual QA in browser**

- Test all edge cases: 0 income gap, empty trajectory table, 0 loan amount, very long time horizon
- Test responsive layout on narrow viewport
- Verify chart transitions are smooth when inputs change

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: polish UI and verify all edge cases"
```
