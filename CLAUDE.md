# Prototype Hub

This file is the source of truth for this workspace. Claude reads it automatically at the start of every session.

---

## First-time setup

**Check `app/app.config.ts` immediately at the start of every session.** If it still contains `__TEAM_NAME__`, this is a fresh clone. Do not wait for the user to ask — greet them and start setup right away.

Say something like: "Looks like this is a fresh setup — I'll get your hub configured and live in a few minutes. What's your name?" Then:

1. Ask for their name and their team name — nothing else, keep it short
2. Patch `app/app.config.ts`: replace `__TEAM_NAME__`, `__DESIGNER_NAME__`, `__TEAM_SLUG__` (slug = team name lowercased, spaces → hyphens)
3. Run `npm install` automatically — tell them you're doing it, don't ask
4. Run `npm run generate` to verify the static build works
5. Check if `gh` is authenticated by running `gh auth status`. If it returns an error, run `gh auth login` and tell the user: "GitHub needs to verify your account — a one-time code and URL will appear below. Open the URL, enter the code, and come back here." Wait for auth to complete before continuing.
6. Enable GitHub Pages for the repo using the `gh` CLI:
   ```bash
   gh api repos/{owner}/{repo}/pages --method POST --field build_type=workflow
   ```
   If that returns an error because Pages already exists, run the same call with `--method PUT` instead to update the existing configuration.
7. Commit and push the setup:
   ```bash
   git add -A && git commit -m "Initial setup" && git push
   ```
8. Fetch the live URL from `gh api repos/{owner}/{repo}/pages` and read the `html_url` field. Tell the user: "Your hub is deploying now — it'll be live at `<html_url>` in about a minute." (GitHub Actions handles the build and deploy automatically on every push to `main`.)

The user should not need to touch the terminal at any point. You run all commands. They just answer two questions and watch it happen.

---

## Who & Why

A code-based prototyping workspace for product designers. Build and share interactive, high-fidelity prototypes without waiting on engineering. Prototypes are deployed to a shared GitHub Pages URL (`https://[username].github.io/[repo-name]/`) and updated in seconds — just commit and push, GitHub Actions handles the rest.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Nuxt 4 + Vue 3 (Composition API) |
| Styling | Tailwind CSS via `@nuxtjs/tailwindcss` |
| Design system | Back Market Revolve tokens (in `tailwind.config.ts`) |
| Dev server | `npm run dev` — runs on port 3030 |
| Static build | `npm run generate` — outputs to `.output/public` |
| Deployment | GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`) — triggered on push to `main` |

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

**Typography — real Revolve fonts, self-hosted (`@font-face` in `app/assets/css/main.css`, files in `public/fonts/`):**
- `font-heading-primary` — IvarSoft (serif) — h1 / hero headings
- `font-heading-secondary` — BMDupletDSP (display sans) — h2 / h3
- `font-body` — BMDupletTXT (body sans) — all UI text, labels, captions (default)

(`font-display` no longer exists — never use it. The hub landing page `index.vue` intentionally uses a separate DM-font editorial style via Google Fonts; that's a deliberate "cover page" choice, not a token.)

**Icons — Revolve library (402 SVGs in `public/icons/`):**
- Use `<RevIcon name="IconName" class="w-4 h-4" />` for icons that don't need colour inheritance
- Keep inline SVG for icons that use `text-*` colour (RevIcon renders an `<img>`, so it can't inherit colour)

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
    RevIcon.vue                ← Revolve icon wrapper — <RevIcon name="IconName" class="w-4 h-4" />
  composables/
    usePrototypeSidebar.ts     ← Sidebar reactive state
  assets/css/main.css          ← @font-face (Revolve fonts) + .btn / .card / .badge classes
public/
  bm-logo.svg, bm-avatar.svg, bm-wordmark.svg
  fonts/                       ← Revolve font files (BMDupletTXT, BMDupletDSP, IvarSoft)
  icons/                       ← 402 Revolve SVG icons (IconName.svg)
  .nojekyll                    ← keeps GitHub Pages from dropping the _nuxt/ dir
scripts/
  new-prototype.mjs            ← Scaffold a new prototype page (prints the hub registration snippet)
  setup.mjs                    ← First-time setup script
```

---

## Daily use

When the user asks you to deploy, ship, or share their latest changes, run:

```bash
git add -A && git commit -m "Update prototypes" && git push
```

That's it — GitHub Actions picks up the push to `main`, runs `npm run generate`, and publishes `.output/public` to GitHub Pages automatically. No Vercel, no extra CLIs. The live URL stays at `https://[username].github.io/[repo-name]/`. If the user wants to watch the deploy, you can tail it with `gh run watch` or `gh run list --workflow=deploy.yml`.

---

## Adding a prototype

When a user asks to create a new prototype or shares a PRD, take the lead:

1. Run `npm run new-prototype -- "prototype-name"` to scaffold the file. It prints a ready-to-paste hub registration snippet (author/date/link pre-filled) — use it in step 4.
2. Read the PRD (or ask them to paste it) and populate `conceptMeta[]` — concept names, pros, cons, success metrics, which pages each concept touches
3. Build the shell using `<BmShell>` and wire up `<PrototypeSidebar>` with the concept data. The scaffold (`_template.vue`) already demonstrates the working patterns (modal, loading, scroll-to-top, sub-states) — extend it rather than starting blank.
4. Register it in `app/pages/index.vue` → `inProgress` array (paste the snippet from step 1, then fill in description/scope/concepts). The full `Prototype` interface is documented below.
5. Commit and push with `git add -A && git commit -m "Add [prototype-name]" && git push` — GitHub Actions deploys it

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
  pages: { id: string; label: string; navItem: string; changes: string[]; subStates?: { id: string; label: string }[] }[]
}
```

### Pages — sub-states

Each page in `conceptMeta` can optionally define `subStates`. Rules:

**When to add sub-states:**
- The page has multiple distinct UI states worth navigating to directly (e.g. a modal at step 2 of 4, a slide-in panel, an "applied" status screen, a different content state)
- A reviewer would benefit from jumping straight to that state without having to click through the prototype

**When NOT to add sub-states:**
- The page has only one meaningful view — just show the page itself
- The variation is too minor to be worth naming (e.g. a hover state, a tooltip)

**Naming conventions:**
- `id`: kebab-case, unique within the prototype — e.g. `step-2`, `home-applied`, `panel-open`
- `label`: short and descriptive, shown in the sidebar — e.g. `"Step 2 · Financing partner"`, `"Applied — status strip"`

**Wiring pattern (required):**
- Pass `:active-sub-state-id="activeSubStateId"` to `<PrototypeSidebar>` — this is always a `computed`, never a plain `ref`. It derives its value from your prototype's own reactive state so the sidebar stays in sync whether the user clicks the sidebar or interacts with the prototype directly.
- Handle `@set-sub-state="onSetSubState"` — reset transient UI, then set the reactive state that corresponds to the requested sub-state.
- Never use `<Teleport to="body">` for modals. Place them as `absolute inset-0` siblings of the inner scroll div, inside a `relative overflow-hidden` wrapper. See `_template.vue` for the exact structure.

### Optional props (sharing & concept lifecycle)

- `:dropped-concepts="[1, 3]"` — marks rejected concept numbers with a strikethrough + dimmed pill. Keeps killed directions visible for stakeholder context instead of deleting them.
- `share-mode` — external-facing view: hides the Hub link, adds a Before/After explainer, and expands all pages by default. Pair with a `/share/...` route (see "Sharing" note in the README) so stakeholders get a clean link without the internal hub chrome.
- `hide-concept-details` — swaps the numbered pills for named concept labels and hides the pros/cons/metric detail zone. Use for single-direction explorations where the concept-comparison framing isn't needed.

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
  v-model:activeTab="activeTab"
  :tab-dot-predicate="(tab) => tab === 'Activity'"
>
  <template #header-actions>
    <!-- buttons/controls aligned with the page title -->
  </template>
  <!-- page content -->
</BmShell>
```

Optional:
- `:tab-dot-predicate="(tab) => boolean"` — green dot on sub-tabs that match (e.g. tabs with new content).
- `#header-actions` slot — controls rendered to the right of the page title.

---

## Reusable patterns (wired up in `_template.vue`)

The scaffold is a working reference, not a skeleton. These patterns recurred across every real prototype — copy them from `_template.vue`:

- **Sub-state dispatcher** — `activeSubStateId` (a `computed`) + `onSetSubState()` keep the sidebar in sync with prototype state.
- **`pendingAction` loading** — one ref tracks which button is mid-async; use it to disable the button and show a spinner (`advanceWithDelay()` fakes latency).
- **`scrollPageToTop()`** — reset the scroll surface on page navigation so reviewers don't land mid-page.
- **Modal as sibling** — `absolute inset-0` sibling of the scroll div, wrapped in `<Transition>`.

---

## Key Decisions & Conventions

- `definePageMeta({ layout: false })` on all prototype pages
- `v-show` (not `v-if`) for concept switching — keeps all concepts mounted so state persists
- `usePrototypeSidebar(conceptMeta)` owns all sidebar reactive state
- No comments in code unless the why is non-obvious
- Always use Revolve token classes — never hardcode hex except where no token exists
- `border-b border-bm-border` divider between header and nav must always be present
