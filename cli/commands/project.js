import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const projectsDir = path.join(process.cwd(), 'src', 'content', 'projects');

export function registerProjectCommands(program) {
  const projectGroup = program.command('project').description('Manage projects in the Orbit workspace');

  projectGroup
    .command('create')
    .description('Create a new project markdown file')
    .requiredOption('-t, --title <title>', 'Project title')
    .option('-s, --status <status>', 'Status', 'active')
    .option('-p, --priority <priority>', 'Priority', 'medium')
    .action((options) => {
      const slug = options.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const filePath = path.join(projectsDir, `${slug}.md`);

      const frontmatter = {
        title: options.title,
        status: options.status,
        priority: options.priority,
        color: '#fff9c4',
        created: new Date().toISOString().split('T')[0],
        updated: new Date().toISOString().split('T')[0],
        columns: ['todo', 'in-progress', 'in-review', 'done'],
      };

      const md = matter.stringify('\n# ' + options.title + '\nProject notes and goals.', frontmatter);
      fs.writeFileSync(filePath, md, 'utf-8');
      console.log(`✅ Created project: ${slug} (${filePath})`);
    });

  projectGroup
    .command('list')
    .description('List all projects')
    .action(() => {
      if (!fs.existsSync(projectsDir)) {
        console.log('No projects directory found.');
        return;
      }

      const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'));
      const projects = files.map(file => {
        const content = fs.readFileSync(path.join(projectsDir, file), 'utf-8');
        const parsed = matter(content);
        return { slug: file.replace('.md', ''), ...parsed.data };
      });

      console.table(projects.map(p => ({
        Slug: p.slug,
        Title: p.title,
        Status: p.status,
        Priority: p.priority,
      })));
    });
}
