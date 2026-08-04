# 🤖 AI Agent Integration Guide for Orbit

> *Orbit is designed for direct collaboration between humans and AI agents over a shared local Markdown workspace.*

---

## 1. Core Principles for AI Agents

1. **The Markdown files in `src/content/` are the single source of truth.**
2. **No API server required:** Agents can read and write `.md` files directly using filesystem tools or shell commands (`sed`, `cat`, `echo`, etc.).
3. **Structured CLI option:** The `orbit` CLI (`npm run cli --` or `node cli/index.js`) provides structured commands for agents that prefer a CLI syntax.
4. **Git-trackable:** Every change you make to a task or project file can be tracked with `git commit`.

---

## 2. Standard Workflow for AI Agents

### Step 1: Discover Work
Read all tasks or request a machine-readable summary:

```bash
# Get JSON summary of projects and tasks
node cli/index.js summary

# Or list pending tasks assigned to you
node cli/index.js task list --assignee claude --status todo
```

### Step 2: Claim & Start a Task
Set `assignee` to your agent name and `status` to `in-progress`:

```bash
node cli/index.js task update <task-slug> --assignee claude --status in-progress --log "Started working on this task"
```

Or edit the frontmatter directly:
```yaml
assignee: claude
status: in-progress
updated: 2026-08-04
```

### Step 3: Append Work Logs & Notes
Append timestamped updates under `## Agent Log` in the markdown body:

```markdown
## Agent Log
- 2026-08-04T23:00:00Z — Analyzed requirements and updated components in src/components/
```

### Step 4: Complete the Task
Mark `status` as `done`:

```bash
node cli/index.js task done <task-slug>
```

---

## 3. Creating New Tasks as an Agent

When you identify follow-up items, subtasks, or bugs, create a new task:

```bash
node cli/index.js task create \
  --project orbit \
  --title "Add dark mode toggle" \
  --priority medium \
  --assignee claude \
  --tags "ui,theme"
```

Or write a file directly to `src/content/tasks/<project>--<slug>.md`:

```yaml
---
title: "Add dark mode toggle"
project: "orbit"
status: "todo"
priority: "medium"
assignee: "claude"
tags: ["ui", "theme"]
due: "2026-08-10"
order: 100
parent: ""
created: "2026-08-04"
updated: "2026-08-04"
blocked_by: []
---

## Description
Task created automatically by Claude AI Agent.
```

---

## 4. File Schema Reference

- Projects directory: `src/content/projects/*.md`
- Tasks directory: `src/content/tasks/*.md`
- Agent profiles: `src/content/agents/*.md`
