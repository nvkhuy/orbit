import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    status: z.enum(['active', 'paused', 'archived', 'completed']),
    priority: z.enum(['low', 'medium', 'high', 'critical']),
    tags: z.array(z.string()).optional(),
    color: z.string().optional(),
    owner: z.string().optional(),
    created: z.union([z.date(), z.string()]),
    updated: z.union([z.date(), z.string()]),
    columns: z.array(z.string()).optional(),
  })
});

const tasks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/tasks" }),
  schema: z.object({
    title: z.string(),
    project: z.string(),
    status: z.string(),
    priority: z.enum(['low', 'medium', 'high', 'critical']),
    assignee: z.string().optional(),
    tags: z.array(z.string()).optional(),
    due: z.union([z.date(), z.string()]).optional(),
    order: z.number(),
    parent: z.string().optional(),
    created: z.union([z.date(), z.string()]),
    updated: z.union([z.date(), z.string()]),
    blocked_by: z.array(z.string()).optional(),
  })
});

const agents = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/agents" }),
  schema: z.object({
    name: z.string(),
    type: z.enum(['ai', 'human']),
    permissions: z.array(z.string()),
    last_active: z.union([z.date(), z.string()]).optional(),
  })
});

export const collections = {
  projects,
  tasks,
  agents
};
