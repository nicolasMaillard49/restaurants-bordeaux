export function getPriceLevel(level: number): string {
  const prices = ['€', '€€', '€€€', '€€€€']
  return prices[level] || '€'
}

export function formatRating(rating: string | number): string {
  const num = typeof rating === 'string' ? parseFloat(rating) : rating
  return num ? num.toFixed(1) : '0.0'
}
