// ─── MOCK API PATTERN (example — copy & rename per prototype) ─────────────────
// When a prototype is data-driven, model the real API response as a typed shape
// here instead of scattering hardcoded values through the template. Benefits:
//   • One place to flip between UI states (see the toggle comments below)
//   • The shape documents what the real endpoint returns
//   • Components stay declarative — they read fields, not magic numbers
//
// This file is illustrative and unused. Duplicate it (e.g. mockOrdersApi.ts),
// replace the shape with your domain, and import the getter in your prototype.
// ─────────────────────────────────────────────────────────────────────────────

// Mirror the enum(s) the real endpoint returns, with a comment pointing at it.
export type AccountStatus = 'new' | 'pending' | 'active' | 'suspended'

export interface ExampleSellerData {
  status: AccountStatus
  sellerName: string
  currency: string
  balance: number        // EUR
  lastUpdated: string     // ISO date
}

export const getExampleSellerData = (_sellerId: string): ExampleSellerData => {
  // MOCK — flip these to preview different UI states:
  //   New seller:  status: 'new',     balance: 0
  //   Pending:     status: 'pending', balance: 0
  //   Active:      status: 'active',  balance: 12_500
  //   Suspended:   status: 'suspended'
  return {
    status: 'active',
    sellerName: 'Example Seller GmbH',
    currency: 'EUR',
    balance: 12_500,
    lastUpdated: '2026-06-01',
  }
}
