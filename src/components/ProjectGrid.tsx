import { useRef, useState } from 'preact/hooks';

interface DashboardProject {
  slug: string;
  title: string;
  status: string;
  color: string;
  tags?: string[];
  order: number;
  doneTasks: number;
  totalTasks: number;
  progressPct: number;
}

interface ProjectGridProps {
  initialProjects: DashboardProject[];
}

export default function ProjectGrid({ initialProjects }: ProjectGridProps) {
  const [projects, setProjects] = useState(
    [...initialProjects].sort((a, b) => a.order - b.order),
  );
  const [draggedSlug, setDraggedSlug] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{ slug: string; position: 'before' | 'after' } | null>(null);
  const [saveError, setSaveError] = useState('');
  const lastDragEndAt = useRef(0);

  const handleDragStart = (project: DashboardProject, event: DragEvent) => {
    setDraggedSlug(project.slug);
    setSaveError('');
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', project.slug);
    }
  };

  const handleDragOver = (project: DashboardProject, event: DragEvent) => {
    event.preventDefault();
    if (!draggedSlug || draggedSlug === project.slug) {
      setDropTarget(null);
      return;
    }

    const card = event.currentTarget as HTMLElement;
    const grid = card.parentElement;
    const rect = card.getBoundingClientRect();
    const columnCount = grid
      ? getComputedStyle(grid).gridTemplateColumns.split(' ').length
      : 1;
    const position = columnCount === 1
      ? (event.clientY < rect.top + rect.height / 2 ? 'before' : 'after')
      : (event.clientX < rect.left + rect.width / 2 ? 'before' : 'after');

    setDropTarget({ slug: project.slug, position });
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  };

  const finishDragging = () => {
    setDraggedSlug(null);
    setDropTarget(null);
    lastDragEndAt.current = Date.now();
  };

  const handleDrop = async (target: DashboardProject, event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!draggedSlug || draggedSlug === target.slug) {
      finishDragging();
      return;
    }

    const previousProjects = projects;
    const draggedProject = projects.find(project => project.slug === draggedSlug);
    if (!draggedProject) {
      finishDragging();
      return;
    }

    const reordered = projects.filter(project => project.slug !== draggedSlug);
    let targetIndex = reordered.findIndex(project => project.slug === target.slug);
    if (dropTarget?.position === 'after') targetIndex += 1;
    reordered.splice(targetIndex, 0, draggedProject);

    const orderedProjects = reordered.map((project, index) => ({
      ...project,
      order: (index + 1) * 100,
    }));

    setProjects(orderedProjects);
    finishDragging();

    try {
      const responses = await Promise.all(orderedProjects.map(project => fetch(`/api/projects/${project.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: project.order }),
      })));

      if (responses.some(response => !response.ok)) throw new Error('Failed to save project order');
    } catch (error) {
      setProjects(previousProjects);
      setSaveError('Could not save the new project order. Please try again.');
    }
  };

  const openProject = (slug: string) => {
    if (Date.now() - lastDragEndAt.current < 250) return;
    window.location.href = `/projects/${slug}`;
  };

  return (
    <>
      {saveError && (
        <p role="alert" style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}>{saveError}</p>
      )}
      <div class="project-grid">
        {projects.map((project, index) => {
          const isDragging = draggedSlug === project.slug;
          const dropPosition = dropTarget?.slug === project.slug ? dropTarget.position : null;
          const rotation = index % 2 === 0 ? '-1deg' : '1.5deg';

          return (
            <article
              key={project.slug}
              draggable
              class="sketch-card project-grid__card"
              data-decoration="tape"
              style={{
                backgroundColor: project.color,
                transform: isDragging ? 'scale(0.95)' : `rotate(${rotation})`,
                opacity: isDragging ? 0.45 : 1,
                boxShadow: dropPosition === 'before'
                  ? '-6px 0 0 var(--blue), var(--shadow)'
                  : dropPosition === 'after'
                    ? '6px 0 0 var(--blue), var(--shadow)'
                    : undefined,
              }}
              onDragStart={(event) => handleDragStart(project, event)}
              onDragOver={(event) => handleDragOver(project, event)}
              onDrop={(event) => handleDrop(project, event)}
              onDragEnd={finishDragging}
              onClick={() => openProject(project.slug)}
            >
              <div class="project-grid__header">
                <a
                  href={`/projects/${project.slug}`}
                  draggable={false}
                  onClick={(event) => {
                    if (Date.now() - lastDragEndAt.current < 250) event.preventDefault();
                  }}
                >
                  {project.title}
                </a>
                <span class="project-grid__status">{project.status}</span>
              </div>

              <div class="project-grid__progress">
                <div class="project-grid__progress-label">
                  <span>Progress</span>
                  <span>{project.doneTasks}/{project.totalTasks} ({project.progressPct}%)</span>
                </div>
                <div class="wobbly-border-sm project-grid__progress-track">
                  <div style={{ height: '100%', width: `${project.progressPct}%`, backgroundColor: 'var(--accent)' }} />
                </div>
              </div>

              <div class="project-grid__tags">
                {project.tags?.map(tag => <span key={tag}>#{tag}</span>)}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
