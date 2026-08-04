import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export function readTasksFromDisk() {
  const tasksDir = path.join(process.cwd(), 'src', 'content', 'tasks');

  return fs.readdirSync(tasksDir)
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const fileContent = fs.readFileSync(path.join(tasksDir, file), 'utf-8');
      const parsed = matter(fileContent);

      return {
        id: file.replace(/\.md$/, ''),
        data: parsed.data,
        body: parsed.content,
      };
    });
}
