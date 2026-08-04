import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const prerender = false;

const PROJECTS_DIR = path.resolve(process.cwd(), 'src/content/projects');

export const GET: APIRoute = async () => {
  try {
    if (!fs.existsSync(PROJECTS_DIR)) {
      fs.mkdirSync(PROJECTS_DIR, { recursive: true });
    }
    const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith('.md'));
    const projects = files.map((file) => {
      const filePath = path.join(PROJECTS_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      const slug = data.slug || file.replace(/\.md$/, '');
      return {
        slug,
        ...data,
        content,
      };
    });

    return new Response(JSON.stringify(projects), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { title, slug: customSlug, status = 'active', priority = 'medium', tags = [], color = '#fff9c4', owner = 'human', columns = ['todo', 'in-progress', 'in-review', 'done'], content = '' } = body;

    if (!title) {
      return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400 });
    }

    const slug = customSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const filePath = path.join(PROJECTS_DIR, `${slug}.md`);

    const frontmatter = {
      title,
      slug,
      status,
      priority,
      tags: Array.isArray(tags) ? tags : [],
      color,
      owner,
      columns,
      created: new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0],
    };

    const fileText = matter.stringify(content || `# ${title}\n\nProject description\n`, frontmatter);
    if (!fs.existsSync(PROJECTS_DIR)) {
      fs.mkdirSync(PROJECTS_DIR, { recursive: true });
    }
    fs.writeFileSync(filePath, fileText, 'utf8');

    return new Response(JSON.stringify({ success: true, slug, project: { slug, ...frontmatter, content } }), { status: 201 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
