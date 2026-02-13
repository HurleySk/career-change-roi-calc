// @vitest-environment node
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
    const annual = calculateAnnualLoanPayment(25000, 6.5, 10)
    expect(annual).toBeCloseTo(3406.44, 0)
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
    expect(interest).toBeCloseTo(9064.39, -1)
  })
})
