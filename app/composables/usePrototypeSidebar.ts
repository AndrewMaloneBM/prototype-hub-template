import { nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export type PreviewMode = 'before' | 'after'

export interface PrototypePage {
  id: string
  label: string
  navItem: string
  changes: string[]
}

export interface PrototypeConcept {
  name: string
  prdFeature: string
  prdMetric: string
  pros: string[]
  cons: string[]
  pages: PrototypePage[]
}

export function usePrototypeSidebar(conceptMeta: readonly PrototypeConcept[]) {
  const sidebarOpen = ref(true)
  const previewMode = ref<PreviewMode>('after')
  const activeConcept = ref(1)

  const activePages = ref<string[]>(conceptMeta.map(c => c.pages[0]?.id ?? ''))
  const conceptTabs = ref<string[]>(conceptMeta.map(() => 'Your wallet'))

  const showHotspots = ref(false)
  let hotspotFlashTimer: ReturnType<typeof setTimeout> | null = null

  const showResetTooltip = ref(false)
  let resetTooltipTimer: ReturnType<typeof setTimeout> | null = null

  function onResetHover() {
    resetTooltipTimer = setTimeout(() => { showResetTooltip.value = true }, 2000)
  }
  function onResetLeave() {
    if (resetTooltipTimer) { clearTimeout(resetTooltipTimer); resetTooltipTimer = null }
    showResetTooltip.value = false
  }

  function flashHotspots(e: MouseEvent) {
    if ((e.target as Element).closest('.prototype-hotspot')) return
    if (hotspotFlashTimer) clearTimeout(hotspotFlashTimer)
    showHotspots.value = false
    nextTick(() => {
      showHotspots.value = true
      hotspotFlashTimer = setTimeout(() => {
        showHotspots.value = false
        hotspotFlashTimer = null
      }, 1100)
    })
  }

  // When switching back to 'before', drop any after-only sub-tabs (e.g. concept 2 "Daily payout")
  watch(previewMode, (mode) => {
    if (mode !== 'before') return
    conceptTabs.value = conceptTabs.value.map(tab =>
      tab === 'Daily payout' ? 'Your wallet' : tab,
    )
  })

  const route = useRoute()
  onMounted(() => {
    const c = Number(route.query.concept)
    if (c >= 1 && c <= conceptMeta.length) activeConcept.value = c
  })

  return {
    sidebarOpen,
    previewMode,
    activeConcept,
    activePages,
    conceptTabs,
    showHotspots,
    flashHotspots,
    showResetTooltip,
    onResetHover,
    onResetLeave,
  }
}
