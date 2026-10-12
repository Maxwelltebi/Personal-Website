import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { postCategories } from './lib/categories';

// Blog posts are written in the editor (/keystatic → Blog posts). This schema mirrors it.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.enum([...postCategories, 'none']).default('none'),
    date: z.coerce.date().nullish(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    cover: z.string().nullish(),
  }),
});

export const collections = { blog };
