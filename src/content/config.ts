import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(70),
    seoTitle: z.string().optional(),
    description: z.string().min(50).max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string().default('GEO'),
    draft: z.boolean().default(false),
  }),
});

export const collection = { blog };
export const collections = { blog };
