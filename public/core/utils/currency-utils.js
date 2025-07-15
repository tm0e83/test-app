/**
 * formats the passed number as currency string
 * @param {number} num
 * @returns {string} formatted currency string
 */
export function toCurrency(num) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currency: 'EUR'
  }).format(num);
}