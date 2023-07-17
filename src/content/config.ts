import { site } from '../data/config.json';
// Example: A cheatsheet of many common Zod datatypes
import { z, defineCollection } from 'astro:content';

const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    date: z.date(),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    twitter_text: z.string(),
    image: z.string().default(site.default_image),
    image_url: z.string().default(site.baseurl),
    image_credit: z.string().default(site.site_name)
  }),
});

export const collections = {
  'posts': postsCollection
}