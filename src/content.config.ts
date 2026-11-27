import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lenses = z.enum(['platform', 'integrity', 'integration', 'reliability', 'ai-engineering']);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    themes: z.array(lenses).min(1),
    weight: z.number().int().min(1).max(5),
    repo: z.string().url().optional(),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    language: z.string().optional(),
  }),
});

export const collections = { projects };
