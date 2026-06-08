// Shared formatting helpers. Auto-imported in Nuxt — call directly in any
// component (e.g. {{ formatEUR(amount) }}). Default locale is de-DE / EUR
// since most Back Market back-office prototypes are euro-denominated; override
// per call where needed.

const DEFAULT_LOCALE = 'de-DE'

/** "€1,837" — rounded euros, no decimals. */
export function formatEUR(amount: number, locale = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/** "€1,837.87" — euros with cents. */
export function formatEURCents(amount: number, locale = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/** "28 May 2026" — accepts a Date or any value the Date constructor parses. */
export function formatDate(date: Date | string | number, locale = DEFAULT_LOCALE): string {
  const d = date instanceof Date ? date : new Date(date)
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

/** "1,250" — plain grouped integer, no currency symbol. */
export function formatNumber(value: number, locale = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale).format(value)
}

/** "+12%" / "−4%" — signed whole-number percentage. */
export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${Math.abs(Math.round(value))}%`
}
