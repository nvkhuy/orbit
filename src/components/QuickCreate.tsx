import { useState } from 'preact/hooks';
import type { Project } from './KanbanBoard';
import SketchSelect from './SketchSelect';

interface QuickCreateProps {
  projects: Project[];
  initialMode?: 'task' | 'project';
}

export default function QuickCreate({ projects, initialMode = 'task' }: QuickCreateProps) {
  const [mode, setMode] = useState<'task' | 'project'>(initialMode);

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskProject, setTaskProject] = useState(projects[0]?.slug || 'orbit');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskStatus, setTaskStatus] = useState('todo');
  const [taskContent, setTaskContent] = useState('');

  // Project form state
  const [projTitle, setProjTitle] = useState('');
  const [projColor, setProjColor] = useState('#fff9c4');
  const [projContent, setProjContent] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const projectOptions = projects.map(p => ({ value: p.slug, label: p.title }));
  const priorityOptions = [
    { value: 'critical', label: '🔥 Critical' },
    { value: 'high', label: '⚡ High' },
    { value: 'medium', label: '📌 Medium' },
    { value: 'low', label: '🌱 Low' },
  ];
  const statusOptions = [
    { value: 'todo', label: 'Todo' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'in-review', label: 'In Review' },
    { value: 'done', label: 'Done' },
  ];

  const handleCreateTask = async (e: Event) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskTitle,
          project: taskProject,
          priority: taskPriority,
          assignee: taskAssignee,
          status: taskStatus,
          content: taskContent,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(`Task created successfully! Redirecting...`);
        setTimeout(() => {
          window.location.href = `/tasks/${data.slug}`;
        }, 1000);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: Event) => {
    e.preventDefault();
    if (!projTitle.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projTitle,
          color: projColor,
          content: projContent,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(`Project created successfully! Redirecting...`);
        setTimeout(() => {
          window.location.href = `/projects/${data.slug}`;
        }, 1000);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Mode Switcher */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
        <button
          class={`sketch-button ${mode === 'task' ? '' : 'secondary'}`}
          onClick={() => setMode('task')}
          style={{ fontSize: '1.1rem', padding: '0.4rem 1.25rem' }}
        >
          ✏️ Create Task
        </button>
        <button
          class={`sketch-button ${mode === 'project' ? '' : 'secondary'}`}
          onClick={() => setMode('project')}
          style={{ fontSize: '1.1rem', padding: '0.4rem 1.25rem' }}
        >
          📁 Create Project
        </button>
      </div>

      {message && (
        <div 
          class="wobbly-border-sm" 
          style={{ padding: '0.75rem', marginBottom: '1.25rem', backgroundColor: '#e8f5e9', textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}
        >
          {message}
        </div>
      )}

      {/* Task Creation Form */}
      {mode === 'task' ? (
        <form onSubmit={handleCreateTask} class="sketch-card postit" data-decoration="tape" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style="font-size: 1.75rem; margin-bottom: 0.25rem; text-align: center;">New Task Card</h2>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.2rem' }}>Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Design Board View"
              value={taskTitle}
              onInput={(e: any) => setTaskTitle(e.target.value)}
              class="sketch-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.2rem' }}>Project</label>
              <SketchSelect
                value={taskProject}
                options={projectOptions}
                onChange={(val) => setTaskProject(val)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.2rem' }}>Priority</label>
              <SketchSelect
                value={taskPriority}
                options={priorityOptions}
                onChange={(val) => setTaskPriority(val)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.2rem' }}>Assignee</label>
              <input
                type="text"
                placeholder="e.g. huy or claude"
                value={taskAssignee}
                onInput={(e: any) => setTaskAssignee(e.target.value)}
                class="sketch-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.2rem' }}>Initial Status</label>
              <SketchSelect
                value={taskStatus}
                options={statusOptions}
                onChange={(val) => setTaskStatus(val)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.2rem' }}>Task Notes / Description (Markdown)</label>
            <textarea
              rows={4}
              placeholder="Add details, checklists, links..."
              value={taskContent}
              onInput={(e: any) => setTaskContent(e.target.value)}
              class="sketch-input"
              style={{ fontFamily: 'var(--font-body)', resize: 'vertical' }}
            />
          </div>

          <button type="submit" disabled={loading} class="sketch-button" style={{ width: '100%', marginTop: '0.25rem', fontSize: '1.15rem' }}>
            {loading ? 'Creating...' : '💾 Pin Task to Board'}
          </button>
        </form>
      ) : (
        /* Project Creation Form */
        <form onSubmit={handleCreateProject} class="sketch-card" data-decoration="tape" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style="font-size: 1.75rem; margin-bottom: 0.25rem; text-align: center;">New Project Folder</h2>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.2rem' }}>Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Side Hustle"
              value={projTitle}
              onInput={(e: any) => setProjTitle(e.target.value)}
              class="sketch-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.2rem' }}>Post-it Color</label>
            <input
              type="color"
              value={projColor}
              onInput={(e: any) => setProjColor(e.target.value)}
              class="sketch-input"
              style={{ height: '38px', padding: '0.1rem 0.2rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.2rem' }}>Project Description (Markdown)</label>
            <textarea
              rows={4}
              placeholder="Goals, target milestones, tech stack..."
              value={projContent}
              onInput={(e: any) => setProjContent(e.target.value)}
              class="sketch-input"
              style={{ fontFamily: 'var(--font-body)', resize: 'vertical' }}
            />
          </div>

          <button type="submit" disabled={loading} class="sketch-button" style={{ width: '100%', marginTop: '0.25rem', fontSize: '1.15rem' }}>
            {loading ? 'Creating...' : '📁 Launch Project'}
          </button>
        </form>
      )}
    </div>
  );
}
