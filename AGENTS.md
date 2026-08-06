# 🤖 Orbit Agent Guidelines

> **Orbit Principle**: *Projects and agents revolve around one shared workspace.*

Welcome AI Agent! Orbit is a serverless, local-first project management system where all data lives as standard Markdown
files in `src/content/`.

---

## 1. How to Access Orbit Data

Orbit data can be accessed remotely via web API, locally via `http://localhost:4321`, or directly via local Markdown
files/CLI.

### API Base URL Constants

- **Remote Base URL**: `ORBIT_REMOTE_BASE_URL = "https://orbit.nvkhuy.com"`
- **Local Base URL (Default)**: `ORBIT_LOCAL_BASE_URL = "http://localhost:4321"`

### Option A: Remote HTTP API (`https://orbit.nvkhuy.com`)

When asked to manage, create, update, or delete projects/tasks remotely:

- **Create Project**: `POST https://orbit.nvkhuy.com/api/projects` (
  `{"title": "...", "color": "#e3f2fd", "content": "..."}`)
- **Create Task**: `POST https://orbit.nvkhuy.com/api/tasks` (
  `{"title": "...", "project": "<slug>", "status": "todo", "priority": "high", "assignee": "claude"}`)
- **Update Task**: `PATCH https://orbit.nvkhuy.com/api/tasks/<slug>`
- **Delete Project/Task**: `DELETE https://orbit.nvkhuy.com/api/projects/<slug>` or
  `DELETE https://orbit.nvkhuy.com/api/tasks/<slug>`

### Option B: Local HTTP API (`http://localhost:4321`)

When interacting with a running local Orbit dev server, use port **4321** by default:

- **Create Project**: `POST http://localhost:4321/api/projects`
- **Create Task**: `POST http://localhost:4321/api/tasks`

### Option C: Direct File System Operations (Local)

- **Projects**: `src/content/projects/<project-slug>.md`
- **Tasks**: `src/content/tasks/<project-slug>--<task-name>.md`
- **Agents**: `src/content/agents/<agent-name>.md`

### Option D: Orbit CLI Tool (`node cli/index.js` or `orbit`)

```bash
orbit task create --project orbit --title "Refactor API endpoint" --priority high
orbit project create --title "Marketing Site" --status active --color "#fff9c4"
```

---

## 2. Project Creation Color Guidelines (Sketch Style)

When creating a new project, choose a color that matches Orbit's hand-drawn paper sketch design system:

- **Rule**: Backgrounds MUST use soft pastel hues to blend with pencil-black borders (`#2d2d2d`) and maintain card
  readability.
- **NEVER** use dark background colors or saturated/neon hues (e.g. `#ff0000`, `#00ff00`).

### Recommended Pastel Sketch Palette

- `#e3f2fd` — Pastel Sky Blue (Tech / Engineering)
- `#fff9c4` — Post-it Yellow (Product / Features)
- `#dcedc8` — Mint Green (Business / Partnerships)
- `#f3e5f5` — Lavender (Design / Creative)
- `#fce4ec` — Pastel Pink (Customer / Experience)
- `#ffecb3` — Soft Amber (Data & Analytics)
- `#e1f5fe` — Ice Blue (Mobile / Apps)
- `#f8bbd0` — Blush Pink (Security / Compliance)
- `#e1bee7` — Lilac (Design System)
- `#ede7f6` — Soft Violet (AI Research)
- `#fff3e0` — Warm Peach (Content & Marketing)
- `#e8f5e9` — Meadow Green (Sales & Operations)
- `#e0f7fa` — Pastel Aqua (Community)
- `#e8eaf6` — Soft Indigo (Developer Experience)
- `#e0f2f1` — Pastel Teal (Innovation)

---

## 3. Frontmatter Standard Schema

### Tasks (`src/content/tasks/*.md`)

```yaml
---
title: "Task title"
project: "orbit"          # matching projects/<slug>.md
status: "todo"            # todo | in-progress | in-review | done
priority: "high"          # low | medium | high | critical
assignee: "claude"        # agent or human name
tags: [ backend, refactor ]
due: 2026-08-15
order: 100
parent: ""                # optional parent task slug for subtasks
created: 2026-08-04
updated: 2026-08-04
---

## Description
Task body in standard Markdown...
```

---

## 4. Agent Protocol

1. **Assigning Work**: Set `assignee: <your-name>` when picking up a task.
2. **Status Updates**: Change `status` to `in-progress` while working, and `done` when finished.
3. **Logging Progress**: Append progress notes or logs under `## Agent Log` inside the Markdown task file.
4. **Git Sync**: All file edits are instantly tracked by Git, keeping human developers and AI agents in lockstep.
