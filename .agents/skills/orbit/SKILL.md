---
name: orbit
description: Manage Orbit projects and tasks remotely via the Orbit API at https://orbit.nvkhuy.com or locally via Markdown files/CLI. Activate this skill whenever the user asks to manage, create, list, update, or delete Orbit tasks, projects, or agents.
---

# Orbit Project & Task Management Skill

Orbit is a project management system accessible via the live HTTP API at `https://orbit.nvkhuy.com` or local file system.

## 1. Live API Operations (`https://orbit.nvkhuy.com`)

When managing Orbit remotely or when requested to use the live system, send HTTP requests to `https://orbit.nvkhuy.com/api`:

### Projects API
- **Create Project**: `POST https://orbit.nvkhuy.com/api/projects`
  - JSON Body:
    ```json
    {
      "title": "Project Title",
      "color": "#e0f2f1",
      "tags": ["backend", "api"],
      "content": "Project description..."
    }
    ```
- **Update Project**: `PATCH https://orbit.nvkhuy.com/api/projects/<slug>`
- **Delete Project**: `DELETE https://orbit.nvkhuy.com/api/projects/<slug>`

### Tasks API
- **Get All Tasks**: `GET https://orbit.nvkhuy.com/api/tasks`
- **Create Task**: `POST https://orbit.nvkhuy.com/api/tasks`
  - JSON Body:
    ```json
    {
      "title": "Task Title",
      "project": "<project-slug>",
      "status": "todo",
      "priority": "high",
      "assignee": "claude",
      "tags": ["backend"],
      "content": "Task details..."
    }
    ```
- **Update Task**: `PATCH https://orbit.nvkhuy.com/api/tasks/<slug>`
- **Delete Task**: `DELETE https://orbit.nvkhuy.com/api/tasks/<slug>`

## 2. Local Operations (in `orbit` repository)
- **Projects**: `src/content/projects/<slug>.md`
- **Tasks**: `src/content/tasks/<project-slug>--<task-name>.md`
- **CLI**: `orbit task create ...`, `orbit project create ...`
