# 🤖 Orbit Agent Guidelines

> **Orbit Principle**: *Projects and agents revolve around one shared workspace.*

Welcome AI Agent! Orbit is a serverless, local-first project management system where all data lives as standard Markdown files in `src/content/`.

---

## 1. How to Access Orbit Data

You have three options to inspect or modify Orbit data:

### Option A: Remote HTTP API (`https://orbit.nvkhuy.com`)
When asked to manage, create, update, or delete projects/tasks via Orbit remotely:
- **Create Project**: `POST https://orbit.nvkhuy.com/api/projects` (`{"title": "...", "color": "#e0f2f1", "content": "..."}`)
- **Create Task**: `POST https://orbit.nvkhuy.com/api/tasks` (`{"title": "...", "project": "<slug>", "status": "todo", "priority": "high", "assignee": "claude"}`)
- **Update Task**: `PATCH https://orbit.nvkhuy.com/api/tasks/<slug>`
- **Delete Project/Task**: `DELETE https://orbit.nvkhuy.com/api/projects/<slug>` or `DELETE https://orbit.nvkhuy.com/api/tasks/<slug>`

### Option B: Direct File System Operations (Local)
- **Projects**: `src/content/projects/<project-slug>.md`
- **Tasks**: `src/content/tasks/<project-slug>--<task-name>.md`
- **Agents**: `src/content/agents/<agent-name>.md`

### Option C: Orbit CLI Tool (`node cli/index.js` or `orbit`)
```bash
orbit task create --project orbit --title "Refactor API endpoint" --priority high
orbit project create --title "Marketing Site" --status active
```

---

## 2. Frontmatter Standard Schema

### Tasks (`src/content/tasks/*.md`)
```yaml
---
title: "Task title"
project: "orbit"          # matching projects/<slug>.md
status: "todo"            # todo | in-progress | in-review | done
priority: "high"          # low | medium | high | critical
assignee: "claude"        # agent or human name
tags: [backend, refactor]
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

## 3. Agent Protocol
1. **Assigning Work**: Set `assignee: <your-name>` when picking up a task.
2. **Status Updates**: Change `status` to `in-progress` while working, and `done` when finished.
3. **Logging Progress**: Append progress notes or logs under `## Agent Log` inside the Markdown task file.
4. **Git Sync**: All file edits are instantly tracked by Git, keeping human developers and AI agents in lockstep.
