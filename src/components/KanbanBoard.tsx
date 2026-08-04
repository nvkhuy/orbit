import { useState } from 'preact/hooks';

export interface TaskItem {
  slug: string;
  title: string;
  project: string;
  status: 'todo' | 'in-progress' | 'in-review' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  tags?: string[];
  due?: string;
  order: number;
  parent?: string;
  created: string;
  updated: string;
  content?: string;
}

export interface ProjectItem {
  slug: string;
  title: string;
  color?: string;
  status?: string;
}

interface Props {
  initialTasks: TaskItem[];
  projects: ProjectItem[];
  selectedProject?: string;
}

export default function KanbanBoard({ initialTasks, projects, selectedProject = '' }: Props) {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [activeProject, setActiveProject] = useState<string>(selectedProject);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [groupBy, setGroupBy] = useState<'status' | 'project' | 'assignee' | 'priority'>('status');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [draggedSlug, setDraggedSlug] = useState<string | null>(null);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  // Status column definitions
  const columns: { id: TaskItem['status']; label: string; icon: string }[] = [
    { id: 'todo', label: 'Todo', icon: '📌' },
    { id: 'in-progress', label: 'In Progress', icon: '✏️' },
    { id: 'in-review', label: 'In Review', icon: '🔍' },
    { id: 'done', label: 'Done', icon: '✅' },
    { id: 'blocked', label: 'Blocked', icon: '🚫' },
  ];

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (activeProject && t.project !== activeProject) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchTag = t.tags?.some((tag) => tag.toLowerCase().includes(q));
      const matchAssignee = t.assignee.toLowerCase().includes(q);
      if (!matchTitle && !matchTag && !matchAssignee) return false;
    }
    return true;
  });

  // Handle Drag Start & Over & Drop
  const handleDragStart = (slug: string) => {
    setDraggedSlug(slug);
  };

  const handleDragOver = (e: JSX.TargetedEvent<HTMLDivElement, DragEvent>) => {
    e.preventDefault();
  };

  const handleDropColumn = async (targetStatus: TaskItem['status']) => {
    if (!draggedSlug) return;
    const task = tasks.find((t) => t.slug === draggedSlug);
    if (!task || task.status === targetStatus) {
      setDraggedSlug(null);
      return;
    }

    // Calculate new order (last in target column + 100)
    const targetColumnTasks = tasks.filter((t) => t.status === targetStatus);
    const maxOrder = targetColumnTasks.reduce((max, t) => Math.max(max, t.order || 0), 0);
    const newOrder = maxOrder + 100;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.slug === draggedSlug ? { ...t, status: targetStatus, order: newOrder } : t))
    );
    setLoadingSlug(draggedSlug);
    setDraggedSlug(null);

    try {
      await fetch(`/api/tasks/${draggedSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus, order: newOrder }),
      });
    } catch (err) {
      console.error('Failed to update task status:', err);
    } finally {
      setLoadingSlug(null);
    }
  };

  const cycleStatus = async (slug: string, currentStatus: TaskItem['status']) => {
    const statusOrder: TaskItem['status'][] = ['todo', 'in-progress', 'in-review', 'done'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

    setTasks((prev) => prev.map((t) => (t.slug === slug ? { ...t, status: nextStatus } : t)));
    setLoadingSlug(slug);

    try {
      await fetch(`/api/tasks/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (err) {
      console.error('Failed to cycle status:', err);
    } finally {
      setLoadingSlug(null);
    }
  };

  return (
    <div className="kanban-wrapper">
      {/* Filter & Control Bar */}
      <div className="board-controls wobbly-box-sm">
        <div className="control-group">
          <label className="control-label">📁 Project:</label>
          <select
            className="input-sketch input-select"
            value={activeProject}
            onChange={(e) => setActiveProject((e.target as HTMLSelectElement).value)}
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label className="control-label">🔥 Priority:</label>
          <select
            className="input-sketch input-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority((e.target as HTMLSelectElement).value)}
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="control-group search-group">
          <input
            type="text"
            className="input-sketch"
            placeholder="🔎 Search tasks or assignees..."
            value={searchQuery}
            onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
          />
        </div>

        <a href="/new" className="btn-sketch btn-sketch-yellow">
          + Add Task
        </a>
      </div>

      {/* Board Columns Grid */}
      <div className="columns-grid">
        {columns.map((col) => {
          const colTasks = filteredTasks
            .filter((t) => t.status === col.id)
            .sort((a, b) => a.order - b.order);

          return (
            <div
              key={col.id}
              className={`kanban-column column-${col.id}`}
              onDragOver={handleDragOver}
              onDrop={() => handleDropColumn(col.id)}
            >
              <div className="column-header">
                <h3>
                  {col.icon} {col.label} <span className="column-count">({colTasks.length})</span>
                </h3>
              </div>

              <div className="column-cards">
                {colTasks.length === 0 ? (
                  <div className="empty-column-placeholder">
                    <p>No tasks in {col.label}</p>
                  </div>
                ) : (
                  colTasks.map((t) => {
                    const isDragging = draggedSlug === t.slug;
                    const isLoading = loadingSlug === t.slug;

                    return (
                      <div
                        key={t.slug}
                        className={`wobbly-box task-card ${isDragging ? 'dragging' : ''} ${
                          isLoading ? 'loading' : ''
                        }`}
                        draggable
                        onDragStart={() => handleDragStart(t.slug)}
                      >
                        <div className="card-top">
                          <span className={`badge-sketch badge-${t.priority}`}>{t.priority}</span>
                          <span
                            className="card-project-pill"
                            style={{
                              backgroundColor:
                                projects.find((p) => p.slug === t.project)?.color || '#fff9c4',
                            }}
                          >
                            {t.project}
                          </span>
                        </div>

                        <a href={`/tasks/${t.slug}`} className="card-title-link">
                          <h4>{t.title}</h4>
                        </a>

                        {t.parent && (
                          <div className="subtask-indicator">
                            ↳ Subtask of <code>{t.parent}</code>
                          </div>
                        )}

                        <div className="card-footer">
                          <button
                            type="button"
                            className={`badge-sketch badge-${t.status} status-toggle-btn`}
                            onClick={() => cycleStatus(t.slug, t.status)}
                            title="Click to cycle status"
                          >
                            {t.status}
                          </button>

                          <div className="assignee-avatar" title={`Assigned to ${t.assignee}`}>
                            {t.assignee.toLowerCase() === 'claude' ||
                            t.assignee.toLowerCase() === 'copilot'
                              ? '🤖 '
                              : '🧑 '}
                            <span>{t.assignee}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
