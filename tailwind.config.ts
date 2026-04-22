import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts,js}',
  ],
  theme: {
    extend: {
      // Back Market Revolve design tokens (approximated from public brand)
      // Replace with actual values from BackMarket/design-tokens when available
      colors: {
        // Brand green (approximated from public brand)
        'bm-green': {
          50:  '#edfaf4',
          100: '#d0f3e3',
          200: '#a4e8ca',
          300: '#6dd6ab',
          400: '#38be8a',
          500: '#18a271',
          600: '#0d8259',
          700: '#0b6847',
          800: '#0a5239',
          900: '#08402d',
        },
        'bm-black': 'hsl(225, 21%, 7%)',
        'bm-white': '#ffffff',
        // Neutral grey — exact Revolve raw.grey scale (cool blue-grey tint)
        'bm-gray': {
          50:  'hsl(225, 40%, 98%)',  // grey.98 — near-white surface
          100: 'hsl(220, 19%, 94%)',  // grey.94 — mild highlight / button bg
          200: 'hsl(225, 15%, 89%)',  // grey.90 — dividers, border.static.low
          300: 'hsl(223, 4%, 68%)',   // grey.70 — border.static.mid
          400: 'hsl(223, 3%, 52%)',   // grey.55 — action borders, muted icons
          500: 'hsl(223, 4%, 37%)',   // grey.40 — text.static.low
          600: 'hsl(223, 4%, 33%)',   // grey.35 — text.action.low
          700: 'hsl(223, 7%, 20%)',   // grey.20 — text.static.mid
          800: 'hsl(214, 12%, 11%)',  // grey.10 — inverse surface dark
          900: 'hsl(225, 21%, 7%)',   // grey.5  — text.static.hi / action.hi bg
        },
        // Revolve semantic tokens — for BM product shell surfaces (BmShell)
        'bm-surface':       'hsl(228, 24%, 96%)',  // background.surface.default.hi
        'bm-text-hi':       'hsl(225, 21%, 7%)',   // text.static.default.hi
        'bm-text-mid':      'hsl(223, 7%, 20%)',   // text.static.default.mid
        'bm-text-low':      'hsl(223, 4%, 37%)',   // text.static.default.low
        'bm-text-muted':    'hsl(223, 3%, 52%)',   // inactive / muted elements
        'bm-border':        'hsl(225, 15%, 89%)',  // border.static.default.low
        'bm-border-action': 'hsl(223, 3%, 52%)',   // border.action.default.low
        // Functional
        'bm-danger':  'hsl(351, 84%, 39%)',  // functional.danger.40
        'bm-warning': 'hsl(42, 75%, 27%)',   // functional.warning.40
        'bm-success': 'hsl(156, 100%, 21%)', // functional.success.40
        'bm-info':    'hsl(219, 27%, 40%)',  // functional.info.40
      },
      fontFamily: {
        display: ['GT Super Display', 'Georgia', 'serif'],
        body:    ['Scto Grotesk A', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'bm-xs': '2px',   // radius.xs — badges, tiny elements
        'bm-sm': '6px',   // radius.sm — inputs, chips, small buttons
        'bm':    '8px',   // radius.md — buttons, most components
        'bm-lg': '12px',  // radius.lg — cards, overlays
        'bm-xl': '16px',  // extended — larger containers
      },
    },
  },
  plugins: [],
} satisfies Config
