import { nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

export type PreviewMode = 'before' | 'after'

export interface PrototypeSubState {
  id: string
  label: string
}

export interface PrototypePage {
  id: string
  label: string
  navItem: string
  changes: string[]
  subStates?: PrototypeSubState[]
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

  const showHotspots = ref(false)
  let hotspotFlashTimer: ReturnType<typeof setTimeout> | null = null

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
    showHotspots,
    flashHotspots,
  }
}
