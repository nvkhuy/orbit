import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

type ContentDirectory = 'projects' | 'tasks' | 'agents';

function readCollectionFromDisk(directory: ContentDirectory) {
  const collectionDir = path.join(process.cwd(), 'src', 'content', directory);

  if (!fs.existsSync(collectionDir)) {
    fs.mkdirSync(collectionDir, { recursive: true });
    return [];
  }

  return fs.readdirSync(collectionDir)
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const fileContent = fs.readFileSync(path.join(collectionDir, file), 'utf-8');
      const parsed = matter(fileContent);

      return {
        id: file.replace(/\.md$/, ''),
        data: parsed.data,
        body: parsed.content,
      };
    });
}

export function readProjectsFromDisk() {
  return readCollectionFromDisk('projects');
}

export function readTasksFromDisk() {
  return readCollectionFromDisk('tasks');
}

export function readAgentsFromDisk() {
  return readCollectionFromDisk('agents');
}

export function readProjectFromDisk(slug: string) {
  return readProjectsFromDisk().find(project => project.id === slug);
}

export function readTaskFromDisk(slug: string) {
  return readTasksFromDisk().find(task => task.id === slug);
}
