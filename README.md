# Career Change ROI Calculator

A client-side web app that helps you model the financial impact of a career change. Enter your current salary, transition costs (including education loans), and expected new career earnings, and get a live projection showing whether — and when — the switch pays off.

## Quick Start

```bash
npm install
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

## Features

- **Live-updating projections** — change any input and see results update instantly
- **Salary trajectory table** — define expected salaries year-by-year for your new career, with a default raise kicking in after
- **Education loan modeling** — factors in loan payments and total interest over the loan term
- **Lost retirement earnings** — accounts for forfeited employer contributions during the income gap, compounded over time
- **Inflation-adjusted results** — toggle between nominal and real (present-value) dollars
- **Break-even detection** — identifies the year cumulative earnings in the new career overtake staying put
- **Save/load profiles** — save multiple scenarios to localStorage and compare them
- **Responsive layout** — two-column on desktop, stacked on mobile

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | TypeScript check + production build |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Project Structure

```
src/
  calculations/        Pure functions — no UI dependencies
    defaults.ts          Default input values
    loan.ts              Loan amortization (payment, total interest)
    projection.ts        Stay/switch scenario projections, full engine
    validation.ts        Input validation rules
    __tests__/           Unit tests for all calculation modules

  components/          React UI components
    InputPanel.tsx        Composes all input sections
    CurrentCareerInputs   Salary, benefits, retirement, raise %
    TransitionCostInputs  Education, income gap, loan details
    NewCareerInputs       Salary trajectory table, benefits
    ProjectionSettings    Time horizon slider, inflation, returns
    SalaryTrajectoryTable Dynamic year-by-year salary editor
    NumberInput           Reusable input with formatting and validation
    CollapsibleSection    Animated expand/collapse wrapper
    ResultsPanel          Summary cards + chart
    SummaryCards          Net ROI, break-even year, transition cost
    ProjectionChart       Recharts line/area chart with break-even marker
    ProfileManager        Save/load/delete scenario profiles

  hooks/
    useCalculation.ts    Memoized projection computation
    useProfiles.ts       localStorage profile persistence

  types/
    inputs.ts            Calculator input interfaces
    results.ts           Projection result interfaces
    profiles.ts          Saved profile interface
```

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Recharts
- Vitest + Testing Library

## How the Calculation Works

The engine compares two scenarios over a configurable time horizon (1-30 years):

**Stay scenario**: Current total compensation (salary + benefits + retirement) growing at the annual raise rate.

**Switch scenario**: Transition costs upfront (income gap + education + other costs), then new career compensation from the salary trajectory table. Subtracts annual loan payments during the loan term. Accounts for lost retirement earnings during the gap.

Both scenarios are discounted by the inflation rate to produce present-value (real) numbers. The break-even point is the year where cumulative switch earnings overtake cumulative stay earnings.
