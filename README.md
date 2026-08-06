<div align="center">

<br />

<img src="./public/orbit-hero.jpg" alt="Orbit — A hand-drawn, sketch-style project management workspace where humans and AI agents collaborate on a shared Kanban board, with colorful sticky notes, Markdown files, and task cards orbiting a central planet" width="100%" />

<br />

# 🪐 Orbit

**The project management app that feels like a notebook, not a spreadsheet.**

A local-first, serverless workspace where humans and AI agents plan together on a hand-drawn Kanban board — powered by plain Markdown files, version-controlled with Git, and beautiful enough to make you *want* to organize your work.

<br />

[![Live Demo](https://img.shields.io/badge/✦_Live_Demo-orbit.nvkhuy.com-ff6b6b?style=for-the-badge)](https://orbit.nvkhuy.com)
[![Stars](https://img.shields.io/github/stars/nvkhuy/orbit?style=for-the-badge&logo=github&color=ffd54f&logoColor=2d2d2d)](https://github.com/nvkhuy/orbit/stargazers)
[![License](https://img.shields.io/badge/License-MIT-2d5da1?style=for-the-badge)](LICENSE)

[![Built with Astro](https://img.shields.io/badge/Astro-ff4d4d?style=flat-square&logo=astro&logoColor=white)](https://astro.build/)
[![Preact](https://img.shields.io/badge/Preact-673AB8?style=flat-square&logo=preact&logoColor=white)](https://preactjs.com/)
[![Markdown](https://img.shields.io/badge/Data-Markdown-2d2d2d?style=flat-square&logo=markdown&logoColor=white)](https://www.markdownguide.org/)
[![Local First](https://img.shields.io/badge/Architecture-Local--First-4CAF50?style=flat-square)](#-the-philosophy)
[![AI Agents](https://img.shields.io/badge/AI_Agents-Ready-ff9800?style=flat-square)](#-working-with-ai-agents)
[![Zero Database](https://img.shields.io/badge/Database-None_(just_files)-9c27b0?style=flat-square)](#-the-source-of-truth)

<br />

**[Live Demo](https://orbit.nvkhuy.com)** · **[Quick Start](#-quick-start)** · **[Why Orbit?](#-why-orbit)** · **[Screenshots](#-see-orbit-in-action)** · **[CLI](#-cli)** · **[For AI Agents](#-working-with-ai-agents)** · **[Contributing](#-contributing)**

<br />

</div>

---

## 💭 The Story Behind Orbit

> *"I didn't build Orbit because I needed another project management tool. I built it because I was tired of project management tools."*

Every day, I open the same polished dashboards. The same clinical interfaces with their pixel-perfect borders and enterprise-grade color schemes. They're efficient. They're powerful. And they make me feel like I'm filing taxes.

I started sketching my tasks in a physical notebook. Wobbly boxes. Arrows that didn't quite connect. Little stars next to things that mattered. And something unexpected happened — **I actually wanted to check my task list.** Not because I had to. Because it felt *mine*.

That notebook didn't judge me for having 47 half-finished tasks. It didn't send me notifications about overdue items in a cold, system-generated font. It just sat there, warm and imperfect, waiting for my next scratchy checkmark.

But notebooks don't sync. They don't let my AI assistant pick up a task at 2 AM while I sleep. They don't version-control my decisions. They don't scale.

So I asked myself a question that became Orbit:

> ***What if a project management app could feel like opening your favorite notebook — but with the power of Git, the intelligence of AI agents, and the simplicity of Markdown files you can read with `cat`?***

That's what Orbit is. Every card has a slight wobble. Every border looks hand-drawn. The colors are soft pastels — like sticky notes on a whiteboard, not cells in a database. The fonts are playful, not corporate.

**It's not a bug. It's the entire point.**

When your tools feel human, your work feels human. When your task board looks like something you doodled during a meeting, you stop dreading it and start *playing* with it.

Orbit is my sketch notebook — and now it's yours too. I hope it brings you the same quiet joy it brings me every time I drag a wobbly card from "To Do" to "Done" and see that hand-drawn progress bar inch forward.

*— Huy*

---

## ✨ See Orbit in Action

### 📊 Workspace Dashboard

<div align="center">
<img src="./public/dashboard.png" alt="Orbit workspace dashboard showing hand-drawn project cards with pastel backgrounds, progress bars, task metrics, and a sketch-style UI with wobbly borders" width="100%" />
<br />
<sub><strong>Your command center.</strong> Monitor every project's health at a glance — task counts, progress bars, and pastel-colored project cards that feel like sticky notes on your desk.</sub>
</div>

<br />

### 📋 Kanban Board

<div align="center">
<img src="./public/board.png" alt="Orbit Kanban board with drag-and-drop task cards organized in TODO, IN PROGRESS, IN REVIEW, and DONE columns with sketch-style hand-drawn borders" width="100%" />
<br />
<sub><strong>Drag, drop, done.</strong> A full interactive Kanban board with filters, search, grouping by status/project/priority/assignee — all in that signature hand-drawn style.</sub>
</div>

<br />

### 📝 Task List & Project Views

<table>
  <tr>
    <td width="50%" align="center">
      <img src="./public/list.png" alt="Orbit task list view with search, filters, sortable columns and sketch-style design" />
      <br />
      <strong>Task Master List</strong><br />
      <sub>Every task across your workspace in one compact, searchable, filterable table.</sub>
    </td>
    <td width="50%" align="center">
      <img src="./public/project.png" alt="Orbit single project view with progress overview, task board, and project details in hand-drawn style" />
      <br />
      <strong>Project Deep-Dive</strong><br />
      <sub>Focus on a single project — track progress, manage tasks, and see the big picture.</sub>
    </td>
  </tr>
</table>

### 📦 Import & Export — Zero Lock-in

<div align="center">
<img src="./public/import.png" alt="Orbit workspace import and export modal for backing up Markdown data as ZIP" width="75%" />
<br />
<sub><strong>Your data is yours.</strong> Export everything as a ZIP of Markdown files. Import it back anytime. No vendor lock-in. Ever.</sub>
</div>

---

## 🚀 Why Orbit?

<table>
  <tr>
    <td width="50%">

### 📓 Local-First, Not Cloud-First

Your workspace is a folder of `.md` files. No database. No server. No subscription. Open them in VS Code, Vim, or `cat`. They're just text.

### ✏️ Sketch-Style Interface

Hand-drawn borders, wobbly cards, pastel sticky-note colors, playful fonts. A UI that makes project management feel like doodling in your notebook.

### 🤖 AI Agent Native

Claude, Copilot, Gemini, or your own agents can read tasks, claim work, update status, and log progress — through the CLI, API, or directly editing Markdown files.

</td>
<td width="50%">

### 🌿 Git-Native Workflow

Every task update is a file change. Branch, diff, merge, and review project decisions exactly like code. Full history, forever.

### ⚡ Serverless & Instant

Built on Astro + Preact. No Docker. No PostgreSQL. `npm run dev` and you're live. Deploy anywhere that runs Node, or just run it locally.

### 🔓 Zero Lock-in

There is no proprietary format. The Markdown files *are* the database. Move them to another tool, process them with scripts, or read them on your phone.

</td>
  </tr>
</table>

> **TL;DR** — Orbit is what happens when you combine the warmth of a physical notebook with the power of Git and the intelligence of AI agents. It's project management that doesn't feel like project management.

---

## 🏁 Quick Start

### Prerequisites

- **Node.js** 22.12.0 or newer
- **npm**

### 3 commands to joy

```bash
git clone https://github.com/nvkhuy/orbit.git
cd orbit
npm install && npm run dev
```

Open **[http://localhost:4321](http://localhost:4321)** and feel the sketch.

### Using Make

```bash
make run       # Start the dev server
make test      # Seed a rich demo workspace (30 projects, 600+ tasks)
make reset     # Clear all workspace data (⚠️ destructive)
```

> [!WARNING]
> `make reset` deletes all `.md` files from `src/content/projects`, `src/content/tasks`, and `src/content/agents`. Back up or commit first.

---

## 📐 What You Can Do

| Area | What's Inside |
| :--- | :--- |
| **Dashboard** | Project health cards, task metrics, progress bars, recent activity |
| **Board** | Drag-and-drop Kanban with grouping by status, project, priority, or assignee |
| **List** | Searchable, filterable table of every task across all projects |
| **Projects** | Create projects with status, priority, color, tags, and progress tracking |
| **Tasks** | Full editing — title, status, priority, assignee, due date, tags, Markdown notes |
| **Agents** | Agent profiles living alongside your work — context for AI collaborators |
| **Import/Export** | ZIP-based backup and restore — your data leaves when you leave |
| **CLI** | Create, query, update, and summarize workspace data from your terminal |

---

## 🗂️ The Source of Truth

All data lives as Markdown with YAML frontmatter:

```
src/content/
├── agents/          # 🤖 AI agent profiles
│   └── <name>.md
├── projects/        # 📁 Project definitions
│   └── <slug>.md
└── tasks/           # ✅ Individual tasks
    └── <project>--<task>.md
```

### A task looks like this:

```yaml
---
title: "Add dark mode support"
project: "design-system"
status: "in-progress"       # todo | in-progress | in-review | done
priority: "high"            # low | medium | high | critical
assignee: "claude"
tags: [frontend, ui, accessibility]
due: 2026-08-15
order: 200
created: 2026-08-05
updated: 2026-08-05
---

## Notes

Implement CSS custom properties for theme switching.
Respect user's system preference with `prefers-color-scheme`.
```

That's it. No ORM. No migrations. No schema files. **Just Markdown.**

---

## 💻 CLI

Manage your workspace without opening a browser:

```bash
# Overview
orbit summary                                    # Workspace health report
orbit query "authentication"                     # Search across all content

# Projects
orbit project list                               # List all projects
orbit project create --title "Mobile App" --status active --priority high

# Tasks
orbit task list --project design-system --status todo
orbit task create --project mobile-app --title "Add offline sync" --priority high --assignee claude
orbit task update mobile-app--add-offline-sync --status in-progress
orbit task done mobile-app--add-offline-sync     # 🎉 Ship it
```

> **Pro tip:** Pipe `orbit summary` into your AI agent's context for an instant workspace briefing.

---

## 🤖 Working with AI Agents

Orbit was designed from the ground up for human + AI collaboration. An agent can:

1. **Read** project and task Markdown directly from the filesystem
2. **Claim work** by setting `assignee: agent-name` and `status: in-progress`
3. **Log progress** under `## Agent Log` inside the task file
4. **Complete work** by changing status to `done`
5. **Commit changes** alongside code — because task files *are* just files

### API Endpoints

```bash
# Create a task
curl -X POST https://orbit.nvkhuy.com/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Refactor API", "project": "orbit", "priority": "high", "assignee": "claude"}'

# Update a task
curl -X PATCH https://orbit.nvkhuy.com/api/tasks/orbit--refactor-api \
  -d '{"status": "in-progress"}'
```

### Agent Guidelines

Agent-specific instructions live in [`AGENTS.md`](AGENTS.md) — including the recommended color palette, frontmatter schema, and protocol for picking up and completing tasks.

> **Why this matters:** Most project tools treat AI as an afterthought. Orbit treats AI agents as first-class teammates. The Markdown-first architecture means any agent that can read and write text files can participate — no special SDK, no API key, no permission dance.

---

## 🏗️ Architecture

```
                    ┌─────────────────────────────┐
                    │    src/content/**/*.md       │
                    │    (Markdown = Database)     │
                    └──────────────┬──────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                     │
    ┌─────────▼─────────┐  ┌──────▼──────┐  ┌──────────▼──────────┐
    │   🌐 Web App      │  │  ⌨️  CLI    │  │  🤖 AI Agents       │
    │   Astro + Preact   │  │  Commander  │  │  File I/O or API    │
    │   Islands Arch.    │  │  Node.js    │  │  Any LLM            │
    └─────────┬─────────┘  └──────┬──────┘  └──────────┬──────────┘
              │                    │                     │
              └────────────────────┼────────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │      🌿 Git + Filesystem    │
                    │      Version Control        │
                    │      Single Source of Truth  │
                    └─────────────────────────────┘
```

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Framework** | [Astro](https://astro.build/) | Server rendering, file-based routing, API routes |
| **Islands** | [Preact](https://preactjs.com/) | Interactive components (board, editors, modals) |
| **Parser** | [gray-matter](https://github.com/jonschlinkert/gray-matter) | Read/write YAML frontmatter in Markdown |
| **CLI** | [Commander](https://github.com/tj/commander.js) | Terminal interface for all workspace operations |
| **Storage** | Node.js `fs` | Direct filesystem — no database layer |

---

## 🛠️ Development

```bash
npm install          # Install dependencies
npm run dev          # Start local dev server at localhost:4321
npm run build        # Production build → dist/
npm run preview      # Preview production build locally
```

```bash
make test            # Seed 30 projects × ~20 tasks each (demo data)
make reset           # ⚠️ Wipe all workspace content
make update-skills   # Sync agent guidelines across claude/codex/gemini
```

### Project Structure

```
orbit/
├── cli/                  # Terminal commands (project, task, query, summary)
├── public/               # Static assets, screenshots, favicon
├── scripts/              # Workspace seeding and reset tooling
├── src/
│   ├── components/       # Astro + Preact UI components
│   ├── content/          # 📂 Projects, tasks, agents (the data)
│   ├── pages/            # Routes: dashboard, board, list, editors, API
│   └── styles/           # Global sketch design system & animations
├── AGENTS.md             # AI agent collaboration guidelines
├── Makefile              # Common workflows
└── package.json
```

---

## 🤝 Contributing

Orbit is open source and contributions are warmly welcome!

### How to contribute

1. **Fork & clone** the repo
2. **Create a branch** for your change
3. **Make the smallest coherent change** — Orbit values simplicity
4. **Run `npm run build`** to verify everything compiles
5. **Open a PR** with motivation, behavior change, and testing steps

### Guidelines

- **Preserve the sketch aesthetic** — new components should feel hand-drawn
- **Keep it local-first** — features must work with plain Markdown files
- **No database dependencies** — the filesystem is the only storage layer
- **Both UI and CLI** — new features should be accessible from both where practical

> [!TIP]
> Use `make test` to seed a rich workspace with 30 diverse projects and 600+ tasks — perfect for testing your changes at scale.

---

## 💛 Star History

If Orbit makes your day a little brighter, a ⭐ means the world.

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=nvkhuy/orbit&type=Date)](https://star-history.com/#nvkhuy/orbit&Date)

</div>

---

## 📄 License

Orbit is released under the [MIT License](LICENSE) — use it, fork it, make it yours.

---

<div align="center">

<br />

*Built with pencils, pastels, and a deep love for the way notebooks make us feel.*

**[🪐 Try Orbit →](https://orbit.nvkhuy.com)**

<br />

</div>
