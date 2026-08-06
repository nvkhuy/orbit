import { useState } from 'preact/hooks';
import type { Task, Project } from './KanbanBoard';
import SketchSelect from './SketchSelect';
import SketchDatePicker from './SketchDatePicker';
import { SketchTrashIcon } from './SketchIcons';

interface TaskListViewProps {
  initialTasks: Task[];
  projects: Project[];
}

export default function TaskListView({ initialTasks, projects }: TaskListViewProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'project' | 'status' | 'priority' | 'due' | 'order'>('order');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Modal State
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isSavingModal, setIsSavingModal] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Options
  const projectOptions = [
    { value: '', label: 'All Projects' },
    ...projects.map(p => ({ value: p.slug, label: p.title }))
  ];

  const statusFilterOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'todo', label: 'Todo' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'in-review', label: 'In Review' },
    { value: 'done', label: 'Done' },
  ];

  const priorityFilterOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const modalStatusOptions = [
    { value: 'todo', label: 'todo' },
    { value: 'in-progress', label: 'in-progress' },
    { value: 'in-review', label: 'in-review' },
    { value: 'done', label: 'done' },
  ];

  const modalPriorityOptions = [
    { value: 'critical', label: 'critical' },
    { value: 'high', label: 'high' },
    { value: 'medium', label: 'medium' },
    { value: 'low', label: 'low' },
  ];

  const modalProjectOptions = projects.map(p => ({ value: p.slug, label: p.title }));

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const cycleStatus = async (task: Task, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    const statuses = ['todo', 'in-progress', 'in-review', 'done'];
    const nextStatus = statuses[(statuses.indexOf(task.status) + 1) % statuses.length];

    setTasks(prev => prev.map(t => t.slug === task.slug ? { ...t, status: nextStatus } : t));

    try {
      await fetch(`/api/tasks/${task.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const updateField = async (task: Task, field: string, value: any, e?: Event) => {
    if (e) e.stopPropagation();
    setTasks(prev => prev.map(t => t.slug === task.slug ? { ...t, [field]: value } : t));

    try {
      await fetch(`/api/tasks/${task.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const promptDeleteTask = (task: Task, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setTaskToDelete(task);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    const slug = taskToDelete.slug;

    setTasks(prev => prev.filter(t => t.slug !== slug));
    if (activeTask?.slug === slug) setActiveTask(null);
    setTaskToDelete(null);

    try {
      await fetch(`/api/tasks/${slug}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleSaveModal = async () => {
    if (!activeTask) return;
    setIsSavingModal(true);

    try {
      await fetch(`/api/tasks/${activeTask.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeTask.title,
          status: activeTask.status,
          priority: activeTask.priority,
          project: activeTask.project,
          assignee: activeTask.assignee,
          due: activeTask.due,
          content: activeTask.content,
        }),
      });

      setTasks(prev => prev.map(t => t.slug === activeTask.slug ? { ...activeTask } : t));
      setActiveTask(null);
    } catch (err) {
      console.error('Failed to save task modal:', err);
    } finally {
      setIsSavingModal(false);
    }
  };

  // Filter tasks
  let filtered = tasks.filter(t => {
    if (projectFilter && t.project !== projectFilter) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    if (priorityFilter && t.priority !== priorityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.project.toLowerCase().includes(q);
    }
    return true;
  });

  // Sort tasks
  filtered.sort((a, b) => {
    let valA = a[sortBy] || '';
    let valB = b[sortBy] || '';
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'critical': return '#ff8a80';
      case 'high': return '#ffd54f';
      case 'medium': return '#fff59d';
      case 'low': return '#a5d6a7';
      default: return '#e0e0e0';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Filters */}
      <div 
        class="wobbly-border-sm" 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          padding: '0.6rem 1rem',
          boxShadow: 'var(--shadow)',
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={searchQuery}
          onInput={(e: any) => setSearchQuery(e.target.value)}
          class="sketch-input"
          style={{ width: '180px', padding: '0.25rem 0.6rem', fontSize: '0.9rem' }}
        />

        <SketchSelect
          value={projectFilter}
          options={projectOptions}
          onChange={(val) => setProjectFilter(val)}
          style={{ width: '140px' }}
        />

        <SketchSelect
          value={statusFilter}
          options={statusFilterOptions}
          onChange={(val) => setStatusFilter(val)}
          style={{ width: '130px' }}
        />

        <SketchSelect
          value={priorityFilter}
          options={priorityFilterOptions}
          onChange={(val) => setPriorityFilter(val)}
          style={{ width: '130px' }}
        />
      </div>

      {/* List Table */}
      <div class="sketch-card" style={{ padding: '0.75rem 1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px dashed var(--border)', fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>
              <th style={{ padding: '0.5rem', cursor: 'pointer' }} onClick={() => handleSort('title')}>
                Task Title {sortBy === 'title' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th style={{ padding: '0.5rem', cursor: 'pointer' }} onClick={() => handleSort('project')}>
                Project {sortBy === 'project' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th style={{ padding: '0.5rem', cursor: 'pointer' }} onClick={() => handleSort('status')}>
                Status {sortBy === 'status' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th style={{ padding: '0.5rem', cursor: 'pointer' }} onClick={() => handleSort('priority')}>
                Priority {sortBy === 'priority' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th style={{ padding: '0.5rem' }}>Assignee</th>
              <th style={{ padding: '0.5rem', cursor: 'pointer' }} onClick={() => handleSort('due')}>
                Due Date {sortBy === 'due' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '1.5rem', fontStyle: 'italic', color: '#777' }}>
                  No tasks found matching your filters.
                </td>
              </tr>
            ) : (
              filtered.map(t => (
                <tr 
                  key={t.slug} 
                  style={{ 
                    borderBottom: '1px solid var(--muted)',
                    backgroundColor: t.status === 'done' ? 'rgba(0,0,0,0.02)' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveTask(t)}
                >
                  <td style={{ padding: '0.5rem' }}>
                    <span 
                      style={{ 
                        fontFamily: 'var(--font-heading)', 
                        fontSize: '1.1rem', 
                        color: 'var(--fg)', 
                        textDecoration: t.status === 'done' ? 'line-through' : 'none' 
                      }}
                    >
                      {t.parent ? `↳ ${t.title}` : t.title}
                    </span>
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <span class="wobbly-border-sm" style={{ padding: '0.1rem 0.4rem', backgroundColor: 'var(--bg)', fontSize: '0.85rem' }}>
                      {t.project}
                    </span>
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <button
                      onClick={(e) => cycleStatus(t, e)}
                      style={{
                        padding: '0.15rem 0.5rem',
                        borderRadius: '12px',
                        border: '1.5px solid var(--border)',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        backgroundColor: t.status === 'done' ? '#c8e6c9' : t.status === 'in-progress' ? '#bbdefb' : '#fff9c4',
                      }}
                    >
                      {t.status}
                    </button>
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <SketchSelect
                      value={t.priority}
                      options={modalPriorityOptions}
                      onChange={(val) => updateField(t, 'priority', val)}
                      bgColor={getPriorityColor(t.priority)}
                      style={{ width: '100px' }}
                    />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <input
                      type="text"
                      value={t.assignee || ''}
                      placeholder="unassigned"
                      onClick={(e) => e.stopPropagation()}
                      onBlur={(e: any) => updateField(t, 'assignee', e.target.value, e)}
                      style={{
                        border: 'none',
                        borderBottom: '1px dashed var(--border)',
                        backgroundColor: 'transparent',
                        width: '90px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.5rem', fontSize: '0.9rem' }}>
                    {t.due || '-'}
                  </td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                    <button
                      onClick={(e) => promptDeleteTask(t, e)}
                      title="Delete Task"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.2rem 0.4rem',
                        color: 'var(--fg)',
                        opacity: 0.6,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justify: 'center',
                      }}
                      onMouseEnter={(e: any) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = 'var(--accent)'; }}
                      onMouseLeave={(e: any) => { e.currentTarget.style.opacity = 0.6; e.currentTarget.style.color = 'var(--fg)'; }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Task Card Details Popup Modal */}
      {activeTask && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            padding: '1.5rem',
            boxSizing: 'border-box',
          }}
          onClick={() => setActiveTask(null)}
        >
          <div
            class="sketch-card postit"
            data-decoration="tape"
            style={{
              width: '100%',
              maxWidth: '580px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#fff9c4',
              boxShadow: 'var(--shadow-lg)',
              padding: '1.5rem',
              transform: 'rotate(-0.5deg)',
              margin: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--fg)' }}>
                ✏️ Edit Task Card
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  onClick={() => promptDeleteTask(activeTask)}
                  class="sketch-button secondary"
                  style={{ padding: '0.2rem 0.6rem', fontSize: '0.9rem', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                  Delete
                </button>
                <button
                  onClick={() => setActiveTask(null)}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '0 0.4rem', color: 'var(--fg)' }}
                >
                  ✖
                </button>
              </div>
            </div>

            {/* Form inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.2rem' }}>Task Title</label>
                <input
                  type="text"
                  value={activeTask.title}
                  onInput={(e: any) => setActiveTask({ ...activeTask, title: e.target.value })}
                  class="sketch-input"
                  style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>Status</label>
                  <SketchSelect
                    value={activeTask.status}
                    options={modalStatusOptions}
                    onChange={(val) => setActiveTask({ ...activeTask, status: val })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>Priority</label>
                  <SketchSelect
                    value={activeTask.priority}
                    options={modalPriorityOptions}
                    onChange={(val) => setActiveTask({ ...activeTask, priority: val as any })}
                    bgColor={getPriorityColor(activeTask.priority)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>Project</label>
                  <SketchSelect
                    value={activeTask.project}
                    options={modalProjectOptions}
                    onChange={(val) => setActiveTask({ ...activeTask, project: val })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold' }}>Assignee</label>
                  <input
                    type="text"
                    value={activeTask.assignee || ''}
                    placeholder="e.g. huy"
                    onInput={(e: any) => setActiveTask({ ...activeTask, assignee: e.target.value })}
                    class="sketch-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold' }}>Due Date</label>
                  <SketchDatePicker
                    value={activeTask.due || ''}
                    onChange={(val) => setActiveTask({ ...activeTask, due: val })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.2rem' }}>Markdown Notes</label>
                <textarea
                  rows={4}
                  value={activeTask.content || ''}
                  onInput={(e: any) => setActiveTask({ ...activeTask, content: e.target.value })}
                  class="sketch-input"
                  placeholder="Task details, notes, checklists..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  class="sketch-button secondary"
                  onClick={() => setActiveTask(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="sketch-button"
                  disabled={isSavingModal}
                  onClick={handleSaveModal}
                >
                  {isSavingModal ? 'Saving...' : '💾 Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* In-App Delete Confirmation Modal */}
      {taskToDelete && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            padding: '1.5rem',
            boxSizing: 'border-box',
          }}
          onClick={() => setTaskToDelete(null)}
        >
          <div
            class="sketch-card"
            data-decoration="tack"
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#ffffff',
              boxShadow: 'var(--shadow-lg)',
              padding: '1.5rem',
              textAlign: 'center',
              transform: 'rotate(1deg)',
              margin: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: '0.75rem', color: 'var(--fg)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <SketchTrashIcon size={24} color="#ff8a80" />
              <span>Delete Task?</span>
            </h3>
            <p style={{ fontSize: '1.05rem', marginBottom: '1.5rem', color: '#444' }}>
              Are you sure you want to delete <strong>"{taskToDelete.title}"</strong>?
              <br />
              <span style={{ fontSize: '0.9rem', color: '#888' }}>This will permanently remove its Markdown file.</span>
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                class="sketch-button secondary"
                onClick={() => setTaskToDelete(null)}
              >
                Cancel
              </button>
              <button
                class="sketch-button"
                style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}
                onClick={confirmDeleteTask}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
