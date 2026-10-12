/**
 * Reads the content managed in the editor (/keystatic). Everything is validated against the
 * schema in keystatic.config.ts at build time, so a broken entry fails the build instead of the page.
 */
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

export const getSite = () => reader.singletons.site.readOrThrow();
export const getHome = () => reader.singletons.home.readOrThrow();
export const getAbout = () => reader.singletons.about.readOrThrow();
export const getResearch = () => reader.singletons.research.readOrThrow();
export const getInnovations = () => reader.singletons.innovations.readOrThrow();
export const getLeadership = () => reader.singletons.leadership.readOrThrow();
export const getBlogPage = () => reader.singletons.blogPage.readOrThrow();

export type Project = Awaited<ReturnType<typeof getProjects>>[number];

export async function getProjects() {
  const all = await reader.collections.projects.all();
  return all
    .map(({ slug, entry }) => ({ slug, ...entry }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title));
}

/** Links left empty in the editor point nowhere until they're filled in. */
export const href = (url?: string | null) => (url && url.trim() ? url.trim() : '#');

/** Mirrors the design's "Live demo [Add link]" until a demo URL is set. */
export const demoLabel = (url?: string | null) => (url && url.trim() ? 'Live demo' : 'Live demo [Add link]');
