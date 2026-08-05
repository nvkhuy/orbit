import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import AdmZip from 'adm-zip';

export const GET: APIRoute = async () => {
  try {
    const contentDir = path.join(process.cwd(), 'src', 'content');

    if (!fs.existsSync(contentDir)) {
      return new Response(JSON.stringify({ error: 'Content directory not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const zip = new AdmZip();

    // Recursively add everything inside src/content to the zip
    zip.addLocalFolder(contentDir);

    const zipBuffer = zip.toBuffer();

    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const filename = `orbit-${dd}-${mm}-${yyyy}.zip`;

    return new Response(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(zipBuffer.length),
      },
    });
  } catch (error: any) {
    console.error('Export failed:', error);
    return new Response(JSON.stringify({ error: 'Failed to export workspace', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
