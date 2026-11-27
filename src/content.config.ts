import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const LENSES = {
  platform: 'Multi-tenant platforms',
  integrity: 'Data integrity and audit',
  integration: 'Integration and failure handling',
  reliability: 'Production reliability',
  'ai-engineering': 'AI-assisted engineering',
} as const;

const lens = z.enum(Object.keys(LENSES) as [keyof typeof LENSES, ...(keyof typeof LENSES)[]]);

const stat = z.object({ value: z.string(), label: z.string() });
const teaser = {
  short: z.string().optional(),
  hook: z.string(),
  stats: z.array(stat).max(3).default([]),
  tldr: z.array(z.string()).max(4).default([]),
  status: z.string().optional(),
};

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    themes: z.array(lens).min(1),
    weight: z.number().int().min(1).max(5),
    repo: z.string().url().optional(),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    language: z.string().optional(),
    ...teaser,
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    themes: z.array(lens).min(1),
    weight: z.number().int().min(1).max(5),
    context: z.string(),
    stack: z.array(z.string()).default([]),
    ...teaser,
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    themes: z.array(lens).min(1),
    weight: z.number().int().min(1).max(5),
    related: z.string().optional(),
  }),
});

export const collections = { projects, work, notes };
