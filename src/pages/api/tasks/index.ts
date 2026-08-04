import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const prerender = false;

const TASKS_DIR = path.resolve(process.cwd(), 'src/content/tasks');

export const GET: APIRoute = async () => {
  try {
    if (!fs.existsSync(TASKS_DIR)) {
      fs.mkdirSync(TASKS_DIR, { recursive: true });
    }
    const files = fs.readdirSync(TASKS_DIR).filter((f) => f.endsWith('.md'));
    const tasks = files.map((file) => {
      const filePath = path.join(TASKS_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      const slug = file.replace(/\.md$/, '');
      return {
        slug,
        ...data,
        content,
      };
    });

    return new Response(JSON.stringify(tasks), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { title, project, status = 'todo', priority = 'medium', assignee = 'unassigned', tags = [], due = '', parent = '', order = 100, content = '' } = body;

    if (!title || !project) {
      return new Response(JSON.stringify({ error: 'Title and Project are required' }), { status: 400 });
    }

    const cleanTitleSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${project}--${cleanTitleSlug}-${Date.now().toString().slice(-4)}`;
    const filePath = path.join(TASKS_DIR, `${slug}.md`);

    const frontmatter = {
      title,
      project,
      status,
      priority,
      assignee,
      tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
      due: due || '',
      order: Number(order) || 100,
      parent: parent || '',
      created: new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0],
      blocked_by: [],
    };

    const fileText = matter.stringify(content || `## Description\n${title}\n`, frontmatter);
    if (!fs.existsSync(TASKS_DIR)) {
      fs.mkdirSync(TASKS_DIR, { recursive: true });
    }
    fs.writeFileSync(filePath, fileText, 'utf8');

    return new Response(JSON.stringify({ success: true, slug, task: { slug, ...frontmatter, content } }), { status: 201 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
