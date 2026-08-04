import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const prerender = false;

const TASKS_DIR = path.resolve(process.cwd(), 'src/content/tasks');

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const { slug } = params;
    if (!slug) return new Response(JSON.stringify({ error: 'Slug parameter required' }), { status: 400 });

    const filePath = path.join(TASKS_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ error: `Task ${slug} not found` }), { status: 404 });
    }

    const updates = await request.json();
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    const updatedData = {
      ...data,
      ...updates,
      updated: new Date().toISOString().split('T')[0],
    };

    const newContent = updates.content !== undefined ? updates.content : content;
    delete updatedData.content;

    const fileText = matter.stringify(newContent, updatedData);
    fs.writeFileSync(filePath, fileText, 'utf8');

    return new Response(JSON.stringify({ success: true, slug, task: { slug, ...updatedData, content: newContent } }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const PUT = PATCH;

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { slug } = params;
    if (!slug) return new Response(JSON.stringify({ error: 'Slug parameter required' }), { status: 400 });

    const filePath = path.join(TASKS_DIR, `${slug}.md`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return new Response(JSON.stringify({ success: true, slug }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
