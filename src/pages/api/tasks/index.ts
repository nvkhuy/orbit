import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export const GET: APIRoute = async () => {
  try {
    const tasksDir = path.join(process.cwd(), 'src', 'content', 'tasks');
    const tasks = fs.readdirSync(tasksDir)
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const slug = file.replace(/\.md$/, '');
        const fileContent = fs.readFileSync(path.join(tasksDir, file), 'utf-8');
        const parsed = matter(fileContent);

        return {
          slug,
          ...parsed.data,
          content: parsed.content,
        };
      });

    return new Response(JSON.stringify(tasks), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to read tasks' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Generate slug if not provided
    const slug = data.slug || `${data.project}--${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    
    // Create frontmatter object
    const frontmatter = {
      title: data.title,
      project: data.project,
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      assignee: data.assignee || '',
      tags: data.tags || [],
      due: data.due || '',
      order: data.order || 100,
      parent: data.parent || '',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      blocked_by: data.blocked_by || [],
    };

    const content = data.content || '';
    
    // Stringify to markdown
    const md = matter.stringify(content, frontmatter);
    
    // Write to disk
    const filePath = path.join(process.cwd(), 'src', 'content', 'tasks', `${slug}.md`);
    fs.writeFileSync(filePath, md, 'utf-8');
    
    return new Response(JSON.stringify({ success: true, slug }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    console.error('[API] Failed to create task:', error);
    return new Response(JSON.stringify({ error: 'Failed to create task', details: error?.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
