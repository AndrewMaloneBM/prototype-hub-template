<script setup lang="ts">
import type { PrototypeConcept } from '~/composables/usePrototypeSidebar'

definePageMeta({ layout: false })

const conceptMeta: readonly PrototypeConcept[] = [
  {
    name: 'Concept A',
    prdFeature: 'PRD ref — feature name',
    prdMetric: 'Success metric and target.',
    pros: ['Pro bullet'],
    cons: ['Con bullet'],
    pages: [
      {
        id: 'home',
        label: 'Home',
        navItem: 'Home',
        changes: ['What changed on this page'],
        // Sub-states: only add these when the page has multiple distinct
        // UI states worth jumping to directly (modals, panels, step flows,
        // different status screens). Omit subStates entirely for simple pages.
        subStates: [
          { id: 'home-default', label: 'Default view' },
          { id: 'home-alternate', label: 'Alternate state' },
        ],
      },
      {
        id: 'money',
        label: 'Money',
        navItem: 'Money',
        changes: ['What changed on this page'],
        // Simple page — no subStates needed
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
function setActivePage(id: string) {
  activePages.value[activeConcept.value - 1] = id
}

// Example transient UI state your prototype owns
const showModal = ref(false)
const currentStep = ref<1 | 2 | 3>(1)

// activeSubStateId: a computed that derives the sidebar highlight from your
// prototype's own reactive state. This keeps the sidebar perfectly in sync
// whether the user clicks the sidebar OR interacts with the prototype itself.
const activeSubStateId = computed(() => {
  const page = activePageId.value
  if (page === 'home') {
    // Map your reactive state to the sub-state IDs you defined above
    return showModal.value ? 'home-alternate' : 'home-default'
  }
  return ''
})

// onSetSubState: fired when the user clicks a sub-item in the sidebar.
// Set your reactive state here to trigger the right UI.
function onSetSubState(_pageId: string, subStateId: string) {
  // Reset transient UI first
  showModal.value = false
  currentStep.value = 1

  switch (subStateId) {
    case 'home-default':
      setActivePage('home')
      break
    case 'home-alternate':
      setActivePage('home')
      showModal.value = true
      break
  }
}

function resetDismissedUi() {
  showModal.value = false
  currentStep.value = 1
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
      <div class="absolute inset-0 overflow-y-auto bg-gray-50" @click="flashHotspots">
        <div v-show="activeConcept === 1">
          <!-- Build your concept here, optionally using <BmShell> -->
        </div>
      </div>

      <!-- Modals and panels go here as absolute siblings of the scroll div,
           NOT inside it. This scopes them to the prototype area and prevents
           them from overlaying the sidebar. Use v-if, not Teleport. -->
      <!-- Example:
      <div v-if="showModal" class="absolute inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
          Modal content here
        </div>
      </div>
      -->
    </div>
  </div>
</template>

<style>
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
