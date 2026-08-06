import { useState } from 'preact/hooks';
import type { Task, Project } from './KanbanBoard';
import SketchSelect from './SketchSelect';
import SketchDatePicker from './SketchDatePicker';
import { SketchTrashIcon } from './SketchIcons';

interface TaskEditorProps {
  initialTask: Task & { id: string; body: string };
  projects: Project[];
}

export default function TaskEditor({ initialTask, projects }: TaskEditorProps) {
  const [task, setTask] = useState(initialTask);
  const [body, setBody] = useState(initialTask.body || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const updateTask = async (updates: Partial<Task> & { content?: string }) => {
    setIsSaving(true);
    setMessage('');

    const newObj = { ...task, ...updates };
    setTask(newObj);

    try {
      const res = await fetch(`/api/tasks/${task.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Saved successfully!');
        setTimeout(() => setMessage(''), 2000);
      } else {
        setMessage('Failed to save.');
      }
    } catch (err) {
      setMessage('Error updating task.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task markdown file?')) return;
    try {
      await fetch(`/api/tasks/${task.slug}`, { method: 'DELETE' });
      window.location.href = '/board';
    } catch (err) {
      alert('Failed to delete task.');
    }
  };

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header Card */}
      <div class="sketch-card postit" data-decoration="tape">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <a href="/board" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--fg)' }}>
            ← Back to Board
          </a>
          <button onClick={handleDelete} class="sketch-button secondary" style={{ padding: '0.2rem 0.8rem', fontSize: '1rem', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <SketchTrashIcon size={18} color="#ff8a80" />
            <span>Delete Task</span>
          </button>
        </div>

        <input
          type="text"
          value={task.title}
          onBlur={(e: any) => updateTask({ title: e.target.value })}
          class="sketch-input"
          style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', border: 'none', borderBottom: '3px solid var(--border)', background: 'transparent', padding: '0.2rem 0' }}
        />

        {/* Metadata Controls Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold' }}>Status</label>
            <SketchSelect
              value={task.status}
              onChange={(value) => updateTask({ status: value })}
              options={[
                { value: 'todo', label: 'todo' },
                { value: 'in-progress', label: 'in-progress' },
                { value: 'in-review', label: 'in-review' },
                { value: 'done', label: 'done' },
              ]}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold' }}>Project</label>
            <SketchSelect
              value={task.project}
              onChange={(value) => updateTask({ project: value })}
              options={projects.map(p => ({ value: p.slug, label: p.title }))}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold' }}>Priority</label>
            <SketchSelect
              value={task.priority}
              onChange={(value) => updateTask({ priority: value as Task['priority'] })}
              options={[
                { value: 'critical', label: 'critical' },
                { value: 'high', label: 'high' },
                { value: 'medium', label: 'medium' },
                { value: 'low', label: 'low' },
              ]}
              bgColor={getPriorityColor(task.priority)}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold' }}>Assignee</label>
            <input
              type="text"
              value={task.assignee || ''}
              placeholder="e.g. huy"
              onBlur={(e: any) => updateTask({ assignee: e.target.value })}
              class="sketch-input"
              style={{ padding: '0.3rem 0.6rem', fontSize: '1rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold' }}>Due Date</label>
            <SketchDatePicker
              value={task.due || ''}
              onChange={(val) => updateTask({ due: val })}
            />
          </div>
        </div>
      </div>

      {/* Markdown Body Editor */}
      <div class="sketch-card" data-decoration="tack">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style="font-size: 1.75rem;">Markdown Document Body</h2>
          {message && <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--blue)' }}>{message}</span>}
          <button
            class="sketch-button"
            disabled={isSaving}
            onClick={() => updateTask({ content: body })}
            style={{ padding: '0.4rem 1.2rem', fontSize: '1.1rem' }}
          >
            {isSaving ? 'Saving...' : '💾 Save Content'}
          </button>
        </div>

        <textarea
          rows={15}
          value={body}
          onInput={(e: any) => setBody(e.target.value)}
          class="sketch-input"
          style={{ width: '100%', fontFamily: 'var(--font-body)', fontSize: '1.2rem', lineHeight: '1.6', resize: 'vertical' }}
        />
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
          💡 Any human or AI agent can edit this markdown directly on disk at <code>src/content/tasks/{task.slug}.md</code>.
        </p>
      </div>
    </div>
  );
}
