#!/usr/bin/env node
import { createInterface } from 'readline'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const configPath = resolve(root, 'app/app.config.ts')

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

console.log(`
Setup complete.

This hub deploys to GitHub Pages automatically via GitHub Actions —
every push to main is built and published. To go live:

  1. Enable GitHub Pages (one time):
       gh api repos/{owner}/{repo}/pages --method POST --field build_type=workflow
     (if Pages already exists, rerun with --method PUT)

  2. Commit and push:
       git add -A && git commit -m "Initial setup" && git push

  3. GitHub Actions builds and publishes on every push to main.
     Your hub will be live at https://<username>.github.io/<repo-name>/

Run npm run dev to start locally.
`)
