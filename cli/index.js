#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const program = new Command();

const TASKS_DIR = path.resolve(process.cwd(), 'src/content/tasks');
const PROJECTS_DIR = path.resolve(process.cwd(), 'src/content/projects');

function ensureDirs() {
  if (!fs.existsSync(TASKS_DIR)) fs.mkdirSync(TASKS_DIR, { recursive: true });
  if (!fs.existsSync(PROJECTS_DIR)) fs.mkdirSync(PROJECTS_DIR, { recursive: true });
}

program
  .name('orbit')
  .description('🪐 Orbit CLI — Serverless Markdown project management for Humans & AI Agents')
  .version('1.0.0');

// Task subcommand group
const taskCmd = program.command('task').description('Manage workspace tasks');

taskCmd
  .command('create')
  .description('Create a new task markdown file')
  .requiredOption('-p, --project <slug>', 'Project slug')
  .requiredOption('-t, --title <title>', 'Task title')
  .option('-s, --status <status>', 'Status (todo|in-progress|in-review|done|blocked)', 'todo')
  .option('--priority <priority>', 'Priority (low|medium|high|critical)', 'medium')
  .option('-a, --assignee <assignee>', 'Assignee name', 'claude')
  .option('--tags <tags>', 'Comma separated tags', '')
  .option('--due <due>', 'Due date (YYYY-MM-DD)', '')
  .action((options) => {
    ensureDirs();
    const cleanTitle = options.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${options.project}--${cleanTitle}-${Date.now().toString().slice(-4)}`;
    const filePath = path.join(TASKS_DIR, `${slug}.md`);

    const frontmatter = {
      title: options.title,
      project: options.project,
      status: options.status,
      priority: options.priority,
      assignee: options.assignee,
      tags: options.tags ? options.tags.split(',').map((t) => t.trim()) : [],
      due: options.due || '',
      order: 100,
      parent: '',
      created: new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0],
      blocked_by: [],
    };

    const content = `## Description\n${options.title}\n\n## Agent Log\n- ${new Date().toISOString()} — Created by ${options.assignee}\n`;
    const fileText = matter.stringify(content, frontmatter);

    fs.writeFileSync(filePath, fileText, 'utf8');
    console.log(`✅ Created task [${slug}] at src/content/tasks/${slug}.md`);
  });

taskCmd
  .command('update <slug>')
  .description('Update a task frontmatter or append agent log')
  .option('-s, --status <status>', 'New status')
  .option('-a, --assignee <assignee>', 'New assignee')
  .option('--priority <priority>', 'New priority')
  .option('-t, --title <title>', 'New title')
  .option('-l, --log <logMessage>', 'Append entry to Agent Log')
  .action((slug, options) => {
    ensureDirs();
    const filePath = path.join(TASKS_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Task ${slug} not found at ${filePath}`);
      process.exit(1);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    if (options.status) data.status = options.status;
    if (options.assignee) data.assignee = options.assignee;
    if (options.priority) data.priority = options.priority;
    if (options.title) data.title = options.title;
    data.updated = new Date().toISOString().split('T')[0];

    let newBody = content;
    if (options.log) {
      newBody += `\n\n## Agent Log\n- ${new Date().toISOString()} — ${options.log}`;
    }

    const fileText = matter.stringify(newBody, data);
    fs.writeFileSync(filePath, fileText, 'utf8');
    console.log(`✅ Updated task [${slug}]`);
  });

taskCmd
  .command('list')
  .description('List tasks with filters')
  .option('-p, --project <project>', 'Filter by project')
  .option('-s, --status <status>', 'Filter by status')
  .option('-a, --assignee <assignee>', 'Filter by assignee')
  .action((options) => {
    ensureDirs();
    const files = fs.readdirSync(TASKS_DIR).filter((f) => f.endsWith('.md'));
    let tasks = files.map((file) => {
      const slug = file.replace(/\.md$/, '');
      const { data } = matter(fs.readFileSync(path.join(TASKS_DIR, file), 'utf8'));
      return { slug, ...data };
    });

    if (options.project) tasks = tasks.filter((t) => t.project === options.project);
    if (options.status) tasks = tasks.filter((t) => t.status === options.status);
    if (options.assignee) tasks = tasks.filter((t) => t.assignee === options.assignee);

    console.log(`\n📋 Found ${tasks.length} task(s):\n`);
    tasks.forEach((t) => {
      console.log(`- [${(t.status || 'todo').toUpperCase()}] ${t.slug} ("${t.title}") — Project: ${t.project} | Assignee: ${t.assignee} | Priority: ${t.priority}`);
    });
    console.log('');
  });

taskCmd
  .command('done <slug>')
  .description('Quickly mark a task as completed')
  .action((slug) => {
    ensureDirs();
    const filePath = path.join(TASKS_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Task ${slug} not found`);
      process.exit(1);
    }
    const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
    data.status = 'done';
    data.updated = new Date().toISOString().split('T')[0];

    const fileText = matter.stringify(content, data);
    fs.writeFileSync(filePath, fileText, 'utf8');
    console.log(`🎉 Marked task [${slug}] as DONE!`);
  });

// Project subcommand group
const projectCmd = program.command('project').description('Manage workspace projects');

projectCmd
  .command('create')
  .description('Create a new project markdown file')
  .requiredOption('-t, --title <title>', 'Project title')
  .option('-s, --slug <slug>', 'Custom slug')
  .option('--status <status>', 'Status (active|paused|archived|completed)', 'active')
  .option('--color <color>', 'Hex color for card', '#fff9c4')
  .action((options) => {
    ensureDirs();
    const slug = options.slug || options.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const filePath = path.join(PROJECTS_DIR, `${slug}.md`);

    const frontmatter = {
      title: options.title,
      slug,
      status: options.status,
      priority: 'high',
      tags: ['project'],
      color: options.color,
      owner: 'human',
      columns: ['todo', 'in-progress', 'in-review', 'done'],
      created: new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0],
    };

    const content = `# ${options.title}\n\nProject overview and notes.\n`;
    const fileText = matter.stringify(content, frontmatter);
    fs.writeFileSync(filePath, fileText, 'utf8');
    console.log(`✅ Created project [${slug}] at src/content/projects/${slug}.md`);
  });

projectCmd
  .command('list')
  .description('List all projects')
  .action(() => {
    ensureDirs();
    const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith('.md'));
    console.log(`\n📁 Workspace Projects (${files.length}):\n`);
    files.forEach((file) => {
      const { data } = matter(fs.readFileSync(path.join(PROJECTS_DIR, file), 'utf8'));
      console.log(`- [${(data.status || 'active').toUpperCase()}] ${data.slug || file.replace('.md', '')} — "${data.title}" (${data.owner})`);
    });
    console.log('');
  });

// Summary command for AI agents
program
  .command('summary')
  .description('Output a machine-readable summary of the entire workspace')
  .action(() => {
    ensureDirs();
    const projectFiles = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith('.md'));
    const taskFiles = fs.readdirSync(TASKS_DIR).filter((f) => f.endsWith('.md'));

    const projects = projectFiles.map((f) => matter(fs.readFileSync(path.join(PROJECTS_DIR, f), 'utf8')).data);
    const tasks = taskFiles.map((f) => ({
      slug: f.replace(/\.md$/, ''),
      ...matter(fs.readFileSync(path.join(TASKS_DIR, f), 'utf8')).data,
    }));

    const output = {
      timestamp: new Date().toISOString(),
      projectCount: projects.length,
      taskCount: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      inProgress: tasks.filter((t) => t.status === 'in-progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
      projects,
      tasks,
    };

    console.log(JSON.stringify(output, null, 2));
  });

program.parse(process.argv);
