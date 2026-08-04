import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const tasksDir = path.join(process.cwd(), 'src', 'content', 'tasks');

export function registerTaskCommands(program) {
  const taskGroup = program.command('task').description('Manage tasks in the Orbit workspace');

  taskGroup
    .command('create')
    .description('Create a new task markdown file')
    .requiredOption('-p, --project <project>', 'Project slug')
    .requiredOption('-t, --title <title>', 'Task title')
    .option('--priority <priority>', 'Priority (low|medium|high|critical)', 'medium')
    .option('--assignee <assignee>', 'Assignee name')
    .option('--status <status>', 'Initial status', 'todo')
    .action((options) => {
      const slug = `${options.project}--${options.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      const filePath = path.join(tasksDir, `${slug}.md`);

      const frontmatter = {
        title: options.title,
        project: options.project,
        status: options.status,
        priority: options.priority,
        assignee: options.assignee || '',
        order: 100,
        created: new Date().toISOString().split('T')[0],
        updated: new Date().toISOString().split('T')[0],
      };

      const md = matter.stringify('\n## Notes\nCreated via Orbit CLI.', frontmatter);
      fs.writeFileSync(filePath, md, 'utf-8');
      console.log(`✅ Created task: ${slug} (${filePath})`);
    });

  taskGroup
    .command('update <slug>')
    .description('Update an existing task')
    .option('-s, --status <status>', 'New status')
    .option('-a, --assignee <assignee>', 'New assignee')
    .option('-p, --priority <priority>', 'New priority')
    .action((slug, options) => {
      const filePath = path.join(tasksDir, slug.endsWith('.md') ? slug : `${slug}.md`);
      if (!fs.existsSync(filePath)) {
        console.error(`❌ Task file not found: ${filePath}`);
        process.exit(1);
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const parsed = matter(fileContent);

      if (options.status) parsed.data.status = options.status;
      if (options.assignee) parsed.data.assignee = options.assignee;
      if (options.priority) parsed.data.priority = options.priority;
      parsed.data.updated = new Date().toISOString().split('T')[0];

      const md = matter.stringify(parsed.content, parsed.data);
      fs.writeFileSync(filePath, md, 'utf-8');
      console.log(`✅ Updated task: ${slug}`);
    });

  taskGroup
    .command('done <slug>')
    .description('Mark a task as done')
    .action((slug) => {
      const filePath = path.join(tasksDir, slug.endsWith('.md') ? slug : `${slug}.md`);
      if (!fs.existsSync(filePath)) {
        console.error(`❌ Task file not found: ${filePath}`);
        process.exit(1);
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const parsed = matter(fileContent);
      parsed.data.status = 'done';
      parsed.data.updated = new Date().toISOString().split('T')[0];

      const md = matter.stringify(parsed.content, parsed.data);
      fs.writeFileSync(filePath, md, 'utf-8');
      console.log(`🎉 Task marked as DONE: ${slug}`);
    });

  taskGroup
    .command('list')
    .description('List tasks')
    .option('-p, --project <project>', 'Filter by project')
    .option('-s, --status <status>', 'Filter by status')
    .action((options) => {
      if (!fs.existsSync(tasksDir)) {
        console.log('No tasks directory found.');
        return;
      }

      const files = fs.readdirSync(tasksDir).filter(f => f.endsWith('.md'));
      const tasks = files.map(file => {
        const content = fs.readFileSync(path.join(tasksDir, file), 'utf-8');
        const parsed = matter(content);
        return { slug: file.replace('.md', ''), ...parsed.data };
      });

      const filtered = tasks.filter(t => {
        if (options.project && t.project !== options.project) return false;
        if (options.status && t.status !== options.status) return false;
        return true;
      });

      console.table(filtered.map(t => ({
        Slug: t.slug,
        Title: t.title,
        Project: t.project,
        Status: t.status,
        Priority: t.priority,
        Assignee: t.assignee || '-',
      })));
    });
}
