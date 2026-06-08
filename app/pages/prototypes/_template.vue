<script setup lang="ts">
// ─── PROTOTYPE TEMPLATE ──────────────────────────────────────────────────────
// A working reference, not just a skeleton. Everything below runs as-is —
// duplicate this file via `npm run new-prototype -- "name"`, then replace the
// placeholder content. The patterns demonstrated here (sub-state dispatcher,
// pendingAction loading, scroll-to-top, modal-as-sibling) are the ones that
// recurred across every real prototype, so they're wired up for you.
// ─────────────────────────────────────────────────────────────────────────────
import type { PrototypeConcept } from '~/composables/usePrototypeSidebar'

definePageMeta({ layout: false })

// ─── CONCEPTS ────────────────────────────────────────────────────────────────
// One entry per concept you want to compare. Sidebar pills + page navigation
// are generated from this automatically. Each page can declare subStates[] for
// distinct UI states worth jumping to directly (a modal open, a status screen).
const conceptMeta: readonly PrototypeConcept[] = [
  {
    name: 'Concept A',
    prdFeature: 'PRD ref — feature name',
    prdMetric: 'Describe the success metric for this concept.',
    pros: ['Why this approach works'],
    cons: ['What it trades off'],
    pages: [
      {
        id: 'home',
        label: 'Home',
        navItem: 'Home',
        changes: ['What changed on this page'],
        subStates: [
          { id: 'home-default', label: 'Default view' },
          { id: 'home-modal-open', label: 'Confirm modal open' },
        ],
      },
      {
        id: 'settings',
        label: 'Settings',
        navItem: 'Settings',
        changes: ['What changed on this page'],
      },
    ],
  },
  {
    name: 'Concept B',
    prdFeature: 'PRD ref — alternative approach',
    prdMetric: 'Describe the success metric for this concept.',
    pros: ['Why this approach works'],
    cons: ['What it trades off'],
    pages: [
      {
        id: 'home',
        label: 'Home',
        navItem: 'Home',
        changes: ['What changed on this page'],
      },
    ],
  },
]

const {
  sidebarOpen,
  previewMode,
  activeConcept,
  activePages,
  flashHotspots,
  showHotspots,
} = usePrototypeSidebar(conceptMeta)

const activePageId = computed(() => activePages.value[activeConcept.value - 1] ?? '')

// ─── BmShell driving state ───────────────────────────────────────────────────
const navItems = ['Home', 'Orders', 'Settings'] as const
const activeNavItem = computed(() =>
  conceptMeta[activeConcept.value - 1]?.pages.find(p => p.id === activePageId.value)?.navItem ?? 'Home',
)
const tabs = ['Overview', 'Details', 'Activity'] as const
const activeTab = ref<string>('Overview')
// Example: put a green dot on a tab (e.g. one with new content).
const tabDotPredicate = (tab: string) => tab === 'Activity'

// ─── Transient UI + scroll ───────────────────────────────────────────────────
const showModal = ref(false)
const scrollContainerRef = ref<HTMLElement | null>(null)
function scrollPageToTop() {
  scrollContainerRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

// ─── pendingAction loading convention ────────────────────────────────────────
// One ref tracks which button is mid-async, so you can disable it and show a
// spinner. advanceWithDelay() fakes latency, then runs the action.
const pendingAction = ref<string | null>(null)
function advanceWithDelay(key: string, action: () => void, ms = 900) {
  pendingAction.value = key
  setTimeout(() => {
    action()
    pendingAction.value = null
  }, ms)
}

// ─── Page navigation ─────────────────────────────────────────────────────────
function setActivePage(id: string) {
  activePages.value[activeConcept.value - 1] = id
  showModal.value = false       // close transient UI on nav
  scrollPageToTop()
}

// ─── SUB-STATE WIRING ────────────────────────────────────────────────────────
// activeSubStateId MUST be a computed (not a ref): it derives the current
// sub-state from your own reactive state, so the sidebar stays highlighted
// whether the user clicks the sidebar OR interacts with the prototype directly.
const activeSubStateId = computed(() => {
  if (activePageId.value === 'home') {
    return showModal.value ? 'home-modal-open' : 'home-default'
  }
  return ''
})

// onSetSubState fires when a sidebar sub-item is clicked. Reset transient UI,
// then set the state that corresponds to the requested sub-state ID.
function onSetSubState(pageId: string, subStateId: string) {
  setActivePage(pageId)
  switch (subStateId) {
    case 'home-default':    showModal.value = false; break
    case 'home-modal-open': showModal.value = true; break
  }
}

function resetDismissedUi() {
  // Re-show anything the user dismissed (banners, panels). Reset transient UI here.
  showModal.value = false
}
</script>

<template>
  <div :class="['flex h-screen overflow-hidden font-body', showHotspots ? 'prototype-hotspots' : '']">
    <PrototypeSidebar
      title="Your Prototype Title"
      :concepts="conceptMeta"
      :active-concept="activeConcept"
      :preview-mode="previewMode"
      :sidebar-open="sidebarOpen"
      :active-page-id="activePageId"
      :active-sub-state-id="activeSubStateId"
      @update:active-concept="activeConcept = $event"
      @update:preview-mode="previewMode = $event"
      @update:sidebar-open="sidebarOpen = $event"
      @update:active-page-id="setActivePage"
      @set-sub-state="onSetSubState"
      @reset="resetDismissedUi"
    />

    <div class="flex-1 relative overflow-hidden">
      <!-- The single scrollable surface. Modals are siblings of THIS div. -->
      <div ref="scrollContainerRef" class="absolute inset-0 overflow-y-auto bg-gray-50" @click="flashHotspots">

        <!-- ── CONCEPT 1 ─────────────────────────────────────────────────── -->
        <div v-show="activeConcept === 1">
          <BmShell
            :nav-items="navItems"
            :active-nav-item="activeNavItem"
            seller-name="Example Seller"
            :page-title="activeNavItem"
            :tabs="tabs"
            :tab-dot-predicate="tabDotPredicate"
            :active-tab="activeTab"
            @update:active-tab="activeTab = $event"
          >
            <!-- header-actions slot: controls aligned with the page title -->
            <template #header-actions>
              <button
                class="btn-primary prototype-hotspot"
                :disabled="pendingAction === 'confirm'"
                @click="advanceWithDelay('confirm', () => (showModal = true))"
              >
                <svg v-if="pendingAction === 'confirm'" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                {{ pendingAction === 'confirm' ? 'Working…' : 'Primary action' }}
              </button>
            </template>

            <!-- Tab content -->
            <div class="py-8 text-bm-text-mid">
              <p class="text-sm">Concept A · {{ activeNavItem }} · {{ activeTab }} tab.</p>
              <p class="mt-2 text-sm">Replace this with your screens. Click "Primary action" to see the loading + modal pattern.</p>
            </div>
          </BmShell>
        </div>

        <!-- ── CONCEPT 2 ─────────────────────────────────────────────────── -->
        <div v-show="activeConcept === 2">
          <BmShell
            :nav-items="navItems"
            :active-nav-item="activeNavItem"
            seller-name="Example Seller"
            :page-title="activeNavItem"
          >
            <div class="px-8 py-8 text-bm-text-mid">
              <p class="text-sm">Concept B — an alternative direction. Build its screens here.</p>
            </div>
          </BmShell>
        </div>

      </div>

      <!-- ── MODALS & PANELS ──────────────────────────────────────────────────
           Siblings of the scroll div (not inside it) so they scope to the
           prototype area, never the viewport. absolute inset-0 + <Transition>.
           Never use <Teleport to="body"> or position: fixed. -->
      <Transition name="modal">
        <div v-if="showModal" class="absolute inset-0 z-50 bg-black/40 flex items-center justify-center p-4" @click.self="showModal = false">
          <div class="card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 class="text-lg font-semibold text-bm-text-hi">Confirm action</h2>
            <p class="mt-2 text-sm text-bm-text-mid">This modal is a sibling of the scroll surface — it covers the prototype area only, not the sidebar.</p>
            <div class="mt-6 flex justify-end gap-2">
              <button class="btn-secondary" @click="showModal = false">Cancel</button>
              <button class="btn-primary" @click="showModal = false">Confirm</button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style>
/* Modal transition */
.modal-enter-active,
.modal-leave-active { transition: opacity 150ms ease; }
.modal-enter-from,
.modal-leave-to { opacity: 0; }

/* Hotspot flash — add class="prototype-hotspot" to any clickable element to
   make it flash when the user clicks empty space in the prototype area. */
.prototype-hotspot {
  position: relative;
}

.prototype-hotspot::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgba(13, 153, 255, 0.25);
  border-radius: 0;
  pointer-events: none;
  opacity: 0;
  z-index: 10;
}

.prototype-hotspots .prototype-hotspot::before {
  animation: figmaHotspotFlash 1000ms ease-out forwards;
}

@keyframes figmaHotspotFlash {
  0%   { opacity: 0; }
  15%  { opacity: 1; }
  70%  { opacity: 1; }
  100% { opacity: 0; }
}
</style>
