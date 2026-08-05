import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const tasksDir = path.join(process.cwd(), 'src', 'content', 'tasks');
const projectsDir = path.join(process.cwd(), 'src', 'content', 'projects');

export function registerQueryCommands(program) {
  program
    .command('summary')
    .description('Generate a machine-readable summary of all workspace projects and tasks')
    .action(() => {
      let projects = [];
      let tasks = [];

      if (fs.existsSync(projectsDir)) {
        projects = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md')).map(f => {
          const content = fs.readFileSync(path.join(projectsDir, f), 'utf-8');
          const parsed = matter(content);
          return { slug: f.replace('.md', ''), ...parsed.data };
        });
      }

      if (fs.existsSync(tasksDir)) {
        tasks = fs.readdirSync(tasksDir).filter(f => f.endsWith('.md')).map(f => {
          const content = fs.readFileSync(path.join(tasksDir, f), 'utf-8');
          const parsed = matter(content);
          return { slug: f.replace('.md', ''), ...parsed.data };
        });
      }

      console.log('# 🪐 Workspace Machine Summary\n');
      console.log(`Generated at: ${new Date().toISOString()}\n`);

      console.log('## Projects');
      projects.forEach(p => {
        const pTasks = tasks.filter(t => t.project === p.slug);
        const doneCount = pTasks.filter(t => t.status === 'done').length;
        console.log(`- **${p.title}** (${p.slug}) | Status: ${p.status} | Progress: ${doneCount}/${pTasks.length}`);
      });

      console.log('\n## Open Tasks');
      const openTasks = tasks.filter(t => t.status !== 'done');
      openTasks.forEach(t => {
        console.log(`- [${t.status.toUpperCase()}] **${t.title}** (${t.slug}) in project *${t.project}* | Priority: ${t.priority} | Assignee: ${t.assignee || 'none'}`);
      });
    });

  program
    .command('query <pattern>')
    .description('Query tasks matching a title or tag pattern')
    .action((pattern) => {
      if (!fs.existsSync(tasksDir)) return;

      const files = fs.readdirSync(tasksDir).filter(f => f.endsWith('.md'));
      const q = pattern.toLowerCase();

      const matches = [];
      files.forEach(f => {
        const content = fs.readFileSync(path.join(tasksDir, f), 'utf-8');
        const parsed = matter(content);
        if (
          f.toLowerCase().includes(q) ||
          parsed.data.title?.toLowerCase().includes(q) ||
          parsed.data.tags?.some(t => t.toLowerCase().includes(q)) ||
          parsed.content.toLowerCase().includes(q)
        ) {
          matches.push({ slug: f.replace('.md', ''), ...parsed.data });
        }
      });

      console.log(`Found ${matches.length} matching tasks for "${pattern}":`);
      console.table(matches.map(m => ({ Slug: m.slug, Title: m.title, Status: m.status, Project: m.project })));
    });
}
