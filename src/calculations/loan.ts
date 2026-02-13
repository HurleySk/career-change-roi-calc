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
