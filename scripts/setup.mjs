#!/usr/bin/env node
import { createInterface } from 'readline'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const configPath = resolve(root, 'app.config.ts')

const config = readFileSync(configPath, 'utf8')

if (!config.includes('__TEAM_NAME__')) {
  console.log('Already configured. Run npm run dev to start.')
  process.exit(0)
}

const rl = createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise(res => rl.question(q, res))

console.log('\nPrototype Hub — first-time setup\n')

const designerName = (await ask('Your name: ')).trim()
const teamName     = (await ask('Team name (e.g. Seller XP, Growth, Trust): ')).trim()
const slug         = teamName.toLowerCase().replace(/\s+/g, '-')

rl.close()

const updated = config
  .replace(/__TEAM_NAME__/g,    teamName)
  .replace(/__DESIGNER_NAME__/g, designerName)
  .replace(/__TEAM_SLUG__/g,    slug)

writeFileSync(configPath, updated)

console.log('\nHub configured.')

if (!existsSync(resolve(root, 'node_modules'))) {
  console.log('Installing dependencies...')
  execSync('npm install', { cwd: root, stdio: 'inherit' })
}

const rl2 = createInterface({ input: process.stdin, output: process.stdout })
const ask2 = (q) => new Promise(res => rl2.question(q, res))

const deploy = (await ask2('\nDeploy to Vercel now? (y/n): ')).trim().toLowerCase()
rl2.close()

if (deploy === 'y') {
  try {
    execSync('vercel --prod', { cwd: root, stdio: 'inherit' })
  } catch {
    console.log('\nVercel CLI not found. Run: npm i -g vercel, then: vercel --prod')
  }
} else {
  console.log('\nWhen ready: vercel --prod')
}

console.log('\nDone. Run npm run dev to start locally.')
