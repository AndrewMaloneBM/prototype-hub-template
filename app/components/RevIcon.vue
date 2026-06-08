<script setup lang="ts">
// Renders a Revolve icon from public/icons/.
// Usage: <RevIcon name="IconAlert" class="w-4 h-4" />
defineProps<{ name: string; class?: string }>()
</script>

<template>
  <img :src="`/icons/${name}.svg`" :class="$props.class" aria-hidden="true" />
</template>
