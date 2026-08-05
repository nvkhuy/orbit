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
    const filePath = path.join(process.cwd(), 'src', 'content', 'projects', `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ error: 'Project not found' }), { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(fileContent);
    
    const newFrontmatter = {
      ...parsed.data,
      ...updates,
      updated: new Date().toISOString()
    };
    
    const newContent = updates.content !== undefined ? updates.content : parsed.content;
    
    const md = matter.stringify(newContent, newFrontmatter);
    fs.writeFileSync(filePath, md, 'utf-8');
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('[API] Failed to update project:', error);
    return new Response(JSON.stringify({ error: 'Failed to update project', details: error?.message }), {
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

    const filePath = path.join(process.cwd(), 'src', 'content', 'projects', `${slug}.md`);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Also remove any tasks associated with this project
    const tasksDir = path.join(process.cwd(), 'src', 'content', 'tasks');
    if (fs.existsSync(tasksDir)) {
      const taskFiles = fs.readdirSync(tasksDir);
      for (const file of taskFiles) {
        if (file.endsWith('.md')) {
          const taskPath = path.join(tasksDir, file);
          try {
            const content = fs.readFileSync(taskPath, 'utf-8');
            const parsed = matter(content);
            if (parsed.data.project === slug) {
              fs.unlinkSync(taskPath);
            }
          } catch (e) {
            // Ignore error reading individual task file
          }
        }
      }
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('[API] Failed to delete project:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete project', details: error?.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
