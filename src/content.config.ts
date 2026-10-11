import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.enum(['Research', 'Engineering', 'Leadership', 'Notes', '[Category]']),
    // Plain text so the "[Date]" placeholders show as designed. Use e.g. "Oct 11, 2026".
    date: z.string(),
    readTime: z.string(),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { blog };
