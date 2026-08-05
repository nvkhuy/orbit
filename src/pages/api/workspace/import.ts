import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import AdmZip from 'adm-zip';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No zip file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const zip = new AdmZip(buffer);
    const zipEntries = zip.getEntries();

    if (!zipEntries || zipEntries.length === 0) {
      return new Response(JSON.stringify({ error: 'Uploaded zip file is empty' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const contentDir = path.join(process.cwd(), 'src', 'content');

    // Ensure main subdirectories exist
    ['projects', 'tasks', 'agents'].forEach((subDir) => {
      const dirPath = path.join(contentDir, subDir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });

    // Wipe existing markdown files in src/content (replacing behavior)
    const wipeDirectory = (dir: string) => {
      if (!fs.existsSync(dir)) return;
      const files = fs.readdirSync(dir);
      for (const f of files) {
        const fullPath = path.join(dir, f);
        if (fs.statSync(fullPath).isDirectory()) {
          wipeDirectory(fullPath);
          fs.rmdirSync(fullPath);
        } else {
          fs.unlinkSync(fullPath);
        }
      }
    };

    wipeDirectory(contentDir);

    // Re-create core directories
    ['projects', 'tasks', 'agents'].forEach((subDir) => {
      const dirPath = path.join(contentDir, subDir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });

    // Extract entries into src/content
    for (const entry of zipEntries) {
      if (entry.isDirectory) continue;

      let entryPath = entry.entryName.replace(/\\/g, '/');

      // Strip leading 'src/content/' or 'content/' prefix if present
      if (entryPath.startsWith('src/content/')) {
        entryPath = entryPath.slice('src/content/'.length);
      } else if (entryPath.startsWith('content/')) {
        entryPath = entryPath.slice('content/'.length);
      }

      // Ignore system files like .DS_Store
      if (entryPath.includes('__MACOSX') || entryPath.endsWith('.DS_Store')) {
        continue;
      }

      const targetPath = path.join(contentDir, entryPath);
      const targetDir = path.dirname(targetPath);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      fs.writeFileSync(targetPath, entry.getData());
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Workspace imported successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Import failed:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to import workspace', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
