# 🪐 Orbit — Project Plan

> *Projects and agents revolve around one shared workspace.*

## 1. What Is Orbit?

Orbit is a **serverless, local-first** project management app (like Trello + Notion) that stores everything as **Markdown files on disk**. It's built with **Astro** so the UI is a fully interactive web app, and the same markdown files are directly readable/writable by AI agents — no API server needed.

---

## 2. Core Principle — Two Users, One Workspace

> **Humans and AI agents are equal first-class users.**

This is the single most important design constraint. Every feature must work through **both** interfaces:

| | 🧑 Human | 🤖 AI Agent |
|---|---|---|
| **Create task** | Click "New Task" in the UI | `orbit task create ...` or write a `.md` file |
| **Move to In Progress** | Drag card on board / click status | `orbit task update --status in-progress` or edit frontmatter |
| **Add notes** | Type in task detail page | Append markdown to the task file |
| **View board** | Open `/board` in browser | `orbit summary` or read files directly |
| **Search** | Type in search bar | `orbit query "priority:high"` or `grep` |
| **Create project** | Fill out form in UI | `orbit project create ...` or write a `.md` file |

The **markdown file is the single source of truth**. The UI reads and writes it. The CLI reads and writes it. Agents can skip the CLI entirely and just manipulate files. Everything stays in sync because there's only one place data lives.

```
┌─────────────────────────────────────────────────────┐
│                  src/content/*.md                    │
│              (single source of truth)                │
└──────────┬──────────────────┬────────────────────────┘
           │                  │
     ┌─────▼─────┐      ┌────▼─────┐
     │  Astro UI │      │  CLI /   │
     │  (human)  │      │  fs API  │
     │  browser  │      │  (agent) │
     └───────────┘      └──────────┘
```

---

## 3. Key Design Decisions

| Decision        | Choice                                                    | Why                                                        |
|-----------------|-----------------------------------------------------------|------------------------------------------------------------|
| Framework       | **Astro 5 hybrid mode** (SSR for writes, SSG for reads)   | Content collections for markdown, API routes for UI writes |
| Data layer      | **Markdown files** in a `src/content/` directory          | Git-friendly, AI-agent friendly, no database, agents can read/write directly |
| Styling         | **Vanilla CSS** following `sketch_style.md`               | Hand-drawn aesthetic, no Tailwind dependency               |
| Interactivity   | **Preact islands** (drag-drop, modals, inline edit)       | Minimal JS, Astro partial hydration                        |
| Human interface | **Full CRUD web UI**                                      | Create, edit, drag, search — all from the browser          |
| Agent interface | **File system + `orbit` CLI**                             | Agents read/write `.md` files directly, or use CLI for convenience |
| Write mechanism | **Astro API routes** (`POST /api/tasks`, etc.)            | UI forms hit API routes that write `.md` files to disk     |
| Deployment      | **`astro dev`** locally (SSR for writes)                  | Works offline, no external server — Astro's dev server handles everything |

---

## 4. Content Architecture (The Markdown Schema)

All data lives under `src/content/`. Astro Content Collections validate the frontmatter.

### 4.1 Directory Structure

```
src/content/
├── projects/
│   ├── orbit.md
│   ├── side-hustle.md
│   └── ...
├── tasks/
│   ├── orbit--setup-astro.md
│   ├── orbit--design-board-view.md
│   ├── side-hustle--landing-page.md
│   └── ...
├── views/
│   └── default.md          # saved board/list/calendar views
└── agents/
    └── claude.md            # agent profile & permissions
```

### 4.2 Project Frontmatter

```yaml
---
# src/content/projects/orbit.md
title: "Orbit"
slug: orbit
status: active            # active | paused | archived | completed
priority: high            # low | medium | high | critical
tags: [dev-tools, open-source]
color: "#fff9c4"          # post-it color for the board card
owner: huy
created: 2026-08-04
updated: 2026-08-04
columns:                  # custom board columns (optional, defaults below)
  - todo
  - in-progress
  - in-review
  - done
---

Project description, goals, notes — all free-form markdown.
```

### 4.3 Task Frontmatter

```yaml
---
# src/content/tasks/orbit--setup-astro.md
title: "Set up Astro project scaffold"
project: orbit             # references projects/orbit.md
status: todo               # todo | in-progress | in-review | done | blocked
priority: high
assignee: huy              # human or agent name
tags: [setup, infra]
due: 2026-08-10
order: 100                 # sort position within column (lower = higher)
parent: ""                 # slug of parent task (empty = top-level)
created: 2026-08-04
updated: 2026-08-04
blocked_by: []             # slugs of other tasks
---

## Description
Initialize Astro 5 with content collections...

## Checklist
- [ ] Run `npm create astro@latest`
- [ ] Configure content collections
- [ ] Set up base layout

## Notes
Any free-form markdown here — logs, links, decisions.
```

> **Key fields for drag-and-drop:**
> - `status` → which column the card is in
> - `order` → position within that column (uses gap numbering: 100, 200, 300… so insertions don't require renumbering every card)
> - `project` → which project this belongs to (changing it = moving between projects)
> - `parent` → enables subtasks (nested task hierarchy)

### 4.4 Agent Profile

```yaml
---
# src/content/agents/claude.md
name: Claude
type: ai
permissions:
  - read-all
  - write-tasks
  - update-status
last_active: 2026-08-04T15:30:00Z
---

Agent-specific notes, capabilities, preferred workflows.
```

---

## 5. Application Pages & Views

| Route              | Description                                                                         |
|--------------------|-------------------------------------------------------------------------------------|
| `/`                | **Dashboard** — project cards with progress bars, recent tasks, quick stats         |
| `/board`           | **Global Board** — all tasks across projects, group by project/assignee/priority     |
| `/board?project=X` | **Project Board** — filtered Kanban for a single project                            |
| `/list`            | **List View** — sortable/filterable table of all tasks                              |
| `/projects/[slug]` | **Project Detail** — project info, progress, tasks in board or list (user toggles)  |
| `/tasks/[slug]`    | **Task Detail** — full task view with editable markdown, subtasks, checklist         |
| `/agents`          | **Agent Hub** — registered agents, activity log, permissions                        |
| `/new`             | **Quick Create** — modal form to create a new task or project                       |

---

## 6. UI/UX — Hand-Drawn Sketch Style

All styling follows `sketch_style.md`. Key applications:

### 6.1 Design Tokens (CSS Custom Properties)

```css
:root {
    /* Colors */
    --bg: #fdfbf7;
    --fg: #2d2d2d;
    --muted: #e5e0d8;
    --accent: #ff4d4d;
    --border: #2d2d2d;
    --blue: #2d5da1;
    --postit: #fff9c4;

    /* Typography */
    --font-heading: 'Kalam', cursive;
    --font-body: 'Patrick Hand', cursive;

    /* Wobbly borders */
    --radius-wobbly: 255px 15px 225px 15px / 15px 225px 15px 255px;
    --radius-wobbly-md: 15px 225px 15px 255px / 255px 15px 225px 15px;
    --radius-wobbly-sm: 185px 10px 185px 10px / 10px 185px 10px 185px;

    /* Shadows */
    --shadow: 4px 4px 0px 0px #2d2d2d;
    --shadow-lg: 8px 8px 0px 0px #2d2d2d;
    --shadow-hover: 2px 2px 0px 0px #2d2d2d;

    /* Paper texture */
    --paper-dots: radial-gradient(#e5e0d8 1px, transparent 1px);
    --paper-dots-size: 24px 24px;
}
```

### 6.2 Component Mapping

| Component           | Sketch Style Treatment                                                               |
|---------------------|--------------------------------------------------------------------------------------|
| **Kanban columns**  | Dashed border containers, slight rotation (-1° to 1°), column headers in `Kalam`     |
| **Task cards**      | White cards with wobbly borders, hard offset shadow, `decoration="tape"` or `"tack"` |
| **Priority badges** | Post-it colored sticky notes (yellow, red, blue)                                     |
| **Status pills**    | Wobbly oval shapes with handwritten labels                                           |
| **Navigation**      | Wavy underline on active link, `Patrick Hand` font                                   |
| **Buttons**         | Wobbly oval, press-flat active state, red hover fill                                 |
| **Inputs/Search**   | Full box with wobbly borders, handwritten placeholder                                |
| **Agent avatars**   | Rough circle outline, dashed border for AI agents                                    |
| **Empty states**    | Hand-drawn SVG illustrations (notebook doodle style)                                 |
| **Drag handle**     | Scribbled dots/lines icon                                                            |

---

## 7. Drag-and-Drop & Interactions — The Full Spec

This is the Notion-like experience. Every drag, drop, and click maps to a frontmatter change in a `.md` file.

### 7.1 Board Interactions

| UI Action | What happens | API Call | Markdown Change |
|---|---|---|---|
| **Drag card to another column** | Change task status | `PATCH /api/tasks/[slug]` | `status: todo` → `status: in-progress` |
| **Drag card up/down within column** | Reorder card position | `PATCH /api/tasks/[slug]` | `order: 100` → `order: 150` (recalculated) |
| **Drag card to different project group** | Move task to another project | `PATCH /api/tasks/[slug]` | `project: orbit` → `project: side-hustle` |
| **Click card** | Open task detail | Navigate to `/tasks/[slug]` | — |
| **Click status badge on card** | Quick status cycle | `PATCH /api/tasks/[slug]` | `status` cycles to next value |
| **Click "+" at bottom of column** | Add new task in that status | `POST /api/tasks` | Creates new `.md` with `status` pre-set |
| **Click assignee avatar** | Reassign task | `PATCH /api/tasks/[slug]` | `assignee: huy` → `assignee: claude` |

### 7.2 Order Algorithm

Cards use **gap numbering** for `order` (100, 200, 300…):

```
Drop card between order:200 and order:300
→ new order = 250 (midpoint)

Drop card at top of column
→ new order = (first_card.order / 2)

Drop card at bottom of column
→ new order = last_card.order + 100

If gap gets too small (<1), re-index all cards: 100, 200, 300…
```

This means **most drag-drops only update 1 file** (the moved card). Bulk re-indexing is rare.

### 7.3 Subtask Interactions

| UI Action | What happens | Markdown Change |
|---|---|---|
| **Indent task in list view** | Make it a subtask | `parent: ""` → `parent: "orbit--setup-astro"` |
| **Outdent task** | Promote to top-level | `parent: "orbit--setup-astro"` → `parent: ""` |
| **Collapse/expand parent** | Toggle subtask visibility | Client-side only (no file change) |
| **Check subtask checkbox** | Mark subtask done | `status: todo` → `status: done` |

### 7.4 Project Progress

Project progress is **computed, not stored** — calculated from its tasks at render time:

```
Progress = (tasks with status:done) / (total tasks) × 100%
```

Shown as a hand-drawn progress bar on the dashboard and project detail page.

### 7.5 Board Grouping & Filtering

The board supports Notion-style view controls:

| Control | Options | URL param |
|---|---|---|
| **Group by** | Status (default), Project, Assignee, Priority | `?group=status` |
| **Filter by** | Project, Assignee, Priority, Tags, Due date | `?project=orbit&assignee=huy` |
| **Sort within column** | Order (default), Priority, Due date, Created | `?sort=priority` |
| **Show/hide done** | Toggle completed tasks | `?hideDone=true` |

---

## 8. Agent Interface — CLI + Direct File Access

Agents have **two ways** to interact with Orbit:

### 8.1 Direct File Access (Zero Dependencies)

Agents can simply read and write `.md` files in `src/content/`. This is the simplest path — no CLI needed.

### 8.2 CLI Tool (`orbit`) — Convenience Wrapper

For agents that prefer structured commands over raw file manipulation:

```bash
# Tasks
orbit task create --project orbit --title "Fix layout bug" --priority high
orbit task update orbit--fix-layout --status in-progress --assignee claude
orbit task list --project orbit --status todo
orbit task done orbit--fix-layout

# Projects
orbit project create --title "New Project" --status active
orbit project list --status active

# Queries & summaries
orbit query "status:todo AND priority:high"
orbit summary    # machine-readable markdown summary of all work
```

### 8.3 Agent Conventions

- Agents set `assignee: <agent-name>` when picking up a task
- Agents append timestamped notes under `## Agent Log` in task body
- Agents update `status` and `updated` fields as they progress
- All changes are git-trackable — `git log` shows who (human or agent) changed what

---

## 9. Tech Stack & Dependencies

```json
{
  "dependencies": {
    "astro": "^5.x",
    "@astrojs/preact": "^4.x",
    "@astrojs/node": "^9.x",
    "preact": "^10.x",
    "gray-matter": "^4.x"
  },
  "devDependencies": {
    "commander": "^13.x"
  }
}
```

- **Astro 5 (hybrid)** — SSR for API routes (writes), SSG for pages (reads)
- **@astrojs/node** — Node adapter for server-side API routes
- **Preact** — lightweight islands for interactive components (board drag-drop, modals, inline edit)
- **gray-matter** — parse/stringify markdown frontmatter (used by API routes + CLI)
- **Commander** — CLI argument parsing for `orbit` tool

---

## 10. Implementation Phases

### Phase 1 — Foundation 🏗️

> Estimated: 2–3 days

- [ ] Initialize Astro 5 project with Preact integration + Node adapter (hybrid mode)
- [ ] Set up CSS design system (all tokens from sketch_style.md)
- [ ] Create base layout with hand-drawn navigation
- [ ] Define Content Collections schemas (projects, tasks, agents)
- [ ] Add seed content (sample projects & tasks)
- [ ] Build shared components: `Card`, `Button`, `Badge`, `Input`
- [ ] Build API routes for task/project CRUD (write `.md` files)

### Phase 2 — Core Views 📋

> Estimated: 3–4 days

- [ ] **Dashboard** (`/`) — project cards with progress bars, task stats, recent activity
- [ ] **Board View** (`/board`) — Kanban columns with full drag-and-drop (Preact island)
  - [ ] Drag between columns (status change)
  - [ ] Drag within column (reorder via `order` field)
  - [ ] Group by project / assignee / priority
  - [ ] Filter by project, tags, assignee, due date
- [ ] **List View** (`/list`) — sortable, filterable task table with inline status toggle
- [ ] **Project Detail** (`/projects/[slug]`) — project page with board/list toggle + progress bar
- [ ] **Task Detail** (`/tasks/[slug]`) — full task view with editable markdown body + subtasks

### Phase 3 — Interactivity ✨

> Estimated: 3–4 days

- [ ] **Quick Create** — modal to create tasks & projects (writes .md via API route)
- [ ] **Inline Editing** — edit task status, priority, assignee directly from board/list (PATCH API)
- [ ] **Subtask support** — indent/outdent in list view, subtask list on task detail
- [ ] **Move between projects** — drag card to different project group, or reassign via dropdown
- [ ] **Search & Filter** — client-side full-text search across tasks
- [ ] **Keyboard Shortcuts** — `n` for new task, `/` for search, `b` for board view

### Phase 4 — AI Agent Layer 🤖

> Estimated: 2–3 days

- [ ] Build `orbit` CLI tool with Commander
- [ ] Implement task CRUD commands (create, update, list, done)
- [ ] Implement project commands
- [ ] Add query/filter command
- [ ] Add `orbit summary` for agent-readable workspace overview
- [ ] Document agent conventions in `AGENTS.md`

### Phase 5 — Polish & Extras ✏️

> Estimated: 2–3 days

- [ ] Hand-drawn SVG empty states & illustrations
- [ ] Micro-animations (card jiggle, bounce, press-flat)
- [ ] Responsive design pass (mobile-first)
- [ ] `AGENTS.md` — full guide for AI agents using Orbit
- [ ] README with setup instructions & screenshots

---

## 11. File Structure (Final)

```
orbit/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── sketch_style.md
├── AGENTS.md                         # guide for AI agents
├── cli/
│   ├── index.js                      # orbit CLI entry point
│   └── commands/
│       ├── task.js
│       ├── project.js
│       └── query.js
├── public/
│   └── fonts/                        # Kalam, Patrick Hand (self-hosted)
├── src/
│   ├── pages/
│   │   ├── api/
│   │   │   ├── tasks/
│   │   │   │   ├── index.ts          # POST create task
│   │   │   │   └── [slug].ts         # PUT update, DELETE remove
│   │   │   └── projects/
│   │   │       ├── index.ts          # POST create project
│   │   │       └── [slug].ts         # PUT update
│   ├── content/
│   │   ├── config.ts                 # content collection schemas
│   │   ├── projects/
│   │   │   └── orbit.md
│   │   ├── tasks/
│   │   │   ├── orbit--setup-astro.md
│   │   │   └── orbit--design-board.md
│   │   └── agents/
│   │       └── claude.md
│   ├── components/
│   │   ├── BaseLayout.astro
│   │   ├── Nav.astro
│   │   ├── Card.astro
│   │   ├── Button.astro
│   │   ├── Badge.astro
│   │   ├── Input.astro
│   │   ├── TaskCard.astro
│   │   ├── ProjectCard.astro
│   │   ├── KanbanBoard.tsx           # Preact island
│   │   ├── KanbanColumn.tsx
│   │   ├── QuickCreate.tsx           # Preact island
│   │   └── SearchBar.tsx             # Preact island
│   ├── pages/
│   │   ├── index.astro               # Dashboard
│   │   ├── board.astro               # Kanban board
│   │   ├── list.astro                # List view
│   │   ├── new.astro                 # Quick create page
│   │   ├── agents.astro              # Agent hub
│   │   ├── projects/
│   │   │   └── [slug].astro
│   │   └── tasks/
│   │       └── [slug].astro
│   └── styles/
│       ├── global.css                # design tokens, paper texture, base
│       ├── components.css            # wobbly borders, cards, buttons
│       └── animations.css            # jiggle, bounce, press-flat
└── README.md
```

---

## 12. Open Questions for Review

1. **Naming convention for tasks**: I proposed `project--task-slug.md` (e.g., `orbit--setup-astro.md`). Do you prefer a nested folder structure instead (`projects/orbit/tasks/setup-astro.md`)?

2. **Dark mode**: The sketch style is very paper-centric (light). Want me to design a "chalkboard" dark variant, or skip dark mode?

3. **Multi-user**: Is this purely single-user local, or do you want to support multiple humans + agents with a git-based sync model?

---

*Ready to build when you approve. 🚀*
