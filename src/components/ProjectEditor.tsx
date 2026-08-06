import { useState } from 'preact/hooks';
import type { Project } from './KanbanBoard';
import SketchSelect from './SketchSelect';
import { SketchTrashIcon } from './SketchIcons';

interface ProjectEditorProps {
  initialProject: Project & { status: string; body: string };
  onProjectChange?: (project: ProjectEditorProps['initialProject']) => void;
  onRequestDelete: () => void;
}

export default function ProjectEditor({ initialProject, onProjectChange, onRequestDelete }: ProjectEditorProps) {
  const [project, setProject] = useState(initialProject);
  const [body, setBody] = useState(initialProject.body || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const updateProject = async (updates: Partial<ProjectEditorProps['initialProject']> & { content?: string }) => {
    setIsSaving(true);
    setMessage('');

    const updatedProject = { ...project, ...updates };
    setProject(updatedProject);
    onProjectChange?.(updatedProject);

    try {
      const res = await fetch(`/api/projects/${project.slug}`, {
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
      setMessage('Error updating project.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div class="sketch-card postit" data-decoration="tape">
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1rem' }}>
          <button onClick={onRequestDelete} class="sketch-button secondary" style={{ padding: '0.2rem 0.8rem', fontSize: '1rem', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <SketchTrashIcon size={18} color="#ff8a80" />
            <span>Delete Project</span>
          </button>
        </div>

        <input
          type="text"
          value={project.title}
          onBlur={(e: any) => updateProject({ title: e.target.value })}
          class="sketch-input"
          style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', border: 'none', borderBottom: '3px solid var(--border)', background: 'transparent', padding: '0.2rem 0' }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold' }}>Status</label>
            <SketchSelect
              value={project.status}
              onChange={(value) => updateProject({ status: value })}
              options={[
                { value: 'active', label: 'active' },
                { value: 'paused', label: 'paused' },
                { value: 'archived', label: 'archived' },
                { value: 'completed', label: 'completed' },
              ]}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold' }}>Color</label>
            <input
              type="color"
              value={project.color || '#fff9c4'}
              onChange={(e: any) => updateProject({ color: e.target.value })}
              class="sketch-input"
              style={{ padding: '0.2rem', height: '42px' }}
            />
          </div>
        </div>
      </div>

      <div class="sketch-card" data-decoration="tape">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style="font-size: 1.75rem;">Project Markdown Notes</h2>
          {message && <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--blue)' }}>{message}</span>}
          <button
            class="sketch-button"
            disabled={isSaving}
            onClick={() => updateProject({ content: body })}
            style={{ padding: '0.4rem 1.2rem', fontSize: '1.1rem' }}
          >
            {isSaving ? 'Saving...' : '💾 Save Content'}
          </button>
        </div>

        <textarea
          rows={12}
          value={body}
          onInput={(e: any) => setBody(e.target.value)}
          class="sketch-input"
          style={{ width: '100%', fontFamily: 'var(--font-body)', fontSize: '1.2rem', lineHeight: '1.6', resize: 'vertical' }}
        />
      </div>
    </div>
  );
}
