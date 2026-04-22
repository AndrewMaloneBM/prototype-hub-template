# Prototype Hub

A code-based prototyping workspace for product designers. Build and share interactive Back Market prototypes — no coding required.

> This setup takes about 10 minutes and only happens once. After that, you just talk to Claude.

---

## Before you start — install the tools

You need three things on your Mac before you can use this. If you've done this before, skip ahead.

---

### 1. A GitHub account

You need a GitHub account to use this template. If you don't have one, [sign up here](https://github.com/signup) — it's free.

---

### 2. Node.js

Node.js lets you install developer tools like Claude Code.

**First, open Terminal on your Mac:**
Press `Cmd + Space`, type `Terminal`, and press `Enter`. A black or white window will appear — that's the Terminal. Keep it open for the rest of the setup.

**Check if you already have Node.js** — paste this into Terminal and press Enter:
```
node --version
```
- You see a version number like `v20.11.0` → you already have it, skip to section 3.
- You see `command not found` → install it below.

**Install Node.js:**

Check if you have Homebrew (the standard Mac package installer):
```
brew --version
```

- You see a version number → run this to install Node.js:
```
brew install node
```

- You see `command not found` → install Homebrew first by pasting this into Terminal and pressing Enter:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
It will ask for your Mac password at one point — this is normal, type it and press Enter. When it's done, install Node.js:
```
brew install node
```

Once it finishes, run `node --version` to confirm it worked. You should see a version number.

---

### 3. Claude Code

Claude Code is the AI assistant that runs everything in this hub. You install it once from the Terminal.

**Check if you already have Claude Code** — paste this into Terminal and press Enter:
```
claude --version
```
- If you see a version number (like `1.2.3`) → you already have it, move on to Setup below.
- If you see an error → run this to install it:

```
npm install -g @anthropic-ai/claude-code
```

Wait for it to finish (it takes 30–60 seconds), then move on.

---

## Setup — do this once

### Step 1 — Create your own copy of the hub

1. At the top of this page on GitHub, click the green **"Use this template"** button
2. In the dropdown, click **"Create a new repository"**
3. Give it a name — something like `[your team]-hub` or `design-prototypes`
4. Leave everything else as default and click **"Create repository"**

You now have your own copy of the hub on GitHub.

---

### Step 2 — Download it to your Mac

1. On your new repository page, click the green **"Code"** button
2. Make sure **"HTTPS"** is selected in the tab at the top of the dropdown
3. Click the **copy icon** next to the URL to copy it
4. Open Terminal and paste the following, replacing `PASTE_URL_HERE` with the URL you just copied:

```
git clone PASTE_URL_HERE
```

Press Enter and wait a few seconds. This downloads the project to your Mac.

---

### Step 3 — Open it with Claude Code

When you ran `git clone` in the previous step, it downloaded a copy of your repo as a folder on your Mac. You can find it in Finder — it will be in your home folder (the one with your name on it) and named after your repo.

In Terminal, type `cd ` (with a space after it), then drag that folder from Finder into the Terminal window — it will fill in the path automatically. Press Enter.

Then run:
```
claude
```

Claude Code will open inside the Terminal window.

---

### Step 4 — Tell Claude to set everything up

Type the following and press Enter:

```
set me up
```

Claude will ask for your name and your team name. Answer those two questions, then sit back — it handles everything else from there (installing dependencies, configuring the hub, and deploying it live).

**You won't need to touch the terminal again after this.**

---

## Daily use

Each time you want to work, open Terminal, drag your project folder in, run `claude`, and then just tell Claude what you need.

**Starting a session:**
> *"Start the dev server"*

This opens a local preview of your hub in the browser so you can see changes as you make them.

**Creating a new prototype:**
> *"Create a new prototype called payments-redesign"*

Share your PRD or brief and Claude will build it out.

**When you're ready to share:**
> *"Deploy"*

Claude pushes your changes to GitHub. GitHub Actions automatically builds and publishes your hub to GitHub Pages — usually live within a minute. Your hub URL stays the same every time: `https://[your-username].github.io/[your-repo-name]/`. Share that link with your team.

---

## Adding a prototype

Tell Claude: **"create a new prototype for [your project]"** and share your PRD. Claude will scaffold the file, help you fill in the concept data, build the shell, and deploy when you're ready.

---

## Working with concepts

A prototype can have any number of concepts — 1, 2, 3, or more. Each concept represents a different design approach being explored in parallel.

### How it works

- The `conceptMeta` array in your prototype file defines the concepts. The sidebar generates numbered pills (1, 2, 3…) automatically from this array — you don't configure the sidebar separately.
- For each concept in `conceptMeta`, you add one matching `<div v-show="activeConcept === N">` block in the template where you build that concept's screens.
- Each concept tracks its own active page independently — switching concepts preserves your place on each one.

### Adding a concept

**Step 1 — Add an entry to `conceptMeta[]`:**

```ts
{
  name: 'Concept B',
  prdFeature: 'PRD 1.2 — Feature name',
  prdMetric: 'Describe the success metric for this concept.',
  pros: ['Why this approach works'],
  cons: ['What it trades off'],
  pages: [
    {
      id: 'home',
      label: 'Home',
      navItem: 'Home',
      changes: ['What changed on this page for this concept'],
    },
  ],
}
```

**Step 2 — Add a matching content block in the template:**

```vue
<div v-show="activeConcept === 2">
  <!-- Concept 2 screens go here -->
</div>
```

That's it. The sidebar, page navigation, Before/After toggle, and reset button all update automatically.

### How many concepts should I define?

Only as many as your PRD requires. Most prototypes have 2–3. There's no minimum or maximum — start with 1 if you're exploring a single direction, add more as alternatives emerge.

### Sub-states (optional)

If a page has multiple distinct UI states worth jumping to directly from the sidebar — for example, a modal open at step 3, a slide-in panel, or an "applied" status screen — you can define sub-states on that page. The full pattern is explained in the inline comments inside `_template.vue`.

---

## Tips for getting more out of Claude

### Share your Figma designs

You can paste a Figma link directly into Claude and it will read the design and use it to build your prototype. No need to describe what it looks like — just share the URL.

> *"Here's the Figma for this concept: [link] — build it out"*

You can also drag a screenshot of a Figma frame straight into the Claude Code window and it will use that as a reference.

### Use Dust for context

If you have research, product context, or past decisions in [Dust](https://dust.tt), ask Dust first to pull together the relevant background — then paste it into Claude as part of your brief. This gives Claude the "why" behind what you're building, which leads to much better prototypes.

> **In Dust:** *"Summarise the seller payments problem and what we've tried so far"*
> **Then in Claude:** *"Here's the context: [paste]. Now build me a prototype for..."*
