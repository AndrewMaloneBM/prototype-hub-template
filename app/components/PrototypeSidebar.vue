<script setup lang="ts">
import type { PreviewMode, PrototypeConcept } from '~/composables/usePrototypeSidebar'

const props = defineProps<{
  title: string
  concepts: readonly PrototypeConcept[]
  activeConcept: number
  previewMode: PreviewMode
  sidebarOpen: boolean
  activePageId: string
  activeSubStateId?: string
  droppedConcepts?: readonly number[]
  shareMode?: boolean
  hideConceptDetails?: boolean
}>()

const emit = defineEmits<{
  'update:activeConcept': [value: number]
  'update:previewMode': [value: PreviewMode]
  'update:sidebarOpen': [value: boolean]
  'update:activePageId': [value: string]
  'setSubState': [pageId: string, subStateId: string]
  'reset': []
}>()

const showResetTooltip = ref(false)
let resetTooltipTimer: ReturnType<typeof setTimeout> | null = null

function onResetHover() {
  resetTooltipTimer = setTimeout(() => { showResetTooltip.value = true }, 2000)
}
function onResetLeave() {
  if (resetTooltipTimer) { clearTimeout(resetTooltipTimer); resetTooltipTimer = null }
  showResetTooltip.value = false
}

const currentConcept = computed(() => {
  const c = props.concepts[props.activeConcept - 1] ?? props.concepts[0]
  if (!c) throw new Error('PrototypeSidebar requires at least one concept')
  return c
})

function allPageIds() {
  return (props.concepts[props.activeConcept - 1] ?? props.concepts[0]).pages.map(p => p.id)
}

// Accordion state — which page IDs are currently expanded
const expandedPageIds = ref<string[]>(props.shareMode ? allPageIds() : [props.activePageId])

// Auto-expand when active page changes (e.g. user navigates)
watch(() => props.activePageId, (id) => {
  if (id && !expandedPageIds.value.includes(id)) {
    expandedPageIds.value = [...expandedPageIds.value, id]
  }
})

// Reset accordion when switching concept — expand all in share mode, else only active page
watch(() => props.activeConcept, () => {
  nextTick(() => {
    expandedPageIds.value = props.shareMode ? allPageIds() : [props.activePageId]
  })
})

function toggleExpanded(pageId: string) {
  if (expandedPageIds.value.includes(pageId)) {
    expandedPageIds.value = expandedPageIds.value.filter(id => id !== pageId)
  } else {
    expandedPageIds.value = [...expandedPageIds.value, pageId]
  }
}

function navigateTo(pageId: string) {
  emit('update:activePageId', pageId)
  if (!expandedPageIds.value.includes(pageId)) {
    expandedPageIds.value = [...expandedPageIds.value, pageId]
  }
}

function navigateToSubState(pageId: string, subStateId: string) {
  if (!expandedPageIds.value.includes(pageId)) {
    expandedPageIds.value = [...expandedPageIds.value, pageId]
  }
  emit('setSubState', pageId, subStateId)
}

// Scroll fade — shows gradient when content is cut off below
const pageTreeEl = ref<HTMLElement | null>(null)
const zone2El = ref<HTMLElement | null>(null)
const pageTreeHasMore = ref(false)
const zone2HasMore = ref(false)

function checkScroll(el: HTMLElement | null, set: (v: boolean) => void) {
  if (!el) return
  set(el.scrollHeight > el.clientHeight + 4 && el.scrollTop < el.scrollHeight - el.clientHeight - 4)
}

onMounted(() => nextTick(() => {
  checkScroll(pageTreeEl.value, v => pageTreeHasMore.value = v)
  checkScroll(zone2El.value, v => zone2HasMore.value = v)
}))

watch(() => [props.activeConcept, props.activePageId], () => nextTick(() => {
  checkScroll(pageTreeEl.value, v => pageTreeHasMore.value = v)
  checkScroll(zone2El.value, v => zone2HasMore.value = v)
}))

watch(expandedPageIds, () => nextTick(() => {
  checkScroll(pageTreeEl.value, v => pageTreeHasMore.value = v)
}))
</script>

<template>
  <aside :class="[
    'prototype-chrome flex-shrink-0 flex flex-col bg-gray-950 border-r border-gray-800 transition-all duration-200 overflow-hidden',
    sidebarOpen ? 'w-72' : 'w-12'
  ]">

    <!-- Collapsed rail -->
    <div v-if="!sidebarOpen" class="flex flex-col items-center px-2 py-3 gap-1">
      <button @click="emit('update:sidebarOpen', true)" class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors rounded hover:bg-gray-800">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 3v18"/><path d="M11 9l3 3-3 3"/></svg>
      </button>
      <NuxtLink v-if="!shareMode" to="/" class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors rounded hover:bg-gray-800">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75v-5.25h-4.5V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z"/></svg>
      </NuxtLink>
      <template v-for="n in concepts.length" :key="n">
        <button
          v-if="!shareMode || !droppedConcepts?.includes(n)"
          :class="['relative overflow-hidden w-8 h-8 flex items-center justify-center text-xs rounded transition-colors', activeConcept === n ? 'bg-white text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-200 hover:bg-gray-800', droppedConcepts?.includes(n) ? 'opacity-50' : '']"
          @click="emit('update:activeConcept', n)"
        >
          {{ n }}
          <span v-if="droppedConcepts?.includes(n)" class="absolute inset-0 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" stroke="currentColor" stroke-width="8" stroke-linecap="round">
              <line x1="10" y1="10" x2="90" y2="90"/>
            </svg>
          </span>
        </button>
      </template>
    </div>

    <!-- Expanded sidebar -->
    <template v-else>

      <!-- Zone 1: Header -->
      <div class="sticky top-0 bg-gray-950 border-b border-gray-800 z-10 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <NuxtLink v-if="!shareMode" to="/" class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
          Hub
        </NuxtLink>
        <span v-else class="w-[42px]" />
        <slot name="title">
          <span class="text-xs font-semibold text-white tracking-wide">{{ title }}</span>
        </slot>
        <button @click="emit('update:sidebarOpen', false)" class="text-gray-500 hover:text-white transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 3v18"/><path d="M14 9l-3 3 3 3"/></svg>
        </button>
      </div>

      <!-- Zone 2: Controls -->
      <div
        ref="zone2El"
        :class="['px-4 py-4 space-y-4 relative', shareMode ? 'flex-1 overflow-y-auto' : hideConceptDetails ? 'flex-1 overflow-y-auto' : 'flex-shrink-0 border-b border-gray-800']"
        @scroll="checkScroll(zone2El, v => zone2HasMore = v)"
      >

        <!-- Share mode explainer -->
        <p v-if="shareMode" class="text-[11px] text-gray-500 leading-relaxed">Switch between concepts using the numbers below, then use the pages list to navigate screens. Use <span class="text-gray-300">Before / After</span> to toggle the current design against the existing experience.</p>

        <!-- Concept switcher — named labels mode (hideConceptDetails) -->
        <div v-if="hideConceptDetails" class="space-y-1.5">
          <div class="flex items-center mb-2">
            <p class="text-[10px] text-gray-600 uppercase tracking-widest mr-auto">Concept</p>
            <div class="relative" @mouseenter="onResetHover" @mouseleave="onResetLeave">
              <button @click="emit('reset')" class="p-1 rounded text-gray-600 hover:text-gray-300 hover:bg-gray-800 transition-colors">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
              </button>
              <div v-if="showResetTooltip" class="absolute right-0 top-6 z-20 bg-gray-700 text-white text-[11px] rounded px-2 py-1 whitespace-nowrap shadow-lg">Reset dismissed UI</div>
            </div>
          </div>
          <button
            v-for="(concept, i) in concepts"
            :key="i"
            :class="['w-full text-left px-3 py-2 rounded text-xs transition-colors', activeConcept === i + 1 ? 'bg-white text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-200 hover:bg-gray-800']"
            @click="emit('update:activeConcept', i + 1)"
          >
            {{ concept.name }}
          </button>
        </div>

        <!-- Concept switcher — standard numbered mode -->
        <div v-else>
          <div class="flex items-center gap-2 mb-2">
            <p class="text-[10px] text-gray-600 uppercase tracking-widest mr-auto">Concept</p>
            <div class="flex items-center gap-1 text-[10px]">
              <button :class="['transition-colors', previewMode === 'before' ? 'text-white font-semibold' : 'text-gray-600 hover:text-gray-400']" @click="emit('update:previewMode', 'before')">Before</button>
              <span class="text-gray-700">/</span>
              <button :class="['transition-colors', previewMode === 'after' ? 'text-white font-semibold' : 'text-gray-600 hover:text-gray-400']" @click="emit('update:previewMode', 'after')">After</button>
            </div>
            <div class="relative" @mouseenter="onResetHover" @mouseleave="onResetLeave">
              <button
                @click="emit('reset')"
                class="p-1 rounded text-gray-600 hover:text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
              </button>
              <div
                v-if="showResetTooltip"
                class="absolute right-0 top-6 z-20 bg-gray-700 text-white text-[11px] rounded px-2 py-1 whitespace-nowrap shadow-lg"
              >
                Reset dismissed UI
              </div>
            </div>
          </div>
          <div class="flex gap-1">
            <template v-for="n in concepts.length" :key="n">
              <button
                v-if="!shareMode || !droppedConcepts?.includes(n)"
                :class="['relative overflow-hidden rounded px-3 py-1.5 text-xs transition-colors', activeConcept === n ? 'bg-white text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-200 hover:bg-gray-800', droppedConcepts?.includes(n) ? 'opacity-50' : '']"
                @click="emit('update:activeConcept', n)"
              >
                {{ n }}
                <span v-if="droppedConcepts?.includes(n)" class="absolute inset-0 pointer-events-none">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" stroke="currentColor" stroke-width="8" stroke-linecap="round">
                    <line x1="10" y1="10" x2="90" y2="90"/>
                  </svg>
                </span>
              </button>
            </template>
          </div>
        </div>

        <!-- Pages tree -->
        <div>
          <p class="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Pages (What's New)</p>
          <div class="relative">
          <div
            ref="pageTreeEl"
            :class="['space-y-px pr-0.5', !shareMode && !hideConceptDetails && 'max-h-[320px] overflow-y-auto']"
            @scroll="checkScroll(pageTreeEl, v => pageTreeHasMore = v)"
          >
            <div v-for="page in currentConcept.pages" :key="page.id">

              <!-- Simple page (no sub-states): direct nav -->
              <template v-if="!page.subStates?.length">
                <button
                  :class="[
                    'w-full flex items-center gap-2 rounded px-2 py-1.5 transition-colors text-left',
                    activePageId === page.id ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/60'
                  ]"
                  @click="navigateTo(page.id)"
                >
                  <span :class="['w-1.5 h-1.5 rounded-full flex-shrink-0', activePageId === page.id ? 'bg-green-400' : 'bg-gray-700']" />
                  <span :class="['text-xs', activePageId === page.id ? 'font-medium' : '']">{{ page.label }}</span>
                </button>
              </template>

              <!-- Page with sub-states: accordion header + navigable sub-items -->
              <template v-else>
                <div :class="['flex items-center gap-2 rounded px-2 py-1.5 transition-colors', activePageId === page.id ? 'text-white' : 'text-gray-500 hover:text-gray-300']">
                  <button class="flex items-center gap-2 flex-1 min-w-0 text-left" @click="navigateTo(page.id)">
                    <span :class="['w-1.5 h-1.5 rounded-full flex-shrink-0', activePageId === page.id ? 'bg-green-400' : 'bg-gray-700']" />
                    <span :class="['text-xs truncate', activePageId === page.id ? 'font-medium' : '']">{{ page.label }}</span>
                  </button>
                  <button class="flex-shrink-0 p-0.5 text-gray-700 hover:text-gray-400 transition-colors" @click="toggleExpanded(page.id)">
                    <svg class="w-3 h-3 transition-transform duration-150" :class="expandedPageIds.includes(page.id) ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>

                <!-- Sub-state items -->
                <div v-if="expandedPageIds.includes(page.id)" class="ml-4 mt-px mb-1 space-y-px">
                  <button
                    v-for="sub in page.subStates"
                    :key="sub.id"
                    :class="[
                      'w-full text-left flex items-center gap-2 px-2 py-1 rounded transition-colors',
                      activeSubStateId === sub.id
                        ? 'bg-white/10 text-white'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/60'
                    ]"
                    @click="navigateToSubState(page.id, sub.id)"
                  >
                    <span :class="['w-1 h-1 rounded-full flex-shrink-0', activeSubStateId === sub.id ? 'bg-green-400' : 'bg-gray-700']" />
                    <span class="text-[11px]">{{ sub.label }}</span>
                  </button>
                </div>
              </template>

            </div>
          </div>
          <!-- Internal: page tree scroll fade -->
          <div v-if="!shareMode && pageTreeHasMore" class="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none flex items-end justify-center pb-1">
            <div class="flex flex-col items-center gap-0.5">
              <svg class="w-3.5 h-3.5 text-gray-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
              <span class="text-[9px] text-gray-600 uppercase tracking-widest">Scroll</span>
            </div>
          </div>
          </div>
        </div>

        <!-- External: Zone 2 scroll fade -->
        <div v-if="shareMode && zone2HasMore" class="sticky bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none -mt-10 mb-0" />

      </div>

      <!-- Zone 3: Concept details — internal only -->
      <div v-if="!shareMode && !hideConceptDetails" class="flex-1 overflow-y-auto px-4 py-5 space-y-5 bg-gray-900">

        <div>
          <p class="text-[10px] text-gray-600 uppercase tracking-widest mb-1.5">Concept {{ activeConcept }}</p>
          <p class="text-sm font-semibold text-white mb-2">{{ currentConcept.name }}</p>
          <span class="inline-block text-[10px] text-green-500 font-medium bg-green-500/10 px-2 py-0.5 rounded">{{ currentConcept.prdFeature }}</span>
        </div>

        <div class="border-t border-gray-800 pt-4">
          <p class="text-[10px] text-gray-600 uppercase tracking-widest mb-3">What's new</p>
          <div v-for="page in currentConcept.pages" :key="page.id" class="mb-3 last:mb-0">
            <p class="text-[10px] text-gray-600 mb-1.5">{{ page.label }}</p>
            <ul class="space-y-1">
              <li v-for="change in page.changes" :key="change" class="flex items-start gap-1.5 text-[12px] text-gray-400 leading-snug">
                <span class="text-gray-600 flex-shrink-0">·</span>
                {{ change }}
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 pt-4">
          <p class="text-[10px] text-gray-600 uppercase tracking-widest mb-3">Pros / Cons</p>
          <ul class="space-y-2">
            <li v-for="pro in currentConcept.pros" :key="pro" class="flex items-start gap-2 text-[12px] text-gray-400 leading-snug">
              <span class="text-green-500 flex-shrink-0 font-bold leading-none mt-px">+</span>
              {{ pro }}
            </li>
            <li v-for="con in currentConcept.cons" :key="con" class="flex items-start gap-2 text-[12px] text-gray-400 leading-snug">
              <span class="text-red-400 flex-shrink-0 font-bold leading-none mt-px">−</span>
              {{ con }}
            </li>
          </ul>
        </div>

        <div class="border-t border-gray-800 pt-4">
          <p class="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Success metric</p>
          <p class="text-[12px] text-gray-300 leading-relaxed">{{ currentConcept.prdMetric }}</p>
        </div>

      </div>

    </template>
  </aside>
</template>
