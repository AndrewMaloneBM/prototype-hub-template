# Prototype Hub

This file is the source of truth for this workspace. Claude reads it automatically at the start of every session.

---

## First-time setup

**Check `app/app.config.ts` immediately at the start of every session.** If it still contains `__TEAM_NAME__`, this is a fresh clone. Do not wait for the user to ask — greet them and start setup right away.

Say something like: "Looks like this is a fresh setup — I'll get your hub configured and live in a few minutes. What's your name?" Then:

1. Ask for their name and their team name — nothing else, keep it short
2. Patch `app/app.config.ts`: replace `__TEAM_NAME__`, `__DESIGNER_NAME__`, `__TEAM_SLUG__` (slug = team name lowercased, spaces → hyphens)
3. Run `npm install` automatically — tell them you're doing it, don't ask
4. Run `npm run build` to verify everything compiles
5. Ask: "Ready to deploy? I'll get your hub live now." Then run `vercel --prod`
6. Share the live URL and tell them they can start adding prototypes

The user should not need to touch the terminal at any point. You run all commands. They just answer two questions and watch it happen.

---

## Who & Why

A code-based prototyping workspace for product designers. Build and share interactive, high-fidelity prototypes without waiting on engineering. Prototypes are deployed to a shared Vercel URL and updated in seconds.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Nuxt 4 + Vue 3 (Composition API) |
| Styling | Tailwind CSS via `@nuxtjs/tailwindcss` |
| Design system | Back Market Revolve tokens (in `tailwind.config.ts`) |
| Dev server | `npm run dev` — runs on port 3030 |
| Deployment | Vercel (`vercel --prod`) |

**Key config files:**
- `app/app.config.ts` — team name, designer name, slug (configured during setup)
- `tailwind.config.ts` — Revolve colour tokens, fonts, border radii
- `assets/css/main.css` — base component classes (`.btn`, `.card`, `.badge-*`)

---

## Design Tokens (BM Revolve)

Revolve is Back Market's design system. Full guidelines are available from your design system team.

**Colours in `tailwind.config.ts`:**
- `bm-green-*` (50–900) — primary brand green
- `bm-gray-*` (50–900) — neutral greys (exact Revolve HSL values)
- `bm-surface` — page/nav background (`background.surface.default.hi`)
- `bm-text-hi/mid/low/muted` — semantic text colours
- `bm-border`, `bm-border-action` — semantic border colours
- `bm-danger/warning/success/info` — functional colours

**Typography:**
- `font-display` — GT Super Display (headings)
- `font-body` — Scto Grotesk A (body/UI)

**Border radius:**
- `rounded-bm-xs` (2px), `rounded-bm-sm` (6px), `rounded-bm` (8px), `rounded-bm-lg` (12px)

---

## Project Structure

```
app/app.config.ts                  ← Team config (name, designer, slug)
app/
  pages/
    index.vue                  ← Hub landing page (prototype registry)
    prototypes/
      _template.vue            ← Scaffold for new prototypes
  components/
    PrototypeSidebar.vue       ← Reusable concept-switcher sidebar
    BmShell.vue                ← BM back-office shell (header + nav + tabs)
  composables/
    usePrototypeSidebar.ts     ← Sidebar reactive state
  assets/css/main.css
scripts/
  new-prototype.mjs            ← Scaffold a new prototype page
  setup.mjs                    ← First-time setup script
```

---

## Adding a prototype

When a user asks to create a new prototype or shares a PRD, take the lead:

1. Run `npm run new-prototype -- "prototype-name"` to scaffold the file
2. Read the PRD (or ask them to paste it) and populate `conceptMeta[]` — concept names, pros, cons, success metrics, which pages each concept touches
3. Build the shell using `<BmShell>` and wire up `<PrototypeSidebar>` with the concept data
4. Register it in `app/pages/index.vue` → `inProgress` array
5. Run `vercel --prod` and share the URL

The user should never need to know which commands to run. They share context (PRD, screenshots, goals) and you handle execution.

---

## Hub Page (`app/pages/index.vue`)

**Prototype interface:**
```ts
interface Prototype {
  title: string
  description: string
  problemStatement?: string
  author: string
  date: string
  status: 'In progress' | 'Complete projects' | 'Backlog'
  concepts: { n: number; name: string; pages: string[] }[]
  scope: string
  goal?: string
  impact?: string
  link: string
  accent: string  // hex colour for the card accent strip
}
```

Add prototypes to the `inProgress` or `shipped` arrays.

---

## PrototypeSidebar

The dark left panel. Pass `conceptMeta[]` and v-model the active state:

```vue
<PrototypeSidebar
  title="Your Prototype Title"
  :concepts="conceptMeta"
  v-model:activeConcept="activeConcept"
  v-model:previewMode="previewMode"
  v-model:sidebarOpen="sidebarOpen"
  v-model:activePageId="activePageId"
  @update:activePageId="setActivePage"
  @reset="resetDismissedUi"
/>
```

`conceptMeta[]` shape:
```ts
{
  name: string
  prdFeature: string
  prdMetric: string
  pros: string[]
  cons: string[]
  pages: { id: string; label: string; navItem: string; changes: string[] }[]
}
```

---

## BmShell

BM back-office shell — header, nav, sub-tabs. Prop-driven:

```vue
<BmShell
  :nav-items="navItems"
  :active-nav-item="activeNavItem"
  :seller-name="sellerData.sellerName"
  page-title="Money"
  :tabs="tabs"
  v-model:activeTab="conceptTabs[activeConcept - 1]"
>
  <!-- page content -->
</BmShell>
```

---

## Key Decisions & Conventions

- `definePageMeta({ layout: false })` on all prototype pages
- `v-show` (not `v-if`) for concept switching — keeps all concepts mounted so state persists
- `usePrototypeSidebar(conceptMeta)` owns all sidebar reactive state
- No comments in code unless the why is non-obvious
- Always use Revolve token classes — never hardcode hex except where no token exists
- `border-b border-bm-border` divider between header and nav must always be present
