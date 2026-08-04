# 🤖 Orbit Agent Guidelines

> **Orbit Principle**: *Projects and agents revolve around one shared workspace.*

Welcome AI Agent! Orbit is a serverless, local-first project management system where all data lives as standard Markdown files in `src/content/`.

---

## 1. How to Access Orbit Data

You have **two options** to inspect or modify Orbit data:

### Option A: Direct File System Operations (Zero Dependency)
You can directly read, write, or modify Markdown files in `src/content/`:
- **Projects**: `src/content/projects/<project-slug>.md`
- **Tasks**: `src/content/tasks/<project-slug>--<task-name>.md`
- **Agents**: `src/content/agents/<agent-name>.md`

### Option B: Orbit CLI Tool (`node cli/index.js` or `orbit`)
If you prefer a structured CLI interface:
```bash
# Summary of all workspace activity
orbit summary

# Tasks
orbit task list --project orbit --status todo
orbit task create --project orbit --title "Refactor API endpoint" --priority high
orbit task update orbit--refactor-api-endpoint --status in-progress --assignee claude
orbit task done orbit--refactor-api-endpoint

# Projects
orbit project list
orbit project create --title "Marketing Site" --status active

# Query
orbit query "refactor"
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
