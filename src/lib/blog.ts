import { getCollection, type CollectionEntry } from 'astro:content';
import { postCategories } from './categories';

export type Post = CollectionEntry<'blog'>;

/** Published posts, newest first. Undated posts (placeholders) go last, in category order. Drafts only show in dev. */
export async function getPosts() {
  const posts = await getCollection('blog', (p) => import.meta.env.DEV || !p.data.draft);
  const rank = (p: Post) => postCategories.indexOf(p.data.category as (typeof postCategories)[number]);
  return posts.sort((a, b) => {
    const da = a.data.date?.getTime() ?? -Infinity;
    const db = b.data.date?.getTime() ?? -Infinity;
    return db - da || rank(a) - rank(b);
  });
}

export const categoryLabel = (p: Post) => (p.data.category === 'none' ? '[Category]' : p.data.category);

export const dateLabel = (p: Post) =>
  p.data.date
    ? p.data.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
    : '[Date]';

/** About 220 words a minute; "[X]" until the post has a date (i.e. is still a placeholder). */
export const readTime = (p: Post) =>
  p.data.date ? String(Math.max(1, Math.round((p.body ?? '').split(/\s+/).filter(Boolean).length / 220))) : '[X]';

export const metaLine = (p: Post) => `${p.data.summary} · ${dateLabel(p)} · ${readTime(p)} min read`;
