import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export const PATCH: APIRoute = async ({ request, params }) => {
  try {
    const slug = params.slug;
    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), { status: 400 });
    }

    const updates = await request.json();
    const filePath = path.join(process.cwd(), 'src', 'content', 'tasks', `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ error: 'Task not found' }), { status: 404 });
    }

    // Read existing file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(fileContent);
    
    // Update frontmatter
    const newFrontmatter = {
      ...parsed.data,
      ...updates,
      updated: new Date().toISOString()
    };
    
    // Keep original content if not updated
    const newContent = updates.content !== undefined ? updates.content : parsed.content;
    
    // Write back to disk
    const md = matter.stringify(newContent, newFrontmatter);
    fs.writeFileSync(filePath, md, 'utf-8');
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update task' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const slug = params.slug;
    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src', 'content', 'tasks', `${slug}.md`);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete task' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
