import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const contentRoot = path.join(root, 'src', 'content');
const contentDirs = ['projects', 'tasks', 'agents'];

const projectColumns = ['todo', 'in-progress', 'in-review', 'done'];
const projectDefinitions = [
  ['marketing-campaigns', 'Marketing Campaigns', 'active', '#e3f2fd', ['marketing', 'growth'], 'Campaign planning, audience growth, and launch execution.'],
  ['technical-enhancements', 'Technical Enhancements', 'active', '#fff9c4', ['engineering', 'platform'], 'Incremental improvements across the technical platform.'],
  ['business-development', 'Business Development', 'active', '#dcedc8', ['business', 'partnerships'], 'New commercial opportunities and strategic partnerships.'],
  ['game-art-studio', 'Game & Art Studio', 'active', '#f3e5f5', ['games', 'art'], 'Game concepts, illustration, animation, and interactive experiences.'],
  ['customer-experience', 'Customer Experience', 'active', '#fce4ec', ['customer', 'experience'], 'Improve every stage of the customer journey.'],
  ['data-analytics', 'Data & Analytics', 'active', '#ffecb3', ['data', 'analytics'], 'Reliable reporting, insights, and decision support.'],
  ['mobile-product', 'Mobile Product', 'active', '#e1f5fe', ['mobile', 'product'], 'Mobile application delivery and product improvements.'],
  ['security-compliance', 'Security & Compliance', 'paused', '#f8bbd0', ['security', 'compliance'], 'Security reviews, controls, and compliance readiness.'],
  ['design-system', 'Design System', 'active', '#e1bee7', ['design', 'frontend'], 'Shared components, patterns, and visual language.'],
  ['ai-research-lab', 'AI Research Lab', 'active', '#ede7f6', ['ai', 'research'], 'Applied AI experiments and agent workflow research.'],
  ['content-strategy', 'Content Strategy', 'active', '#fff3e0', ['content', 'editorial'], 'Editorial planning and reusable content systems.'],
  ['sales-operations', 'Sales Operations', 'active', '#e8f5e9', ['sales', 'operations'], 'Sales processes, tooling, and pipeline visibility.'],
  ['community-growth', 'Community Growth', 'active', '#e0f7fa', ['community', 'growth'], 'Community programs, events, and member engagement.'],
  ['developer-experience', 'Developer Experience', 'active', '#e8eaf6', ['developer-tools', 'engineering'], 'Faster, clearer, and safer developer workflows.'],
  ['platform-reliability', 'Platform Reliability', 'active', '#fff8e1', ['reliability', 'platform'], 'Availability, observability, and incident prevention.'],
  ['ecommerce-expansion', 'E-commerce Expansion', 'active', '#fce4ec', ['commerce', 'growth'], 'Storefront growth, conversion, and fulfillment improvements.'],
  ['finance-automation', 'Finance Automation', 'active', '#e8f5e9', ['finance', 'automation'], 'Automated reporting, reconciliation, and forecasting.'],
  ['people-culture', 'People & Culture', 'paused', '#fff3e0', ['people', 'culture'], 'Team development, hiring, and workplace programs.'],
  ['education-hub', 'Education Hub', 'active', '#e3f2fd', ['education', 'learning'], 'Learning experiences, courses, and knowledge sharing.'],
  ['healthcare-innovation', 'Healthcare Innovation', 'active', '#e0f2f1', ['healthcare', 'innovation'], 'Patient-centered service and technology experiments.'],
  ['sustainability-program', 'Sustainability Program', 'active', '#dcedc8', ['sustainability', 'operations'], 'Environmental goals and sustainable operations.'],
  ['creative-media', 'Creative Media', 'active', '#f3e5f5', ['creative', 'media'], 'Video, audio, photography, and storytelling projects.'],
  ['partner-ecosystem', 'Partner Ecosystem', 'active', '#e1f5fe', ['partners', 'ecosystem'], 'Partner onboarding, enablement, and shared success.'],
  ['international-launch', 'International Launch', 'paused', '#fff9c4', ['international', 'launch'], 'Localization and market-entry coordination.'],
  ['quality-engineering', 'Quality Engineering', 'active', '#e8eaf6', ['quality', 'testing'], 'Test strategy, automation, and release confidence.'],
  ['infrastructure-modernization', 'Infrastructure Modernization', 'active', '#ffecb3', ['infrastructure', 'cloud'], 'Modern infrastructure, deployment, and operations.'],
  ['product-discovery', 'Product Discovery', 'active', '#fce4ec', ['product', 'research'], 'User discovery, prototyping, and opportunity validation.'],
  ['support-operations', 'Support Operations', 'active', '#e0f7fa', ['support', 'operations'], 'Support quality, efficiency, and knowledge management.'],
  ['brand-refresh', 'Brand Refresh', 'active', '#f8bbd0', ['brand', 'design'], 'Brand identity, messaging, and rollout coordination.'],
  ['innovation-sandbox', 'Innovation Sandbox', 'paused', '#ede7f6', ['innovation', 'experiments'], 'A safe space for prototypes and emerging ideas.'],
];

const projects = projectDefinitions.map(([slug, title, status, color, tags, body]) => ({
  slug,
  title,
  status,
  color,
  tags,
  columns: projectColumns,
  body,
}));

const taskTitles = [
  'Define success metrics',
  'Interview key stakeholders',
  'Audit the current workflow',
  'Prioritize the opportunity backlog',
  'Create the delivery roadmap',
  'Draft the technical approach',
  'Build an interactive prototype',
  'Prepare the asset library',
  'Implement the core workflow',
  'Integrate supporting services',
  'Add analytics and reporting',
  'Review accessibility requirements',
  'Improve performance and resilience',
  'Complete the security review',
  'Write the quality test plan',
  'Add automated test coverage',
  'Run the internal beta',
  'Collect user feedback',
  'Polish edge cases',
  'Document the operating model',
  'Prepare team training',
  'Create the launch plan',
  'Coordinate the phased rollout',
  'Monitor launch health',
  'Measure initial outcomes',
  'Triage follow-up improvements',
  'Test an experimental concept',
  'Prepare localization support',
  'Validate compliance requirements',
  'Run the project retrospective',
];

const taskStatuses = ['todo', 'in-progress', 'in-review', 'done'];
const taskPriorities = ['low', 'medium', 'high', 'critical'];
const taskAssignees = ['huy', 'claude', 'mina', 'copilot', ''];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffled(values) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function randomValuesWithCoverage(values, count) {
  const result = [...values];
  while (result.length < count) {
    result.push(values[randomInt(0, values.length - 1)]);
  }
  return shuffled(result);
}

function createFixtureTasks() {
  return projects.flatMap((project) => {
    const taskCount = randomInt(15, 30);
    const titles = shuffled(taskTitles).slice(0, taskCount);
    const statuses = randomValuesWithCoverage(taskStatuses, taskCount);
    const priorities = randomValuesWithCoverage(taskPriorities, taskCount);

    return titles.map((title, taskIndex) => ({
      project: project.slug,
      title: `${title} — ${project.title}`,
      status: statuses[taskIndex],
      priority: priorities[taskIndex],
      assignee: taskAssignees[randomInt(0, taskAssignees.length - 1)],
      tags: priorities[taskIndex] === 'critical'
        ? [project.tags[0], 'urgent']
        : [project.tags[0], 'fixture'],
    }));
  });
}

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
  const tasks = createFixtureTasks();

  for (const [projectIndex, project] of projects.entries()) {
    const { slug, body, ...data } = project;
    writeMarkdown('projects', slug, {
      ...data,
      owner: '',
      order: (projectIndex + 1) * 100,
      created: date,
      updated: date,
    }, body);
  }

  const orderByStatus = { todo: 100, 'in-progress': 200, 'in-review': 300, done: 400 };
  const statusCounts = { todo: 0, 'in-progress': 0, 'in-review': 0, done: 0 };
  const priorityCounts = { low: 0, medium: 0, high: 0, critical: 0 };
  const projectStatusCounts = new Map();

  for (const [index, task] of tasks.entries()) {
    const { project, title, status, priority, assignee, tags } = task;
    const taskSlug = `${project}--${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const projectStatusKey = `${project}:${status}`;
    const projectStatusCount = projectStatusCounts.get(projectStatusKey) ?? 0;
    const order = orderByStatus[status] + projectStatusCount * 10;
    projectStatusCounts.set(projectStatusKey, projectStatusCount + 1);
    statusCounts[status] += 1;
    priorityCounts[priority] += 1;

    const dueDate = new Date(Date.UTC(2026, 7, 10));
    dueDate.setUTCDate(dueDate.getUTCDate() + (index % 75));

    writeMarkdown('tasks', taskSlug, {
      title,
      project,
      status,
      priority,
      assignee,
      tags,
      due: status === 'done' ? '' : dueDate.toISOString().slice(0, 10),
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
  const prioritySummary = Object.entries(priorityCounts)
    .map(([priority, count]) => `${count} ${priority}`)
    .join(', ');
  console.log(`✅ Seeded ${projects.length} projects and ${tasks.length} tasks.`);
  console.log('   Each project contains 15–30 tasks and covers every status and priority.');
  console.log(`   Statuses: ${statusSummary}.`);
  console.log(`   Priorities: ${prioritySummary}.`);
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
