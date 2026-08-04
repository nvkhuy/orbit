import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const contentRoot = path.join(root, 'src', 'content');
const contentDirs = ['projects', 'tasks', 'agents'];

const projects = [
  {
    slug: 'orbit-platform',
    title: 'Orbit Platform',
    status: 'active',
    priority: 'high',
    color: '#fff9c4',
    tags: ['product', 'core'],
    columns: ['todo', 'in-progress', 'in-review', 'done'],
    body: 'Core product work for Orbit.',
  },
  {
    slug: 'marketing-site',
    title: 'Marketing Site',
    status: 'active',
    priority: 'medium',
    color: '#e3f2fd',
    tags: ['website', 'content'],
    columns: ['todo', 'in-progress', 'in-review', 'done'],
    body: 'Website and launch content.',
  },
  {
    slug: 'archive-lab',
    title: 'Archive Lab',
    status: 'paused',
    priority: 'low',
    color: '#e8f5e9',
    tags: ['research'],
    columns: ['todo', 'in-progress', 'in-review', 'done'],
    body: 'Experiments and archived ideas.',
  },
  {
    slug: 'mobile-app',
    title: 'Mobile App',
    status: 'active',
    priority: 'high',
    color: '#fce4ec',
    tags: ['mobile', 'product'],
    columns: ['todo', 'in-progress', 'in-review', 'done'],
    body: 'Mobile application improvements.',
  },
  {
    slug: 'data-pipeline',
    title: 'Data Pipeline',
    status: 'active',
    priority: 'critical',
    color: '#ffecb3',
    tags: ['data', 'backend'],
    columns: ['todo', 'in-progress', 'in-review', 'done'],
    body: 'Reliable data ingestion and processing.',
  },
  {
    slug: 'customer-success',
    title: 'Customer Success',
    status: 'active',
    priority: 'medium',
    color: '#dcedc8',
    tags: ['support', 'operations'],
    columns: ['todo', 'in-progress', 'in-review', 'done'],
    body: 'Customer support and retention initiatives.',
  },
  {
    slug: 'security-review',
    title: 'Security Review',
    status: 'paused',
    priority: 'high',
    color: '#f8bbd0',
    tags: ['security', 'compliance'],
    columns: ['todo', 'in-progress', 'in-review', 'done'],
    body: 'Security audits and hardening work.',
  },
  {
    slug: 'design-system',
    title: 'Design System',
    status: 'active',
    priority: 'medium',
    color: '#e1bee7',
    tags: ['design', 'frontend'],
    columns: ['todo', 'in-progress', 'in-review', 'done'],
    body: 'Shared visual language and components.',
  },
];

const fixtureTasks = [
  ['Define project scope', 'todo', 'high'],
  ['Collect requirements', 'todo', 'medium'],
  ['Create implementation plan', 'todo', 'low'],
  ['Build first version', 'in-progress', 'high'],
  ['Connect supporting API', 'in-progress', 'medium'],
  ['Add error handling', 'in-progress', 'critical'],
  ['Run team review', 'in-review', 'medium'],
  ['Polish edge cases', 'in-review', 'low'],
  ['Ship initial release', 'done', 'high'],
  ['Document the workflow', 'done', 'medium'],
];

const tasks = projects.flatMap((project, projectIndex) => fixtureTasks.map(([baseTitle, status, priority], taskIndex) => [
  project.slug,
  `${baseTitle} — ${project.title}`,
  status,
  priority,
  ['huy', 'claude', 'mina', ''][((projectIndex + taskIndex) % 4)],
]));

function ensureContentDirs() {
  for (const dir of contentDirs) {
    fs.mkdirSync(path.join(contentRoot, dir), { recursive: true });
  }
}

function clearMarkdownContent() {
  ensureContentDirs();

  for (const dir of contentDirs) {
    const directory = path.join(contentRoot, dir);
    for (const file of fs.readdirSync(directory)) {
      if (file.endsWith('.md')) {
        fs.unlinkSync(path.join(directory, file));
      }
    }
  }
}

function writeMarkdown(directory, slug, data, body) {
  const filePath = path.join(contentRoot, directory, `${slug}.md`);
  fs.writeFileSync(filePath, matter.stringify(body, data), 'utf8');
}

function seedTestWorkspace() {
  clearMarkdownContent();
  const date = '2026-08-05';

  for (const project of projects) {
    const { slug, body, ...data } = project;
    writeMarkdown('projects', slug, {
      ...data,
      owner: '',
      created: date,
      updated: date,
    }, body);
  }

  const orderByStatus = { todo: 100, 'in-progress': 200, 'in-review': 300, done: 400 };
  const statusCounts = { todo: 0, 'in-progress': 0, 'in-review': 0, done: 0 };

  for (const [index, [project, title, status, priority, assignee]] of tasks.entries()) {
    const taskSlug = `${project}--${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const order = orderByStatus[status] + statusCounts[status] * 10;
    statusCounts[status] += 1;

    writeMarkdown('tasks', taskSlug, {
      title,
      project,
      status,
      priority,
      assignee,
      tags: priority === 'critical' ? ['urgent'] : ['fixture'],
      due: status === 'done' ? '' : `2026-08-${String(10 + index).padStart(2, '0')}`,
      order,
      parent: '',
      created: date,
      updated: date,
      blocked_by: [],
    }, `Test fixture task for ${project}.`);
  }

  const statusSummary = Object.entries(statusCounts)
    .map(([status, count]) => `${count} ${status}`)
    .join(', ');
  console.log(`✅ Seeded ${projects.length} projects and ${tasks.length} tasks.`);
  console.log(`   Statuses: ${statusSummary}.`);
}

const command = process.argv[2];

if (command === 'reset') {
  clearMarkdownContent();
  console.log('✅ Orbit workspace reset: removed Markdown content from projects, tasks, and agents.');
} else if (command === 'test') {
  seedTestWorkspace();
} else {
  console.error('Usage: node scripts/workspace.mjs <reset|test>');
  process.exit(1);
}
