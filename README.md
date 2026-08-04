<div align="center">

<img src="./public/orbit-hero.jpg" alt="Orbit — Kanban board with hand-drawn sketch UI and integrated terminal for AI agents" width="100%" />

# 🪐 Orbit

### Projects and agents revolve around one shared workspace.

**The project management tool where humans and AI agents are equal collaborators.**<br/>
No server. No database. Just markdown files, a beautiful UI, and a CLI.

[Getting Started](#-getting-started) · [How It Works](#-how-it-works) · [For AI Agents](#-for-ai-agents) · [Commands](#-cli-reference) · [Contributing](#-contributing)

---

![Astro](https://img.shields.io/badge/Astro-5.x-BC52EE?style=for-the-badge&logo=astro&logoColor=white)
![Preact](https://img.shields.io/badge/Preact-10.x-673AB8?style=for-the-badge&logo=preact&logoColor=white)
![Markdown](https://img.shields.io/badge/Data-Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)

</div>

---

## ✨ Why Orbit?

Most project management tools force you to choose: **powerful UI for humans** *or* **API access for automation**. Orbit gives you both — without a server, without a database, without vendor lock-in.

<table>
<tr>
<td width="50%">

### 🧑 For Humans
- Drag-and-drop Kanban board
- Create, edit, move tasks from the browser
- Project progress bars & dashboards
- Subtasks, checklists, and rich markdown notes
- Filter & group by project, assignee, priority
- Hand-drawn sketch UI that sparks joy ✏️

</td>
<td width="50%">

### 🤖 For AI Agents
- Read/write markdown files directly — zero dependencies
- Optional `orbit` CLI for structured commands
- Frontmatter schema = machine-readable metadata
- Git-trackable — every change has an author
- No API keys, no auth, no rate limits
- Works with Claude, Cursor, Copilot, any agent

</td>
</tr>
</table>

> **The secret?** There's no database. Your data is just `.md` files in a folder.<br/>
> The UI reads them. The CLI reads them. Agents read them. One source of truth.

---

## 🏗 Architecture

```
                    ┌──────────────────────────────────────────┐
                    │           src/content/*.md               │
                    │         (single source of truth)         │
                    │                                          │
                    │   projects/    tasks/    agents/          │
                    └──────┬──────────────┬────────────────────┘
                           │              │
                    ┌──────▼──────┐ ┌─────▼──────┐
                    │   Astro UI  │ │  orbit CLI  │
                    │  (browser)  │ │  (terminal) │
                    │             │ │             │
                    │  Humans     │ │  AI Agents  │
                    │  drag, drop │ │  read,write │
                    │  click,edit │ │  .md files  │
                    └─────────────┘ └─────────────┘
```

- **Astro 5 (hybrid)** — SSG for blazing-fast page loads, SSR for API routes that write files
- **Preact islands** — interactive drag-and-drop board with minimal JavaScript
- **Vanilla CSS** — hand-drawn sketch design system, no Tailwind
- **gray-matter** — parse and stringify markdown frontmatter
- **Commander** — lightweight CLI for agent-friendly commands

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ 
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/nvkhuy/orbit.git
cd orbit

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) — your workspace is ready.

### Create Your First Task

**From the UI:**

Click the **"+"** button on any column, or press <kbd>N</kbd> to open Quick Create.

**From the terminal:**

```bash
npx orbit task create \
  --project my-project \
  --title "Build something amazing" \
  --priority high
```

**Or just create a file:**

```bash
cat > src/content/tasks/my-project--first-task.md << 'EOF'
---
title: "Build something amazing"
project: my-project
status: todo
priority: high
assignee: huy
order: 100
parent: ""
tags: [feature]
due: 2026-08-10
created: 2026-08-04
updated: 2026-08-04
blocked_by: []
---

## Description
Let's build something amazing today.

## Checklist
- [ ] Step one
- [ ] Step two
- [ ] Ship it 🚀
EOF
```

All three methods produce the exact same result — a markdown file in `src/content/tasks/`.

---

## 🔮 How It Works

### Data Model

Everything is a markdown file with YAML frontmatter:

```
src/content/
├── projects/
│   └── orbit.md              # Project metadata + description
├── tasks/
│   ├── orbit--setup.md       # Task with status, priority, order
│   └── orbit--design.md      # Subtasks via `parent` field
└── agents/
    └── claude.md             # Agent profile & permissions
```

### Task Schema

```yaml
---
title: "Implement drag-and-drop"
project: orbit                 # Which project
status: in-progress            # todo | in-progress | in-review | done | blocked
priority: high                 # low | medium | high | critical
assignee: huy                  # Human or agent name
order: 200                     # Position in column (gap numbering)
parent: ""                     # Parent task slug (for subtasks)
tags: [ui, feature]
due: 2026-08-15
created: 2026-08-04
updated: 2026-08-04
blocked_by: []
---

Free-form markdown body: descriptions, checklists, notes, logs.
```

### Drag-and-Drop → File Changes

Every UI interaction maps to a simple frontmatter edit:

| You do this in the UI | This changes in the `.md` file |
|---|---|
| Drag card to "In Progress" column | `status: todo` → `status: in-progress` |
| Drag card up in a column | `order: 300` → `order: 150` |
| Drag card to a different project | `project: orbit` → `project: other` |
| Indent a task | `parent: ""` → `parent: "orbit--setup"` |
| Click the "+" button | New `.md` file created |

---

## 🤖 For AI Agents

Orbit is designed from day one to be agent-friendly. No API keys. No authentication. No SDK required.

### Option 1: Direct File Access

Just read and write `.md` files. That's it.

```bash
# Read all tasks for a project
ls src/content/tasks/orbit--*.md

# Read a task's metadata
head -20 src/content/tasks/orbit--setup.md

# Update a task's status
sed -i 's/status: todo/status: in-progress/' src/content/tasks/orbit--setup.md

# Create a new task
cat > src/content/tasks/orbit--new-feature.md << 'EOF'
---
title: "New feature"
project: orbit
status: todo
priority: medium
assignee: claude
order: 300
parent: ""
tags: [feature]
created: 2026-08-04
updated: 2026-08-04
blocked_by: []
---

## Agent Log
- 2026-08-04T15:30:00Z — Created this task after analyzing codebase.
EOF
```

### Option 2: CLI Commands

For agents that prefer structured commands:

```bash
# Create
npx orbit task create --project orbit --title "Fix bug" --priority critical

# Update
npx orbit task update orbit--fix-bug --status in-progress --assignee claude

# Query
npx orbit task list --project orbit --status todo
npx orbit query "priority:high AND status:todo"

# Complete
npx orbit task done orbit--fix-bug

# Get a summary of the entire workspace
npx orbit summary
```

### Agent Conventions

| Convention | Description |
|---|---|
| **Claim a task** | Set `assignee: <your-name>` and `status: in-progress` |
| **Log your work** | Append timestamped entries under `## Agent Log` |
| **Mark complete** | Set `status: done` and update `updated` timestamp |
| **Report blockers** | Set `status: blocked` and explain in the body |

See [`AGENTS.md`](./AGENTS.md) for the full agent integration guide.

---

## 📋 CLI Reference

```
Usage: orbit <command> [options]

Commands:
  task create     Create a new task
  task update     Update task fields
  task list       List tasks with filters
  task done       Mark a task as done
  project create  Create a new project
  project list    List all projects
  query           Search tasks with expressions
  summary         Print a workspace overview

Options:
  --project       Filter by project slug
  --status        Filter by status (todo|in-progress|in-review|done|blocked)
  --priority      Filter by priority (low|medium|high|critical)
  --assignee      Filter by assignee name
  --tags          Filter by tags (comma-separated)
  -h, --help      Show help
```

---

## 🎨 Design System

Orbit uses a **hand-drawn sketch aesthetic** — wobbly borders, paper textures, handwritten fonts, and hard offset shadows. It's intentionally imperfect and playfully human.

| Token | Value | Purpose |
|---|---|---|
| Background | `#fdfbf7` | Warm paper |
| Foreground | `#2d2d2d` | Soft pencil black |
| Accent | `#ff4d4d` | Red correction marker |
| Blue | `#2d5da1` | Ballpoint pen |
| Post-it | `#fff9c4` | Sticky note yellow |
| Heading font | `Kalam` | Felt-tip marker |
| Body font | `Patrick Hand` | Handwritten |
| Borders | Wobbly `border-radius` | Irregular, organic shapes |
| Shadows | `4px 4px 0px` | Hard offset, no blur |

See [`sketch_style.md`](./sketch_style.md) for the full design system specification.

---

## 📁 Project Structure

```
orbit/
├── astro.config.mjs           # Astro 5 hybrid config
├── package.json
├── AGENTS.md                  # AI agent integration guide
├── sketch_style.md            # Design system spec
│
├── cli/                       # orbit CLI tool
│   ├── index.js
│   └── commands/
│       ├── task.js
│       ├── project.js
│       └── query.js
│
├── src/
│   ├── content/               # 📂 YOUR DATA LIVES HERE
│   │   ├── config.ts          # Content collection schemas
│   │   ├── projects/          # Project .md files
│   │   ├── tasks/             # Task .md files
│   │   └── agents/            # Agent profile .md files
│   │
│   ├── components/            # Astro + Preact components
│   │   ├── KanbanBoard.tsx    # Interactive board (Preact island)
│   │   ├── TaskCard.astro     # Card with wobbly borders
│   │   ├── QuickCreate.tsx    # Create modal (Preact island)
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── index.astro        # Dashboard
│   │   ├── board.astro        # Kanban board
│   │   ├── list.astro         # List view
│   │   ├── api/               # Server-side write endpoints
│   │   │   ├── tasks/
│   │   │   └── projects/
│   │   ├── projects/[slug].astro
│   │   └── tasks/[slug].astro
│   │
│   └── styles/
│       ├── global.css         # Design tokens & paper texture
│       ├── components.css     # Wobbly borders, cards, buttons
│       └── animations.css     # Jiggle, bounce, press-flat
│
└── public/
    └── fonts/                 # Self-hosted Kalam & Patrick Hand
```

---

## 🗺 Roadmap

- [x] Project plan & architecture
- [ ] Phase 1: Foundation (Astro setup, design system, content schemas)
- [ ] Phase 2: Core views (Dashboard, Board, List, Detail pages)
- [ ] Phase 3: Interactivity (Drag-drop, inline edit, subtasks, search)
- [ ] Phase 4: CLI tool for AI agents
- [ ] Phase 5: Polish (Animations, responsive, documentation)

---

## 🤝 Contributing

Contributions are welcome! Whether you're a human or an AI agent, here's how to help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### For AI Agents Contributing

```bash
# 1. Read the workspace
npx orbit summary

# 2. Pick a task
npx orbit task update <slug> --assignee <your-name> --status in-progress

# 3. Do the work, then mark done
npx orbit task done <slug>
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

<div align="center">

**Built with ❤️ by [Huy](https://github.com/nvkhuy)**

*Where humans and AI agents collaborate as equals.*

🪐

</div>
