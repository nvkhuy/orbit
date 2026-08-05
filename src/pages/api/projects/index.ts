import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const frontmatter = {
      title: data.title,
      status: data.status || 'active',
      tags: data.tags || [],
      color: data.color || '#fff9c4',
      order: data.order ?? Date.now(),
      owner: data.owner || '',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      columns: data.columns || ['todo', 'in-progress', 'in-review', 'done'],
    };

    const content = data.content || '';
    
    const md = matter.stringify(content, frontmatter);
    
    const filePath = path.join(process.cwd(), 'src', 'content', 'projects', `${slug}.md`);
    fs.writeFileSync(filePath, md, 'utf-8');
    
    return new Response(JSON.stringify({ success: true, slug }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create project' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
