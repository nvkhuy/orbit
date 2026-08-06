---
name: orbit
description: Manage Orbit projects and tasks remotely via the Orbit API at https://orbit.nvkhuy.com or locally via localhost:4321 / Markdown files / CLI. Activate this skill whenever the user asks to manage, create, list, update, or delete Orbit tasks, projects, or agents.
---

# 🪐 Orbit Project & Task Management Skill

Orbit is a serverless, local-first project management system where all data lives as standard Markdown files in `src/content/`.

---

## 1. API Constants & Base URLs

Re-use these environment constants for HTTP API calls:
- **Remote API Base**: `ORBIT_REMOTE_BASE_URL = "https://orbit.nvkhuy.com"`
- **Local API Base (Default)**: `ORBIT_LOCAL_BASE_URL = "http://localhost:4321"`

Select the base URL based on execution context:
- Use `ORBIT_REMOTE_BASE_URL` (`https://orbit.nvkhuy.com`) when managing Orbit remotely over the web.
- Use `ORBIT_LOCAL_BASE_URL` (`http://localhost:4321`) by default when the user requests local server operations.

---

## 2. API Endpoints (`/api/*`)

Works identically on remote (`https://orbit.nvkhuy.com`) and local (`http://localhost:4321`):

### Projects API
- **Get All Projects**: `GET <BASE_URL>/api/projects`
- **Create Project**: `POST <BASE_URL>/api/projects`
  - JSON Body:
    ```json
    {
      "title": "Project Title",
      "color": "#e3f2fd",
      "tags": ["backend", "api"],
      "content": "Project description..."
    }
    ```
- **Update Project**: `PATCH <BASE_URL>/api/projects/<slug>`
- **Delete Project**: `DELETE <BASE_URL>/api/projects/<slug>`

### Tasks API
- **Get All Tasks**: `GET <BASE_URL>/api/tasks`
- **Create Task**: `POST <BASE_URL>/api/tasks`
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
- **Update Task**: `PATCH <BASE_URL>/api/tasks/<slug>`
- **Delete Task**: `DELETE <BASE_URL>/api/tasks/<slug>`

---

## 3. Project Creation & Sketch Style Color Guidelines

When creating a new project, choose a color that matches Orbit's hand-drawn paper sketch aesthetic.

### Sketch Color Guidelines
- Orbit uses a hand-crafted paper card aesthetic with soft pencil black outlines (`#2d2d2d`).
- Project background colors MUST use soft pastel hues to preserve readability and maintain visual harmony.
- **NEVER** use dark backgrounds or harsh/neon colors (e.g., pure red `#ff0000`, neon green `#00ff00`).

### Recommended Sketch Color Palette
| Category | Hex | Color Name |
| --- | --- | --- |
| Engineering & Tech | `#e3f2fd` | Pastel Sky Blue |
| Features & Product | `#fff9c4` | Post-it Yellow |
| Business & Partnerships | `#dcedc8` | Mint Green |
| Design & Creative | `#f3e5f5` | Lavender |
| Customer & Support | `#fce4ec` | Pastel Pink |
| Data & Analytics | `#ffecb3` | Soft Amber |
| Mobile & Apps | `#e1f5fe` | Ice Blue |
| Security & Compliance | `#f8bbd0` | Blush Pink |
| Design System | `#e1bee7` | Lilac |
| AI & Research | `#ede7f6` | Soft Violet |
| Content & Marketing | `#fff3e0` | Warm Peach |
| Sales & Operations | `#e8f5e9` | Meadow Green |
| Community & Growth | `#e0f7fa` | Pastel Aqua |
| Developer Experience | `#e8eaf6` | Soft Indigo |
| Innovation & Sandbox | `#e0f2f1` | Pastel Teal |

---

## 4. Local File System & CLI Operations

When working directly inside the `orbit` repository:
- **Projects**: `src/content/projects/<slug>.md`
- **Tasks**: `src/content/tasks/<project-slug>--<task-name>.md`
- **Agents**: `src/content/agents/<agent-name>.md`
- **CLI Tool**: `orbit task create ...`, `orbit project create ...` or `node cli/index.js`
