import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    status: z.enum(['active', 'paused', 'archived', 'completed']).default('active'),
    tags: z.array(z.string()).default([]),
    color: z.string().default('#fff9c4'),
    order: z.number().default(100),
    owner: z.string().default('human'),
    columns: z.array(z.string()).default(['todo', 'in-progress', 'in-review', 'done']),
    created: z.string().or(z.date()).transform((val) => String(val)),
    updated: z.string().or(z.date()).transform((val) => String(val)),
  }),
});

const tasks = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    project: z.string(),
    status: z.enum(['todo', 'in-progress', 'in-review', 'done', 'blocked']).default('todo'),
    priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
    assignee: z.string().default('unassigned'),
    tags: z.array(z.string()).default([]),
    due: z.string().optional().default(''),
    order: z.number().default(100),
    parent: z.string().optional().default(''),
    created: z.string().or(z.date()).transform((val) => String(val)),
    updated: z.string().or(z.date()).transform((val) => String(val)),
    blocked_by: z.array(z.string()).default([]),
  }),
});

const agents = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    type: z.enum(['ai', 'human']).default('ai'),
    permissions: z.array(z.string()).default(['read-all', 'write-tasks', 'update-status']),
    last_active: z.string().optional().default(''),
  }),
});

export const collections = {
  projects,
  tasks,
  agents,
};
