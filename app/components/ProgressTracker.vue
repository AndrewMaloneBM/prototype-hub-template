<script setup lang="ts">
// Horizontal step indicator for multi-step flows (onboarding, checkout, KYB…).
// Usage:
//   <ProgressTracker :steps="['Details', 'Review', 'Submit']" :current="2" />
//   <ProgressTracker :steps="[...]" :current="3" processing />  // final step spinning
//
// `current` is 1-based. Pass `processing` while the final step is doing async
// work — it shows a spinner on the current step instead of a check/number.
const props = withDefaults(defineProps<{
  steps: readonly string[]
  current: number
  processing?: boolean
}>(), {
  processing: false,
})

function state(i: number): 'done' | 'current' | 'upcoming' {
  const n = i + 1
  if (n < props.current) return 'done'
  if (n === props.current) return 'current'
  return 'upcoming'
}
</script>

<template>
  <ol class="flex items-center w-full">
    <li
      v-for="(step, i) in steps"
      :key="step"
      class="flex items-center"
      :class="i < steps.length - 1 ? 'flex-1' : ''"
    >
      <div class="flex items-center gap-2">
        <span
          :class="[
            'flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold flex-shrink-0 transition-colors',
            state(i) === 'done' ? 'bg-bm-success text-white'
              : state(i) === 'current' ? 'bg-bm-text-hi text-white'
              : 'bg-bm-gray-100 text-bm-text-muted',
          ]"
        >
          <!-- processing spinner on the current step -->
          <svg v-if="state(i) === 'current' && processing" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <!-- check when done -->
          <svg v-else-if="state(i) === 'done'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <!-- otherwise the step number -->
          <template v-else>{{ i + 1 }}</template>
        </span>
        <span
          :class="[
            'text-xs whitespace-nowrap',
            state(i) === 'upcoming' ? 'text-bm-text-muted' : 'text-bm-text-hi font-medium',
          ]"
        >{{ step }}</span>
      </div>
      <!-- connector -->
      <span
        v-if="i < steps.length - 1"
        :class="['flex-1 h-px mx-3', state(i) === 'done' ? 'bg-bm-success' : 'bg-bm-border']"
      />
    </li>
  </ol>
</template>
