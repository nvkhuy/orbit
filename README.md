<div align="center">

# 🪐 Orbit

### A local-first workspace for humans and AI agents.

Plan projects, move work across a hand-drawn Kanban board, and keep every decision in plain Markdown files that your team—and your AI agents—can read and edit in lockstep.

[![Stack](https://img.shields.io/badge/stack-Astro%20%2B%20Preact-ff4d4d?style=flat-square)](https://astro.build/)
[![Data](https://img.shields.io/badge/data-Markdown-2d2d2d?style=flat-square)](https://www.markdownguide.org/)
[![License](https://img.shields.io/badge/license-MIT-2d5da1?style=flat-square)](LICENSE)

<br />

<img src="./public/orbit-hero.jpg" alt="Orbit workspace hero banner" width="100%" />

</div>

## 🎨 See Orbit in action

Orbit brings project management, Kanban workflows, and AI agent collaboration together into one fast, hand-crafted workspace.

### 📊 Workspace Dashboard & Interactive Board

<table>
  <tr>
    <td width="50%" align="center">
      <img src="./public/dashboard.png" alt="Orbit Workspace Dashboard showing active projects, metrics, and progress" />
      <br />
      <strong>Workspace Dashboard</strong><br />
      <sub>Monitor project health, overall task counts, progress bars, and active project cards at a glance.</sub>
    </td>
    <td width="50%" align="center">
      <img src="./public/board.png" alt="Orbit Kanban Board showing tasks grouped by status, priority, and assignee" />
      <br />
      <strong>Interactive Kanban Board</strong><br />
      <sub>Drag & drop tasks, filter by project or priority, quick-cycle status badges, and group by status, project, priority, or assignee.</sub>
    </td>
  </tr>
</table>

### 📋 Task Master List & Project Deep-Dives

<table>
  <tr>
    <td width="50%" align="center">
      <img src="./public/list.png" alt="Orbit Task Master List view with search, filters, and due dates" />
      <br />
      <strong>Task Master List</strong><br />
      <sub>Scan, search, and manage every task across your entire workspace in a clean, compact table view.</sub>
    </td>
    <td width="50%" align="center">
      <img src="./public/project.png" alt="Orbit Project View with project details, progress overview, and project board" />
      <br />
      <strong>Project Overview & Board</strong><br />
      <sub>Focus on a single project, track progress metrics, and manage project-specific tasks in isolation.</sub>
    </td>
  </tr>
</table>

### 📦 Seamless Import & Export (Zero Lock-in)

<div align="center">
  <img src="./public/import.png" alt="Orbit Import and Export data modal" width="80%" />
  <br />
  <sub>Export your entire workspace into a standard ZIP archive or import/restore backups with a single click.</sub>
</div>


## Why Orbit?

Most project tools put your work behind a database, a subscription, and a permission system that does not understand your development workflow. Orbit takes a different approach:

- **Local-first** — your workspace is a directory of Markdown files.
- **Human-friendly** — use the dashboard, board, list view, and task editors.
- **Agent-ready** — agents can inspect and update the same files through the CLI or filesystem.
- **Git-native** — review, diff, branch, and merge project work like code.
- **Delightful by default** — a hand-drawn interface that makes planning feel lightweight.

There is no proprietary database to export and no workspace lock-in. The Markdown files are the source of truth.

## What you can do

| Area | Capabilities |
| --- | --- |
| Workspace | Dashboard metrics, active project progress, and recent tasks |
| Board | Drag tasks between statuses, reorder cards, filter, search, and group by status, project, priority, or assignee |
| List | Scan and filter every task in a compact table |
| Projects | Create projects, set status/priority/color, and track progress |
| Tasks | Edit title, status, project, priority, assignee, due date, tags, and Markdown notes |
| Agents | Keep agent identities and workspace context alongside the work |
| CLI | Create, query, update, complete, and summarize workspace data from a terminal |

## Quick start

### Requirements

- Node.js **22.12.0 or newer**
- npm

### Install and run

```bash
git clone https://github.com/nvkhuy/orbit.git
cd orbit
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

The same workflow is available through Make:

```bash
make run       # Start the development server
make test      # Reset and seed a rich demo workspace
make reset     # Remove Markdown content from projects, tasks, and agents
```

> **Warning:** `make reset` is destructive. It deletes `.md` files from `src/content/projects`, `src/content/tasks`, and `src/content/agents`. Commit or back up your workspace first.

## The source of truth

Orbit stores workspace data in three directories:

```text
src/content/
├── agents/
│   └── <agent-name>.md
├── projects/
│   └── <project-slug>.md
└── tasks/
    └── <project-slug>--<task-slug>.md
```

A task is ordinary Markdown with structured frontmatter:

```yaml
---
title: Improve API error messages
project: orbit-platform
status: in-progress
priority: high
assignee: claude
tags: [backend, quality]
due: 2026-08-15
order: 200
parent: ""
created: 2026-08-05
updated: 2026-08-05
blocked_by: []
---

## Notes

Document the expected error shape and client behavior.
```

Supported task statuses are `todo`, `in-progress`, `in-review`, and `done`. Priorities are `low`, `medium`, `high`, and `critical`.

## CLI

Use the local CLI directly with Node:

```bash
node cli/index.js summary
node cli/index.js query "keyboard"
node cli/index.js project list
node cli/index.js task list --project orbit-platform --status todo
```

Create and update work without opening the browser:

```bash
node cli/index.js project create \
  --title "Mobile App" \
  --status active \
  --priority high

node cli/index.js task create \
  --project mobile-app \
  --title "Add offline sync" \
  --priority high \
  --status todo \
  --assignee claude

node cli/index.js task update mobile-app--add-offline-sync \
  --status in-progress \
  --assignee huy

node cli/index.js task done mobile-app--add-offline-sync
```

The `summary` command reports project progress and open tasks in a format that is easy to paste into an agent session or pipe into another tool.

## Architecture

```text
                 Markdown workspace
                src/content/**/*.md
                         │
          ┌──────────────┴──────────────┐
          │                             │
     Orbit web app                  Orbit CLI
   Astro + Preact                 Node + Commander
          │                             │
          └──────────────┬──────────────┘
                         │
                   Git / agents /
                    human editors
```

- **Astro** provides the application shell, server rendering, and API routes.
- **Preact** powers interactive islands such as the Kanban board and editors.
- **gray-matter** parses and writes Markdown frontmatter.
- **Commander** exposes the terminal workflow.
- **Node filesystem APIs** keep persistence transparent and local.

The browser uses API routes for mutations, while the resulting Markdown files remain directly editable and versionable.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `make test` | Seed 30 varied projects with 15–30 tasks each across every status and priority |
| `make reset` | Remove all workspace Markdown content |

Before opening a pull request, run:

```bash
npm run build
```

## Project layout

```text
.
├── cli/                 # Terminal commands for projects, tasks, and queries
├── public/              # Static assets and favicon
├── scripts/             # Workspace reset and test-fixture tooling
├── src/components/      # Astro and Preact UI components
├── src/content/         # Projects, tasks, and agents—the data layer
├── src/pages/            # Dashboard, board, list, editors, and API routes
├── src/styles/           # Global sketch design system and animations
├── Makefile              # Common local workflows
└── plan.md              # Product and implementation notes
```

## Working with agents

Orbit is designed for shared human/agent workspaces. An agent can:

1. Read project and task Markdown directly.
2. Claim work by setting `assignee` and `status: in-progress`.
3. Add progress notes under an `## Agent Log` section.
4. Mark the task `done` when the work is complete.
5. Commit the Markdown changes alongside code changes.

Because the data is plain text, every update is inspectable in Git and portable across tools.

## Contributing

Issues and pull requests are welcome. A good contribution usually follows this loop:

1. Create a focused branch.
2. Make the smallest coherent change.
3. Run `npm run build`.
4. Add or update fixture coverage with `make test` when the change affects workspace flows.
5. Open a pull request with the motivation, behavior change, and verification steps.

Please keep the local-first model intact: new features should preserve direct Markdown access and remain usable from both the UI and automation workflows where practical.

## License

Orbit is released under the [MIT License](LICENSE).
