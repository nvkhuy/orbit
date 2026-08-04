import { useState } from 'preact/hooks';
import type { ProjectItem } from './KanbanBoard';

interface Props {
  projects: ProjectItem[];
}

export default function QuickCreate({ projects }: Props) {
  const [type, setType] = useState<'task' | 'project'>('task');
  const [title, setTitle] = useState('');
  const [project, setProject] = useState(projects[0]?.slug || 'orbit');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [assignee, setAssignee] = useState('huy');
  const [tags, setTags] = useState('');
  const [due, setDue] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#fff9c4');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleSubmit = async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    if (!title.trim()) {
      setMessage({ text: 'Title is required!', isError: true });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      if (type === 'task') {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            project,
            status,
            priority,
            assignee,
            tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
            due,
            content,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setMessage({ text: `Task created! Created file src/content/tasks/${data.slug}.md` });
          setTimeout(() => {
            window.location.href = `/tasks/${data.slug}`;
          }, 800);
        } else {
          setMessage({ text: data.error || 'Failed to create task', isError: true });
        }
      } else {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            status,
            priority,
            color,
            tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
            content,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setMessage({ text: `Project created! Created file src/content/projects/${data.slug}.md` });
          setTimeout(() => {
            window.location.href = `/projects/${data.slug}`;
          }, 800);
        } else {
          setMessage({ text: data.error || 'Failed to create project', isError: true });
        }
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Error occurred', isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wobbly-box-md postit-card create-form-container">
      <div className="tape-decoration"></div>

      <h2 className="form-header">✏️ Quick Create</h2>
      <p className="form-subtitle">Creating an item directly writes a <code>.md</code> file in <code>src/content/</code>.</p>

      <div className="type-toggle-buttons">
        <button
          type="button"
          className={`btn-sketch ${type === 'task' ? 'btn-sketch-yellow' : 'btn-sketch-secondary'}`}
          onClick={() => setType('task')}
        >
          📌 Task
        </button>
        <button
          type="button"
          className={`btn-sketch ${type === 'project' ? 'btn-sketch-yellow' : 'btn-sketch-secondary'}`}
          onClick={() => setType('project')}
        >
          📁 Project
        </button>
      </div>

      <form onSubmit={handleSubmit} className="create-form">
        {message && (
          <div className={`form-alert ${message.isError ? 'alert-error' : 'alert-success'}`}>
            {message.text}
          </div>
        )}

        <div className="form-field">
          <label className="field-label">Title *</label>
          <input
            type="text"
            className="input-sketch"
            placeholder={type === 'task' ? 'e.g. Implement drag-and-drop' : 'e.g. New Awesome Project'}
            value={title}
            onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
            required
          />
        </div>

        {type === 'task' ? (
          <>
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Project</label>
                <select
                  className="input-sketch input-select"
                  value={project}
                  onChange={(e) => setProject((e.target as HTMLSelectElement).value)}
                >
                  {projects.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="field-label">Status</label>
                <select
                  className="input-sketch input-select"
                  value={status}
                  onChange={(e) => setStatus((e.target as HTMLSelectElement).value)}
                >
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="in-review">In Review</option>
                  <option value="done">Done</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Priority</label>
                <select
                  className="input-sketch input-select"
                  value={priority}
                  onChange={(e) => setPriority((e.target as HTMLSelectElement).value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="form-field">
                <label className="field-label">Assignee</label>
                <input
                  type="text"
                  className="input-sketch"
                  placeholder="e.g. huy or claude"
                  value={assignee}
                  onInput={(e) => setAssignee((e.target as HTMLInputElement).value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Tags (comma separated)</label>
                <input
                  type="text"
                  className="input-sketch"
                  placeholder="dev, ui, frontend"
                  value={tags}
                  onInput={(e) => setTags((e.target as HTMLInputElement).value)}
                />
              </div>

              <div className="form-field">
                <label className="field-label">Due Date</label>
                <input
                  type="date"
                  className="input-sketch"
                  value={due}
                  onChange={(e) => setDue((e.target as HTMLInputElement).value)}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="form-row">
            <div className="form-field">
              <label className="field-label">Project Card Color</label>
              <input
                type="color"
                className="input-sketch color-picker"
                value={color}
                onChange={(e) => setColor((e.target as HTMLInputElement).value)}
              />
            </div>

            <div className="form-field">
              <label className="field-label">Tags (comma separated)</label>
              <input
                type="text"
                className="input-sketch"
                placeholder="dev, app, open-source"
                value={tags}
                onInput={(e) => setTags((e.target as HTMLInputElement).value)}
              />
            </div>
          </div>
        )}

        <div className="form-field">
          <label className="field-label">Markdown Content / Notes</label>
          <textarea
            className="input-sketch textarea-sketch"
            rows={4}
            placeholder="Write description, checklist, or agent notes in Markdown..."
            value={content}
            onInput={(e) => setContent((e.target as HTMLTextAreaElement).value)}
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-sketch" disabled={loading}>
            {loading ? 'Writing .md file...' : `🚀 Save ${type === 'task' ? 'Task' : 'Project'}`}
          </button>
        </div>
      </form>
    </div>
  );
}
