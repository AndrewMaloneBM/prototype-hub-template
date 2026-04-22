#!/usr/bin/env node
// Usage: npm run new-prototype -- "my-prototype-name"
import { writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const name = process.argv[2]

if (!name) {
  console.error('Usage: npm run new-prototype -- <prototype-name>')
  process.exit(1)
}

const slug = name.toLowerCase().replace(/\s+/g, '-')
const title = name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
const date = new Date().toISOString().slice(0, 10)
const dest = join(__dirname, `../app/pages/prototypes/${slug}.vue`)

if (existsSync(dest)) {
  console.error(`Already exists: ${dest}`)
  process.exit(1)
}

const content = `<script setup lang="ts">
const meta = {
  title: '${title}',
  description: '',
  author: 'Andrew Malone',
  date: '${date}',
  status: 'draft' as 'draft' | 'review' | 'done',
}
</script>

<template>
  <div class="min-h-screen">
    <div class="bg-bm-gray-100 border-b border-bm-gray-200 px-6 py-2 flex items-center gap-3 text-xs text-bm-gray-500">
      <NuxtLink to="/" class="hover:text-bm-black transition-colors">← Hub</NuxtLink>
      <span>/</span>
      <span class="text-bm-black font-medium">{{ meta.title }}</span>
      <span class="ml-auto">{{ meta.date }}</span>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Your prototype here -->
    </div>
  </div>
</template>
`

writeFileSync(dest, content)
console.log(`Created: app/pages/prototypes/${slug}.vue`)
console.log(`Register it in app/pages/index.vue → prototypes array.`)
