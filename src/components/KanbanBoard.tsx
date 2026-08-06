import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import SketchSelect from './SketchSelect';
import SketchDatePicker from './SketchDatePicker';
import { SketchTrashIcon } from './SketchIcons';

export interface Task {
  slug: string;
  title: string;
  project: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  tags?: string[];
  due?: string;
  order: number;
  parent?: string;
  content?: string;
}

export interface Project {
  slug: string;
  title: string;
  columns?: string[];
  color?: string;
}

interface KanbanBoardProps {
  initialTasks: Task[];
  projects: Project[];
  initialProjectFilter?: string;
}

const DEFAULT_COLUMNS = ['todo', 'in-progress', 'in-review', 'done'];
const DRAGGED_TASK_SCALE = 0.9;

export default function KanbanBoard({ initialTasks, projects, initialProjectFilter = '' }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [projectFilter, setProjectFilter] = useState<string>(initialProjectFilter);
  const [assigneeFilter, setAssigneeFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hideDone, setHideDone] = useState<boolean>(false);
  const [groupBy, setGroupBy] = useState<'status' | 'project' | 'priority' | 'assignee'>('status');

  const [draggedTaskSlug, setDraggedTaskSlug] = useState<string | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<{ slug: string; position: 'above' | 'below' } | null>(null);
  const dragOverTargetRef = useRef<{ slug: string; position: 'above' | 'below' } | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const lastDragEndAt = useRef(0);
  
  const [quickTitle, setQuickTitle] = useState<{ [col: string]: string }>({});
  const [isAddingToCol, setIsAddingToCol] = useState<string | null>(null);

  // Modal State
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isSavingModal, setIsSavingModal] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // The dev server intentionally ignores Markdown task writes to avoid a
  // full refresh during drag/drop. Read the persisted files once on mount so
  // a browser refresh still reflects the latest disk state.
  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.ok ? res.json() : Promise.reject(new Error('Failed to load tasks')))
      .then((freshTasks: Task[]) => setTasks(freshTasks))
      .catch(err => console.error('Failed to load persisted tasks:', err));
  }, []);

  // Keep other dashboard islands, such as the project progress overview,
  // synchronized with every optimistic board change.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('orbit:tasks-updated', {
      detail: { tasks },
    }));
  }, [tasks]);

  useEffect(() => {
    if (!activeTask && !taskToDelete) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();

      if (taskToDelete) {
        setTaskToDelete(null);
      } else {
        setActiveTask(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [Boolean(activeTask), Boolean(taskToDelete)]);

  // Filter tasks
  const filteredTasks = useMemo(() => tasks.filter(task => {
    if (projectFilter && task.project !== projectFilter) return false;
    if (assigneeFilter && task.assignee !== assigneeFilter) return false;
    if (priorityFilter && task.priority !== priorityFilter) return false;
    if (hideDone && task.status === 'done') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchTag = task.tags?.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchTag) return false;
    }
    return true;
  }), [tasks, projectFilter, assigneeFilter, priorityFilter, hideDone, searchQuery]);

  // Options arrays for SketchSelect
  const projectOptions = [
    { value: '', label: 'All Projects' },
    ...projects.map(p => ({ value: p.slug, label: p.title }))
  ];

  const priorityFilterOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const groupByOptions = [
    { value: 'status', label: 'Status' },
    { value: 'project', label: 'Project' },
    { value: 'priority', label: 'Priority' },
    { value: 'assignee', label: 'Assignee' },
  ];

  const statusOptions = [
    { value: 'todo', label: 'todo' },
    { value: 'in-progress', label: 'in-progress' },
    { value: 'in-review', label: 'in-review' },
    { value: 'done', label: 'done' },
  ];

  const priorityOptions = [
    { value: 'critical', label: 'critical' },
    { value: 'high', label: 'high' },
    { value: 'medium', label: 'medium' },
    { value: 'low', label: 'low' },
  ];

  const modalProjectOptions = projects.map(p => ({ value: p.slug, label: p.title }));

  // Handle Drag & Drop
  const handleDragStart = (slug: string, e: DragEvent) => {
    dragOverTargetRef.current = null;
    setDraggedTaskSlug(slug);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', slug);
    }
  };

  const handleDragOverColumn = (columnId: string, e: DragEvent) => {
    e.preventDefault();
    setDragOverColumnId(current => current === columnId ? current : columnId);
    if (dragOverTargetRef.current) {
      dragOverTargetRef.current = null;
      if (!useLargeBoardMode) setDragOverTarget(null);
    }
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeaveColumn = (columnId: string, e: DragEvent) => {
    const column = e.currentTarget as HTMLElement;
    const nextTarget = e.relatedTarget as Node | null;
    if (nextTarget && column.contains(nextTarget)) return;
    setDragOverColumnId(current => current === columnId ? null : current);
  };

  const handleDragOverCard = (targetSlug: string, columnId: string, e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverColumnId(current => current === columnId ? current : columnId);
    if (targetSlug === draggedTaskSlug) {
      dragOverTargetRef.current = null;
      if (!useLargeBoardMode) setDragOverTarget(null);
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position: 'above' | 'below' = e.clientY < midY ? 'above' : 'below';

    const nextTarget = { slug: targetSlug, position };
    dragOverTargetRef.current = nextTarget;
    if (!useLargeBoardMode) {
      setDragOverTarget(current => (
        current?.slug === targetSlug && current.position === position
          ? current
          : nextTarget
      ));
    }
  };

  const handleDragLeaveCard = (targetSlug: string, e: DragEvent) => {
    const card = e.currentTarget as HTMLElement;
    const nextTarget = e.relatedTarget as Node | null;
    if (nextTarget && card.contains(nextTarget)) return;
    if (!useLargeBoardMode) {
      setDragOverTarget(current => current?.slug === targetSlug ? null : current);
    }
  };

  const handleDropOnColumn = async (targetGroupValue: string, e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedTaskSlug) return;
    // If dropping directly onto column container without hovering a card
    const task = tasks.find(t => t.slug === draggedTaskSlug);
    if (!task) return;

    let updates: Partial<Task> = {};
    if (groupBy === 'status') {
      if (task.status === targetGroupValue) return;
      updates = { status: targetGroupValue };
    } else if (groupBy === 'project') {
      if (task.project === targetGroupValue) return;
      updates = { project: targetGroupValue };
    } else if (groupBy === 'priority') {
      if (task.priority === targetGroupValue as any) return;
      updates = { priority: targetGroupValue as any };
    } else if (groupBy === 'assignee') {
      if (task.assignee === targetGroupValue) return;
      updates = { assignee: targetGroupValue };
    }

    setTasks(prev => prev.map(t => t.slug === draggedTaskSlug ? { ...t, ...updates } : t));
    setDraggedTaskSlug(null);
    setDragOverTarget(null);
    dragOverTargetRef.current = null;
    setDragOverColumnId(null);

    try {
      await fetch(`/api/tasks/${draggedTaskSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDropOnCard = async (targetTask: Task, e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedTaskSlug || draggedTaskSlug === targetTask.slug) {
      setDraggedTaskSlug(null);
      setDragOverTarget(null);
      dragOverTargetRef.current = null;
      setDragOverColumnId(null);
      return;
    }

    const position = (dragOverTargetRef.current?.slug === targetTask.slug)
      ? dragOverTargetRef.current.position
      : (dragOverTarget?.slug === targetTask.slug ? dragOverTarget.position : 'above');

    const draggedTask = tasks.find(t => t.slug === draggedTaskSlug);
    if (!draggedTask) return;

    // Determine target group updates
    let groupUpdates: Partial<Task> = {};
    if (groupBy === 'status') groupUpdates = { status: targetTask.status };
    else if (groupBy === 'project') groupUpdates = { project: targetTask.project };
    else if (groupBy === 'priority') groupUpdates = { priority: targetTask.priority };
    else if (groupBy === 'assignee') groupUpdates = { assignee: targetTask.assignee };

    // Get current tasks in target column sorted by order
    const colTasks = tasks
      .filter(t => {
        if (groupBy === 'status') return t.status === targetTask.status;
        if (groupBy === 'project') return t.project === targetTask.project;
        if (groupBy === 'priority') return t.priority === targetTask.priority;
        if (groupBy === 'assignee') return t.assignee === targetTask.assignee;
        return true;
      })
      .filter(t => t.slug !== draggedTaskSlug)
      .sort((a, b) => a.order - b.order);

    const targetIdx = colTasks.findIndex(t => t.slug === targetTask.slug);
    if (targetIdx !== -1) {
      const insertIdx = position === 'above' ? targetIdx : targetIdx + 1;
      colTasks.splice(insertIdx, 0, { ...draggedTask, ...groupUpdates });
    } else {
      colTasks.push({ ...draggedTask, ...groupUpdates });
    }

    // Assign clean spaced order values (100, 200, 300...)
    const orderMap = new Map<string, number>();
    colTasks.forEach((t, idx) => {
      orderMap.set(t.slug, (idx + 1) * 100);
    });

    setTasks(prev => {
      const updated = prev.map(t => {
        const newOrd = orderMap.get(t.slug);
        if (newOrd !== undefined) {
          return { ...t, ...(t.slug === draggedTaskSlug ? groupUpdates : {}), order: newOrd };
        }
        return t;
      });
      return updated.sort((a, b) => a.order - b.order);
    });

    setDraggedTaskSlug(null);
    setDragOverTarget(null);
    dragOverTargetRef.current = null;
    setDragOverColumnId(null);

    try {
      // Save all updated task orders in the column
      await Promise.all(
        colTasks.map(t => {
          const ord = orderMap.get(t.slug);
          const bodyUpdates = t.slug === draggedTaskSlug
            ? { ...groupUpdates, order: ord }
            : { order: ord };

          return fetch(`/api/tasks/${t.slug}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyUpdates),
          });
        })
      );
    } catch (err) {
      console.error('Failed to reorder tasks:', err);
    }
  };


  const handleQuickAdd = async (columnValue: string) => {
    const title = quickTitle[columnValue]?.trim();
    if (!title) return;

    const project = projectFilter || (projects[0]?.slug ?? 'orbit');
    const newTaskData = {
      title,
      project,
      status: groupBy === 'status' ? columnValue : 'todo',
      priority: groupBy === 'priority' ? columnValue : 'medium',
      assignee: groupBy === 'assignee' ? columnValue : '',
      order: (tasks.length + 1) * 10,
    };

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskData),
      });
      const result = await res.json();
      if (result.success) {
        const createdTask: Task = {
          slug: result.slug,
          ...newTaskData,
          priority: newTaskData.priority as any,
        };
        setTasks(prev => [...prev, createdTask]);
        setQuickTitle(prev => ({ ...prev, [columnValue]: '' }));
        setIsAddingToCol(null);
      }
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const cycleStatus = async (task: Task, e: MouseEvent) => {
    e.stopPropagation();
    const statuses = ['todo', 'in-progress', 'in-review', 'done'];
    const nextIdx = (statuses.indexOf(task.status) + 1) % statuses.length;
    const nextStatus = statuses[nextIdx];

    setTasks(prev => prev.map(t => t.slug === task.slug ? { ...t, status: nextStatus } : t));

    try {
      await fetch(`/api/tasks/${task.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (err) {
      console.error('Failed to cycle status:', err);
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

  let columns: { id: string; label: string; color?: string }[] = [];
  if (groupBy === 'status') {
    const activeProject = projects.find(p => p.slug === projectFilter);
    const colList = activeProject?.columns || DEFAULT_COLUMNS;
    columns = colList.map(c => ({ id: c, label: c.toUpperCase().replace('-', ' ') }));
  } else if (groupBy === 'project') {
    columns = projects.map(p => ({ id: p.slug, label: p.title, color: p.color }));
  } else if (groupBy === 'priority') {
    columns = [
      { id: 'critical', label: '🔥 CRITICAL', color: '#ffcdd2' },
      { id: 'high', label: '⚡ HIGH', color: '#ffe0b2' },
      { id: 'medium', label: '📌 MEDIUM', color: '#fff9c4' },
      { id: 'low', label: '🌱 LOW', color: '#c8e6c9' },
    ];
  } else if (groupBy === 'assignee') {
    const assignees = Array.from(new Set(tasks.map(t => t.assignee || 'Unassigned')));
    columns = assignees.map(a => ({ id: a, label: a || 'Unassigned' }));
  }

  const useScrollableColumns = columns.length > 6;
  const useLargeBoardMode = filteredTasks.length > 200;
  const groupedTasks = useMemo(() => {
    const grouped = new Map<string, Task[]>();

    for (const task of filteredTasks) {
      let groupKey = task.status;
      if (groupBy === 'project') groupKey = task.project;
      else if (groupBy === 'priority') groupKey = task.priority;
      else if (groupBy === 'assignee') groupKey = task.assignee || 'Unassigned';

      const group = grouped.get(groupKey);
      if (group) group.push(task);
      else grouped.set(groupKey, [task]);
    }

    for (const group of grouped.values()) {
      group.sort((a, b) => a.order - b.order);
    }

    return grouped;
  }, [filteredTasks, groupBy]);

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
      {/* Control Bar */}
      <div 
        class="wobbly-border-sm"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          justify: 'space-between',
          backgroundColor: '#ffffff',
          padding: '0.6rem 1rem',
          boxShadow: 'var(--shadow)',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
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
            value={priorityFilter}
            options={priorityFilterOptions}
            onChange={(val) => setPriorityFilter(val)}
            style={{ width: '130px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>
            <input
              type="checkbox"
              checked={hideDone}
              onChange={(e: any) => setHideDone(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }}
            />
            Hide Done
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>Group by:</span>
            <SketchSelect
              value={groupBy}
              options={groupByOptions}
              onChange={(val) => setGroupBy(val as any)}
              style={{ width: '120px' }}
            />
          </div>
        </div>
      </div>

      {/* Board Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: useScrollableColumns
            ? `repeat(${columns.length}, minmax(280px, 320px))`
            : `repeat(${columns.length}, minmax(0, 1fr))`,
          gap: '1rem',
          width: '100%',
          maxWidth: '100%',
          overflowX: useScrollableColumns ? 'auto' : 'visible',
          overflowY: 'visible',
          padding: useScrollableColumns ? '0.35rem 0.35rem 1rem' : '0 0 0.5rem',
          alignItems: 'stretch',
          scrollSnapType: useScrollableColumns ? 'x proximity' : undefined,
          scrollbarWidth: 'thin',
        }}
      >
        {columns.map((col) => {
          const isDragOverColumn = dragOverColumnId === col.id && draggedTaskSlug !== null;
          const groupTasks = groupedTasks.get(col.id) || [];

          return (
            <div
              key={col.id}
              class="kanban-column"
              style={{
                // The wobbly border already gives the column a hand-drawn
                // shape. Keeping the frame aligned to its grid cell prevents
                // badges and cards from overlapping adjacent columns when the
                // board contains many tasks.
                transform: isDragOverColumn && !useLargeBoardMode ? 'scale(1.05)' : 'scale(1)',
                transformOrigin: 'center',
                backgroundColor: isDragOverColumn ? 'rgba(45, 93, 161, 0.08)' : (col.color || 'transparent'),
                minHeight: '350px',
                minWidth: 0,
                isolation: 'isolate',
                zIndex: isDragOverColumn ? 20 : 1,
                padding: '0.6rem',
                scrollSnapAlign: useScrollableColumns ? 'start' : undefined,
                boxShadow: isDragOverColumn ? '0 0 0 4px var(--blue), var(--shadow)' : 'none',
                transition: useLargeBoardMode
                  ? 'background-color 0.12s ease, box-shadow 0.12s ease'
                  : 'transform 0.18s ease, background-color 0.2s ease, box-shadow 0.18s ease',
              }}
              onDragOver={(e) => handleDragOverColumn(col.id, e)}
              onDragLeave={(e) => handleDragLeaveColumn(col.id, e)}
              onDrop={(e) => handleDropOnColumn(col.id, e)}
            >
              <div class="kanban-column-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.1rem' }}>
                <span>{col.label}</span>
                <span class="wobbly-border-sm" style={{ padding: '0.05rem 0.5rem', fontSize: '0.85rem', backgroundColor: '#ffffff' }}>
                  {groupTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1, minHeight: '100px', minWidth: 0 }}>
                {groupTasks.map((task, tIdx) => {
                  const cardRot = tIdx % 3 === 0 ? '-1deg' : tIdx % 3 === 1 ? '1.5deg' : '-0.5deg';
                  const isBeingDragged = draggedTaskSlug === task.slug;
                  const isDragTarget = dragOverTarget?.slug === task.slug;
                  const dropPos = isDragTarget ? dragOverTarget.position : null;

                  return (
                    <div
                      key={task.slug}
                      draggable
                      onDragStart={(e) => handleDragStart(task.slug, e)}
                      onDragOver={(e) => handleDragOverCard(task.slug, col.id, e)}
                      onDragLeave={(e) => handleDragLeaveCard(task.slug, e)}
                      onDrop={(e) => handleDropOnCard(task, e)}
                      onDragEnd={() => {
                        lastDragEndAt.current = Date.now();
                        setDraggedTaskSlug(null);
                        setDragOverTarget(null);
                        dragOverTargetRef.current = null;
                        setDragOverColumnId(null);
                      }}
                      class="sketch-card"
                      style={{
                        cursor: 'grab',
                        width: '100%',
                        minWidth: 0,
                        overflow: 'hidden',
                        transform: isBeingDragged ? `scale(${DRAGGED_TASK_SCALE})` : `rotate(${cardRot})`,
                        transformOrigin: 'center',
                        backgroundColor: task.status === 'done' ? '#f5f5f5' : '#ffffff',
                        opacity: isBeingDragged ? 0.4 : (task.status === 'done' ? 0.75 : 1),
                        padding: '0.75rem 0.9rem',
                        position: 'relative',
                        contentVisibility: 'auto',
                        containIntrinsicSize: '145px',
                        transition: 'transform 0.15s ease, opacity 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
                        boxShadow: isBeingDragged 
                          ? 'none' 
                          : dropPos === 'above'
                          ? '0 -4px 0 0 var(--blue), var(--shadow)'
                          : dropPos === 'below'
                          ? '0 4px 0 0 var(--blue), var(--shadow)'
                          : 'var(--shadow)',
                        borderTop: dropPos === 'above' ? '3px solid var(--blue)' : undefined,
                        borderBottom: dropPos === 'below' ? '3px solid var(--blue)' : undefined,
                      }}
                      onClick={() => {
                        // Browsers may emit a click after a native drag/drop gesture.
                        // Ignore that trailing click so it cannot open the editor or
                        // steal the first interaction after moving a card.
                        if (Date.now() - lastDragEndAt.current < 500) return;
                        setActiveTask(task);
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--fg)', textDecoration: task.status === 'done' ? 'line-through' : 'none', minWidth: 0, overflowWrap: 'anywhere' }}>
                          {task.title}
                        </span>

                        {/* Hand-Drawn Sketch Trash Button */}
                        <button
                          onClick={(e) => promptDeleteTask(task, e)}
                          title="Delete Task"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.1rem 0.3rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justify: 'center',
                            color: 'var(--fg)',
                            opacity: 0.6,
                            transition: 'opacity 0.15s ease, color 0.15s ease',
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
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center', marginTop: '0.6rem' }}>
                        {/* Status Quick Cycle Badge */}
                        <span
                          onClick={(e) => cycleStatus(task, e)}
                          title="Click to change status"
                          style={{
                            display: 'inline-block',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '12px',
                            border: '2px solid var(--border)',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            backgroundColor: task.status === 'done' ? '#c8e6c9' : task.status === 'in-progress' ? '#bbdefb' : '#fff9c4',
                          }}
                        >
                          {task.status}
                        </span>

                        {/* Priority Badge */}
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '12px',
                            border: '1.5px solid var(--border)',
                            fontSize: '0.8rem',
                            backgroundColor: getPriorityColor(task.priority),
                          }}
                        >
                          {task.priority}
                        </span>

                        {/* Assignee */}
                        {task.assignee && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--blue)', fontFamily: 'var(--font-body)', fontWeight: 'bold' }}>
                            @{task.assignee}
                          </span>
                        )}
                      </div>

                      {/* Project Tag */}
                      {groupBy !== 'project' && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
                          📁 {task.project}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quick Add Form at Column Bottom */}
              {isAddingToCol === col.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Task title..."
                    value={quickTitle[col.id] || ''}
                    onInput={(e: any) => setQuickTitle(prev => ({ ...prev, [col.id]: e.target.value }))}
                    onKeyDown={(e: any) => e.key === 'Enter' && handleQuickAdd(col.id)}
                    class="sketch-input"
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button class="sketch-button" style={{ padding: '0.2rem 0.8rem', fontSize: '0.9rem' }} onClick={() => handleQuickAdd(col.id)}>
                      Add
                    </button>
                    <button class="sketch-button secondary" style={{ padding: '0.2rem 0.8rem', fontSize: '0.9rem' }} onClick={() => setIsAddingToCol(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  class="sketch-button secondary"
                  style={{ width: '100%', marginTop: '0.5rem', padding: '0.3rem', fontSize: '0.95rem' }}
                  onClick={() => setIsAddingToCol(col.id)}
                >
                  + Add task
                </button>
              )}
            </div>
          );
        })}
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
                  <SketchTrashIcon size={16} color="#ff8a80" />
                  <span>Delete</span>
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
                    options={statusOptions}
                    onChange={(val) => setActiveTask({ ...activeTask, status: val })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>Priority</label>
                  <SketchSelect
                    value={activeTask.priority}
                    options={priorityOptions}
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
