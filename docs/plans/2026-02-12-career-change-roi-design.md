# Career Change ROI Calculator — Design

## Overview

A client-side web app that helps users calculate the expected ROI (or net loss) of a career change. Users input their current career financials, transition costs, and new career salary expectations, and the app produces a live-updating projection with charts and summary metrics.

## Platform & Stack

- React 18 + TypeScript
- Vite (dev server + build)
- Recharts (charting)
- Tailwind CSS or CSS Modules for styling
- localStorage for saved profiles
- No backend, no database — purely client-side

## Architecture: Single-Page Reactive Calculator

One page with inputs on the left (desktop) or top (mobile) and live-updating results on the right/bottom. As users change any input, results recompute and update in real-time.

## Input Model

### Current Career

- Current annual salary
- Annual benefits value (health insurance, etc.)
- Annual employer retirement contribution (401k match, etc.)
- Expected annual raise % (default: 3%)

### Transition Costs

- Education/training cost (total)
- Duration of income gap (months)
- Other transition costs (certifications, tools, etc.)

**Education Loan (if applicable):**
- Amount financed (auto-populated as education cost minus cash payment)
- Loan interest rate (default: 6.5%)
- Loan term (years)

### New Career

- Salary trajectory table: user defines expected salary for year 1, year 2, year 3, etc. (add/remove rows)
- Default annual raise % after trajectory table ends (default: 3%)
- New annual benefits value
- New annual employer retirement contribution

### Projection Settings

- Time horizon (1-30 years, default: 10)
- Inflation/discount rate (default: 3%)
- Assumed investment return rate for retirement calculations (default: 7%)

## Calculation Engine

Pure functions with no UI dependencies. Computes a year-by-year projection comparing two scenarios:

### "Stay" Scenario (Baseline)

- Each year: current salary + benefits + retirement contributions, growing at the raise rate
- Each year's total discounted by inflation rate for present value

### "Switch" Scenario

- **Year 0 (transition):** negative cash flow = income lost during gap (months * monthly salary) + out-of-pocket education costs + other transition costs
- **Lost retirement earnings:** employer contributions forfeited during gap, compounded at investment return rate over the projection horizon
- **Subsequent years:** new salary (from trajectory table, then default raise after table ends) + new benefits + new retirement contributions
- **Loan payments:** annual loan payments subtracted until loan is paid off (standard amortization)
- **All values discounted** to present value using inflation rate

### Key Outputs

- **Net ROI:** total present-value earnings in "switch" minus "stay"
- **Break-even point:** the year where cumulative "switch" overtakes "stay"
- **Total transition cost:** all upfront costs + total loan interest paid
- **Cumulative difference by year:** powers the chart

## UI Layout & Results Display

### Input Panel

- Collapsible sections for each input group
- Salary trajectory table with add/remove row buttons
- Sensible defaults pre-filled so users see results immediately
- Inline validation messages

### Results Panel (Live-Updating)

- **Summary cards** at top:
  - Net ROI (or net loss) — large, color-coded green/red
  - Break-even year (or "Does not break even within projection")
  - Total transition cost including loan interest
- **Line chart:** two lines showing cumulative earnings for "stay" vs "switch" over time
  - Break-even crossover point highlighted
  - Shaded area between lines showing gain/loss
  - Toggle between nominal and inflation-adjusted values
- Charts must be polished — smooth gradients, clear annotations, satisfying transitions on input changes

### Saved Profiles

- Dropdown/drawer at top of page
- Save current inputs as a named profile
- Load or delete saved profiles
- Stored in localStorage

## Project Structure

```
src/
  components/       # UI components (InputPanel, ResultsPanel, Chart, etc.)
  calculations/     # Pure functions for the projection engine
  types/            # TypeScript interfaces for inputs, results, profiles
  hooks/            # Custom hooks (useCalculation, useProfiles, etc.)
  App.tsx
  main.tsx
```

## Error Handling & Edge Cases

- Salary values must be >= 0
- Loan interest rate 0-100%
- Time horizon 1-30 years
- No income gap (0 months) — valid, no gap cost
- Empty salary trajectory table — falls back to single starting salary input
- Loan amount is 0 — no loan payments
- New career pays less — shows negative ROI (valid result)
- Break-even never reached — clearly stated
- Results shown immediately on load with defaults
