<script setup lang="ts">
definePageMeta({ layout: false })

const { hub } = useAppConfig()

const scrolled = ref(false)
let scrollHandler: () => void

useHead({
  title: `${hub.teamName} — Prototype Hub`,
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap'
    }
  ]
})

interface Concept {
  n: number
  name: string
  pages: string[]
}

interface Prototype {
  title: string
  description: string
  problemStatement?: string
  author: string
  date: string
  status: 'In progress' | 'Complete projects' | 'Backlog'
  concepts: Concept[]
  scope: string
  goal?: string
  impact?: string
  link: string
  accent: string
}

const inProgress: Prototype[] = []

const shipped: Prototype[] = []

onMounted(() => {
  scrollHandler = () => { scrolled.value = window.scrollY > 20 }
  window.addEventListener('scroll', scrollHandler, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandler)
})
</script>

<template>
  <div class="wb-grid-bg"></div>

  <nav class="wb-nav" :class="{ 'wb-nav--scrolled': scrolled }">
    <div class="wb-nav-inner">
      <div class="wb-nav-left">
        <span class="wb-nav-sub">{{ hub.slug }} · prototypes</span>
      </div>
      <div class="wb-nav-right">
        <span class="wb-nav-name">{{ hub.designerName }}</span>
      </div>
    </div>
  </nav>

  <main class="wb-main">

    <header class="wb-header">
      <h1 class="wb-title"><span class="wb-title-prefix">{{ hub.teamName }} —</span><br><em>Prototype</em> Hub</h1>
    </header>

    <section class="wb-section">
      <div class="wb-section-head">
        <div class="wb-section-label">
          <span class="wb-dot wb-dot-amber wb-dot-pulse"></span>
          In progress
        </div>
        <div class="wb-section-line"></div>
        <span class="wb-section-count">{{ inProgress.length }}</span>
      </div>

      <div class="wb-bento">
        <article
          v-for="(p, i) in inProgress"
          :key="p.link"
          class="wb-card wb-card-project"
          :style="{ '--accent': p.accent, animationDelay: `${i * 60}ms` }"
        >
          <div class="wb-card-strip"></div>

          <div class="wb-project-top">
            <div class="wb-project-top-main">
              <span class="wb-meta">{{ p.date }}</span>
              <h2 class="wb-card-title">{{ p.title }}</h2>
              <p v-if="p.problemStatement" class="wb-problem-statement">{{ p.problemStatement }}</p>
              <p class="wb-card-desc">{{ p.description }}</p>

              <div class="wb-meta-strip">
                <span v-if="p.goal" class="wb-meta-strip-item">
                  <span class="wb-meta-strip-key">Goal</span>
                  <span class="wb-meta-strip-val">{{ p.goal }}</span>
                </span>
                <span class="wb-meta-strip-sep"></span>
                <span v-if="p.impact" class="wb-meta-strip-item">
                  <span class="wb-meta-strip-key">Impact</span>
                  <span class="wb-meta-strip-val">{{ p.impact }}</span>
                </span>
                <span class="wb-meta-strip-sep"></span>
                <span class="wb-meta-strip-item">
                  <span class="wb-meta-strip-key">Scope</span>
                  <span class="wb-meta-strip-val">{{ p.scope }}</span>
                </span>
              </div>
            </div>

            <div class="wb-project-top-aside">
              <div class="wb-aside-row">
                <span class="wb-aside-label">Concepts</span>
                <span class="wb-aside-value">{{ p.concepts.length }}</span>
              </div>
              <a :href="p.link" class="wb-aside-cta">
                Open prototype <span class="wb-arrow">→</span>
              </a>
            </div>
          </div>

        </article>
      </div>
    </section>

    <section class="wb-section">
      <div class="wb-section-head">
        <div class="wb-section-label">
          <span class="wb-dot wb-dot-green"></span>
          Complete projects
        </div>
        <div class="wb-section-line"></div>
        <span class="wb-section-count">{{ shipped.length }}</span>
      </div>

      <div class="wb-bento">
        <div class="wb-card wb-card-empty">
          <div class="wb-empty-icon">+</div>
          <p class="wb-empty-text">No complete projects yet</p>
        </div>
      </div>
    </section>

  </main>
</template>

<style>
:root {
  --ink: #2F3137;
  --bg: #F8F9FC;
  --surface: #FFFFFF;
  --green: #1A9C5B;
  --green-light: #E6F5EF;
  --amber: #D4860A;
  --amber-light: #FDF3E3;
  --muted: #9EA3AF;
  --border: #DDDFE4;
  --radius: 20px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --ink: #F0F1F5;
    --bg: #18191E;
    --surface: #23252B;
    --green: #2DC87A;
    --green-light: rgba(45,200,122,0.12);
    --amber: #F0A030;
    --amber-light: rgba(240,160,48,0.12);
    --muted: #6B7280;
    --border: rgba(255,255,255,0.1);
  }
}

body { background: var(--bg); }

.wb-grid-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, rgba(47,49,55,0.25) 1px, transparent 1px);
  background-size: 24px 24px;
}

@media (prefers-color-scheme: dark) {
  .wb-grid-bg {
    background-image: radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px);
  }
}

.wb-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  height: 56px;
  border-bottom: 1px solid transparent;
  transition: background 0.25s ease, border-color 0.25s ease, backdrop-filter 0.25s ease;
}

.wb-nav--scrolled {
  background: rgba(248,249,252,0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom-color: var(--border);
}

@media (prefers-color-scheme: dark) {
  .wb-nav--scrolled {
    background: rgba(24,25,30,0.85);
  }
}

.wb-nav-inner {
  max-width: 1080px;
  margin: 0 auto;
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0;
}

.wb-nav-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.wb-nav-logo {
  height: 15px;
  width: auto;
  display: block;
}

@media (prefers-color-scheme: dark) {
  .wb-nav-logo {
    filter: brightness(0) invert(1);
  }
}

.wb-nav-sep {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  line-height: 1;
  color: var(--border);
}

.wb-nav-sub {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  line-height: 1;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.wb-nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.wb-nav-name {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.wb-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--ink);
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  color: var(--bg);
  flex-shrink: 0;
}

.wb-main {
  position: relative;
  z-index: 1;
  max-width: 1080px;
  margin: 0 auto;
  padding: 120px 24px 96px;
}

.wb-header {
  margin-bottom: 72px;
}

.wb-title {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: clamp(42px, 5.5vw, 64px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--green);
  margin-bottom: 0;
}

.wb-title-prefix {
  color: var(--ink);
}

.wb-title em {
  font-style: italic;
}

.wb-tagline {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
}

.wb-section {
  margin-bottom: 64px;
}

.wb-section-head {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.wb-section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
  white-space: nowrap;
}

.wb-section-line {
  flex: 1;
  height: 1px;
  background: var(--border);
}

.wb-section-count {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: var(--muted);
}

.wb-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.wb-dot-amber { background: var(--amber); }
.wb-dot-green { background: var(--green); }
.wb-dot-gray  { background: var(--muted); }

.wb-dot-pulse {
  animation: dotPulse 2s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.7); }
}

.wb-bento {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
}

.wb-card {
  position: relative;
  border-radius: var(--radius);
  border: 1.5px solid rgba(47,49,55,0.12);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  display: block;
  animation: fadeUp 0.45s ease both;
}

@media (prefers-color-scheme: dark) {
  .wb-card {
    border-color: rgba(255,255,255,0.08);
  }
}

.wb-card-strip {
  height: 3px;
  background: var(--accent, var(--green));
}

.wb-card-inner {
  padding: 24px;
}

.wb-card-project {
  grid-column: span 12;
  background: #1E2025;
  border-color: rgba(255,255,255,0.07);
  display: flex;
  flex-direction: column;
}

.wb-project-top {
  display: flex;
  gap: 0;
  align-items: stretch;
}

.wb-project-top-main {
  flex: 1;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.wb-project-top-aside {
  width: 220px;
  flex-shrink: 0;
  border-left: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
}

.wb-aside-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.wb-aside-label {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255,255,255,0.28);
}

.wb-aside-value {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 56px;
  line-height: 1;
  color: rgba(255,255,255,0.92);
}

.wb-aside-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  color: var(--accent, var(--green));
  text-decoration: none;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.03);
  transition: background 0.2s ease, border-color 0.2s ease, gap 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  justify-content: space-between;
}

.wb-aside-cta:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.18);
  gap: 10px;
}

.wb-meta-strip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
  padding-top: 14px;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.wb-meta-strip-item {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
}

.wb-meta-strip-key {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255,255,255,0.3);
}

.wb-meta-strip-val {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: rgba(255,255,255,0.72);
}

.wb-meta-strip-sep {
  width: 1px;
  height: 10px;
  background: rgba(255,255,255,0.12);
}

.wb-concepts-table {
  border-top: 1px solid rgba(255,255,255,0.08);
  background: rgba(0,0,0,0.15);
  padding: 8px 32px 16px;
}

.wb-concepts-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0 10px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.wb-concepts-head-label {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.4);
}

.wb-concepts-head-hint {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: rgba(255,255,255,0.25);
}

.wb-concept-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  text-decoration: none;
  color: inherit;
  transition: background 0.15s ease, padding 0.2s ease;
  border-radius: 6px;
}

.wb-concept-row:last-child {
  border-bottom: none;
}

.wb-concept-row:hover {
  background: rgba(255,255,255,0.03);
  padding-left: 10px;
  padding-right: 10px;
}

.wb-concept-n {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: rgba(255,255,255,0.25);
  width: 24px;
  flex-shrink: 0;
  letter-spacing: 0.04em;
}

.wb-concept-name {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: rgba(255,255,255,0.82);
  width: 160px;
  flex-shrink: 0;
}

.wb-concept-pages {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.wb-concept-page {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.5);
  border: 1px solid rgba(255,255,255,0.1);
  letter-spacing: 0.03em;
}

.wb-concept-page-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255,255,255,0.35);
  flex-shrink: 0;
}

.wb-concept-open {
  margin-left: auto;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: #4ADE80;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s ease, gap 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.wb-concept-row:hover .wb-concept-open {
  color: #86EFAC;
  gap: 8px;
}

@media (max-width: 760px) {
  .wb-project-top { flex-direction: column; }
  .wb-project-top-aside {
    width: 100%;
    border-left: none;
    border-top: 1px solid rgba(255,255,255,0.08);
    flex-direction: row;
    align-items: center;
  }
  .wb-aside-value { font-size: 36px; }
  .wb-aside-cta { flex: 1; }
  .wb-concepts-table { padding: 8px 20px 16px; }
  .wb-concept-name { width: auto; flex: 1; }
  .wb-concept-pages { flex: unset; }
}

.wb-card-top {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.wb-card-body {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.wb-card-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.wb-card-title {
  font-family: 'DM Serif Display', Georgia, serif;
  font-style: italic;
  font-size: 22px;
  line-height: 1.2;
  color: rgba(255,255,255,0.92);
}

.wb-problem-statement {
  font-family: 'DM Serif Display', Georgia, serif;
  font-style: italic;
  font-size: 15px;
  line-height: 1.5;
  color: rgba(255,255,255,0.72);
  border-left: 2px solid var(--accent);
  padding-left: 12px;
}

.wb-card-desc {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.65;
  color: rgba(255,255,255,0.48);
}

.wb-meta {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255,255,255,0.28);
}

.wb-illo {
  width: 200px;
  flex-shrink: 0;
  border: 1px dashed rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 12px;
  background: rgba(255,255,255,0.02);
}

.wb-illo svg {
  display: block;
  width: 100%;
  height: auto;
}

.wb-card-stat {
  grid-column: span 4;
  background: var(--surface);
}

.wb-stat-label {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
  margin-top: 16px;
}

.wb-card-stat .wb-card-inner > .wb-stat-label:first-child {
  margin-top: 0;
}

.wb-stat-value {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 52px;
  line-height: 1;
  color: var(--ink);
  margin-top: 4px;
}

.wb-stat-item {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: var(--ink);
  margin-top: 4px;
}

.wb-stat-hr {
  border: none;
  border-top: 1px solid var(--border);
  margin-top: 14px;
}

.wb-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 4px;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.wb-badge-amber {
  background: rgba(212,134,10,0.18);
  color: var(--amber);
}

.wb-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.wb-tag {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.04em;
  padding: 3px 9px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: rgba(47,49,55,0.035);
  color: var(--muted);
}

.wb-tag-dark {
  border-color: rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.45);
}

.wb-cta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  color: var(--green);
  cursor: pointer;
  transition: gap 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.wb-arrow {
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.wb-card-empty {
  grid-column: span 12;
  border-style: dashed;
  border-color: var(--border);
  background: transparent;
  padding: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: default;
}

.wb-empty-icon {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 28px;
  color: var(--muted);
  opacity: 0.4;
}

.wb-empty-text {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
}

.wb-card-ghost {
  grid-column: span 4;
  background: transparent;
  border-color: var(--border);
  padding: 24px;
  cursor: default;
}

.wb-ghost-illo {
  border: 1px dashed var(--border);
  border-radius: 8px;
  height: 80px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wb-ghost-illo::after {
  content: '+';
  font-family: 'DM Serif Display', serif;
  font-size: 24px;
  color: var(--muted);
  opacity: 0.3;
}

.wb-ghost-line {
  height: 8px;
  background: var(--border);
  border-radius: 4px;
  margin-bottom: 8px;
}

.wb-ghost-line-short {
  width: 60%;
}

.wb-sticker {
  position: absolute;
  top: -6px;
  right: 20px;
  background: var(--amber);
  color: #fff;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 4px 10px;
  border-radius: 4px;
  transform: rotate(2deg);
  z-index: 2;
  box-shadow: 0 2px 8px rgba(212,134,10,0.35);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 760px) {
  .wb-card-stat,
  .wb-card-ghost {
    grid-column: span 12;
  }

  .wb-card-body {
    flex-direction: column;
  }

  .wb-illo {
    width: 100%;
  }

  .wb-title {
    font-size: clamp(36px, 8vw, 48px);
  }
}
</style>
