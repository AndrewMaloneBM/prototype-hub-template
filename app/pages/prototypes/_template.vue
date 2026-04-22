<script setup lang="ts">
// ─── CONCEPTS ────────────────────────────────────────────────────────────────
// Add one entry to conceptMeta[] per concept you want to compare.
// The sidebar pills and page navigation are generated automatically.
//
// For each concept you add here, add a matching content block in the template:
//   <div v-show="activeConcept === N"> ... </div>
//
// Pages: list every page your concept touches. If a page has multiple
// distinct UI states worth navigating to directly (a modal at step 3,
// a slide-in panel, a status screen), add subStates[] to that page — see
// the sub-state wiring section below for the full pattern.
// ─────────────────────────────────────────────────────────────────────────────
import type { PrototypeConcept } from '~/composables/usePrototypeSidebar'

definePageMeta({ layout: false })

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
        // subStates are optional. Add them when a page has multiple distinct
        // UI states worth jumping to from the sidebar. Remove this property
        // entirely if the page has only one view.
        //
        // subStates: [
        //   { id: 'home-default', label: 'Default view' },
        //   { id: 'home-modal-open', label: 'Modal open' },
        // ],
      },
      {
        id: 'money',
        label: 'Money',
        navItem: 'Money',
        changes: ['What changed on this page'],
      },
    ],
  },
  // ─── TO ADD CONCEPT 2 ──────────────────────────────────────────────────────
  // Duplicate this block, increment the v-show number in the template,
  // and fill in the concept details.
  //
  // {
  //   name: 'Concept B',
  //   prdFeature: 'PRD ref — feature name',
  //   prdMetric: 'Describe the success metric for this concept.',
  //   pros: ['Why this approach works'],
  //   cons: ['What it trades off'],
  //   pages: [
  //     {
  //       id: 'home',
  //       label: 'Home',
  //       navItem: 'Home',
  //       changes: ['What changed on this page'],
  //     },
  //   ],
  // },
  // ──────────────────────────────────────────────────────────────────────────
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

// ─── SUB-STATE WIRING (only needed if you defined subStates on any page) ─────
//
// activeSubStateId: a computed that maps your prototype's reactive state to
// a sub-state ID. The sidebar uses this to highlight the correct item.
// It must be a computed — not a ref — so it stays in sync when the user
// interacts with the prototype directly, not just when they click the sidebar.
//
// const activeSubStateId = computed(() => {
//   const page = activePageId.value
//   if (page === 'home') {
//     return showModal.value ? 'home-modal-open' : 'home-default'
//   }
//   return ''
// })
//
// onSetSubState: fired when the user clicks a sub-item in the sidebar.
// Reset transient UI first, then trigger the state that matches the sub-state ID.
//
// function onSetSubState(_pageId: string, subStateId: string) {
//   showModal.value = false  // reset transient UI
//   switch (subStateId) {
//     case 'home-default':    setActivePage('home'); break
//     case 'home-modal-open': setActivePage('home'); showModal.value = true; break
//   }
// }
// ─────────────────────────────────────────────────────────────────────────────

function resetDismissedUi() {
  // Reset any dismissible UI state your prototype owns (banners, panels, etc.)
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
      @update:active-concept="activeConcept = $event"
      @update:preview-mode="previewMode = $event"
      @update:sidebar-open="sidebarOpen = $event"
      @update:active-page-id="setActivePage"
      @reset="resetDismissedUi"
    />
    <!--
      If using sub-states, also add to <PrototypeSidebar>:
      :active-sub-state-id="activeSubStateId"
      @set-sub-state="onSetSubState"
    -->

    <div class="flex-1 relative overflow-hidden">
      <div class="absolute inset-0 overflow-y-auto bg-gray-50" @click="flashHotspots">

        <!-- ── CONCEPT 1 ─────────────────────────────────────────────────── -->
        <div v-show="activeConcept === 1">
          <!-- Build your concept 1 screens here, optionally using <BmShell> -->
        </div>

        <!-- ── CONCEPT 2 (uncomment when ready) ─────────────────────────── -->
        <!-- <div v-show="activeConcept === 2"> -->
        <!--   Build your concept 2 screens here -->
        <!-- </div> -->

      </div>

      <!-- ── MODALS & PANELS ──────────────────────────────────────────────────
           Place modals and slide-in panels HERE — as siblings of the scroll
           div, not inside it. This scopes them to the prototype area only
           and prevents them from overlaying the sidebar.
           Use v-if + absolute inset-0. Never use <Teleport to="body">.

      <div v-if="showModal" class="absolute inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
          Modal content here
        </div>
      </div>
      ─────────────────────────────────────────────────────────────────────── -->
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
