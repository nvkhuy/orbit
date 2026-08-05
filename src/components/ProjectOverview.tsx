import { useEffect, useRef, useState } from 'preact/hooks';
import ProjectEditor from './ProjectEditor';

interface ProgressTask {
  project: string;
  status: string;
}

interface ProjectOverviewProps {
  initialProject: {
    slug: string;
    title: string;
    status: string;
    columns: string[];
    color: string;
    body: string;
  };
  doneCount: number;
  totalTasks: number;
  progressPct: number;
}

export default function ProjectOverview({
  initialProject,
  doneCount,
  totalTasks,
  progressPct,
}: ProjectOverviewProps) {
  const [project, setProject] = useState(initialProject);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [progress, setProgress] = useState({
    doneCount,
    totalTasks,
    percentage: progressPct,
  });
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const updateProgress = (event: Event) => {
      const { tasks } = (event as CustomEvent<{ tasks: ProgressTask[] }>).detail;
      const projectTasks = tasks.filter(task => task.project === project.slug);
      const completedTasks = projectTasks.filter(task => task.status === 'done').length;
      const percentage = projectTasks.length > 0
        ? Math.round((completedTasks / projectTasks.length) * 100)
        : 0;

      setProgress({
        doneCount: completedTasks,
        totalTasks: projectTasks.length,
        percentage,
      });
    };

    window.addEventListener('orbit:tasks-updated', updateProgress);
    return () => window.removeEventListener('orbit:tasks-updated', updateProgress);
  }, [project.slug]);

  const openDetails = () => dialogRef.current?.showModal();
  const closeDetails = () => dialogRef.current?.close();

  const promptDelete = () => {
    closeDetails();
    setDeleteError('');
    setIsConfirmingDelete(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError('');

    try {
      const response = await fetch(`/api/projects/${project.slug}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete project');
      window.location.href = '/';
    } catch (error) {
      setDeleteError('Could not delete the project. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <>
      <section
        class="project-overview sketch-card"
        style={{ backgroundColor: project.color || '#fff9c4' }}
        aria-labelledby="project-title"
        aria-label={`Open details for ${project.title}`}
        tabIndex={0}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest('a, button')) return;
          openDetails();
        }}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' ')) return;
          event.preventDefault();
          openDetails();
        }}
      >
        <div class="project-overview__topline">
          <a href="/" class="project-overview__back">← Dashboard</a>
          <button class="sketch-button" onClick={openDetails}>
            ⚙️ Project Details
          </button>
        </div>

        <div class="project-overview__main">
          <div class="project-overview__identity">
            <h1 id="project-title">{project.title}</h1>
            <div class="project-overview__meta">
              <span class="project-overview__badge">{project.status}</span>
              <span>{progress.totalTasks} {progress.totalTasks === 1 ? 'task' : 'tasks'}</span>
            </div>
          </div>

          <div class="project-overview__percentage" aria-label={`${progress.percentage}% complete`}>
            <strong>{progress.percentage}%</strong>
            <span>complete</span>
          </div>
        </div>

        <div class="project-overview__progress-label">
          <span>Project progress</span>
          <span>{progress.doneCount} of {progress.totalTasks} done</span>
        </div>
        <div class="wobbly-border-sm project-overview__progress-track">
          <div class="project-overview__progress-fill" style={{ width: `${progress.percentage}%` }} />
        </div>
      </section>

      <dialog
        ref={dialogRef}
        class="project-details-dialog"
        aria-labelledby="project-details-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDetails();
        }}
      >
        <div class="project-details-dialog__header">
          <div>
            <span class="project-details-dialog__eyebrow">Project settings</span>
            <h2 id="project-details-title">Details & notes</h2>
          </div>
          <button class="sketch-button secondary" onClick={closeDetails} aria-label="Close project details">
            ✕ Close
          </button>
        </div>
        <ProjectEditor
          initialProject={project}
          onProjectChange={setProject}
          onRequestDelete={promptDelete}
        />
      </dialog>

      {isConfirmingDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-project-title"
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
            justifyContent: 'center',
            padding: '1.5rem',
            boxSizing: 'border-box',
          }}
          onClick={() => !isDeleting && setIsConfirmingDelete(false)}
        >
          <div
            class="sketch-card"
            data-decoration="tape"
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
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="delete-project-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: '0.75rem', color: 'var(--fg)' }}>
              🗑️ Delete Project?
            </h3>
            <p style={{ fontSize: '1.05rem', marginBottom: deleteError ? '0.75rem' : '1.5rem', color: '#444' }}>
              Are you sure you want to delete <strong>"{project.title}"</strong>?
              <br />
              <span style={{ fontSize: '0.9rem', color: '#888' }}>This will permanently remove its Markdown file.</span>
            </p>

            {deleteError && (
              <p role="alert" style={{ color: 'var(--accent)', marginBottom: '1rem' }}>{deleteError}</p>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                class="sketch-button secondary"
                disabled={isDeleting}
                onClick={() => setIsConfirmingDelete(false)}
              >
                Cancel
              </button>
              <button
                class="sketch-button"
                disabled={isDeleting}
                style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}
                onClick={confirmDelete}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
