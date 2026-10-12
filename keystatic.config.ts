/**
 * Content editor (Keystatic) — open /keystatic.
 * Locally it saves straight to the files; on the live site it signs in with GitHub and commits.
 *
 * Every field here maps to text on the site. Layout, shapes and animation stay in code.
 */
import { collection, config, fields, singleton } from '@keystatic/core';
import { buildCategories, postCategories } from './src/lib/categories';

/* ---------------------------------------------------------------- shared pieces */

const heroFields = (defaults: { title: string }) => ({
  heroTitle: fields.text({
    label: 'Hero title',
    description: 'The big heading. Press Enter for a new line.',
    multiline: true,
    defaultValue: defaults.title,
    validation: { isRequired: true },
  }),
  heroLead: fields.text({ label: 'Hero subtitle', description: 'The thin line under the heading.' }),
  heroBody: fields.text({ label: 'Hero text', multiline: true }),
});

const link = (label: string, description?: string) =>
  fields.text({
    label,
    description: description ?? 'Full URL (https://…) or a page path like /research. Leave empty if you have none yet.',
  });

const statList = (label: string) =>
  fields.array(
    fields.object({
      value: fields.text({ label: 'Number', description: 'e.g. 200+, 93%, 3.94', validation: { isRequired: true } }),
      label: fields.text({ label: 'Label', validation: { isRequired: true } }),
    }),
    { label, itemLabel: (p) => `${p.fields.value.value} ${p.fields.label.value}` },
  );

const textList = (label: string, itemLabel = 'Item') =>
  fields.array(fields.text({ label: itemLabel, validation: { isRequired: true } }), {
    label,
    itemLabel: (p) => p.value,
  });


/* ---------------------------------------------------------------- config */

export default config({
  // Local files while developing; GitHub on the live site. Set PUBLIC_KEYSTATIC_STORAGE=github
  // to use GitHub locally too (needed once, to create the GitHub App).
  storage: import.meta.env.DEV && import.meta.env.PUBLIC_KEYSTATIC_STORAGE !== 'github'
    ? { kind: 'local' }
    : { kind: 'github', repo: { owner: 'Maxwelltebi', name: 'Personal-Website' } },

  ui: {
    brand: { name: 'Maxwell Tebi' },
    navigation: {
      Pages: ['home', 'about', 'research', 'innovations', 'leadership', 'blogPage'],
      Content: ['projects', 'posts'],
      Settings: ['site'],
    },
  },

  singletons: {
    site: singleton({
      label: 'Site settings',
      path: 'src/content/pages/site',
      format: { data: 'json' },
      schema: {
        name: fields.text({ label: 'Your name', validation: { isRequired: true } }),
        email: fields.text({ label: 'Email', validation: { isRequired: true } }),
        location: fields.text({ label: 'Location', description: 'Shown in the footer.' }),
        linkedin: fields.url({ label: 'LinkedIn URL' }),
        github: fields.url({ label: 'GitHub URL' }),
        description: fields.text({
          label: 'Search & share description',
          description: 'Shown by Google and in link previews.',
          multiline: true,
        }),
        resume: fields.file({
          label: 'Résumé (PDF)',
          description: 'Upload a new PDF to replace the one on the site.',
          directory: 'public/files',
          publicPath: '/files/',
          validation: { isRequired: true },
        }),
        resumeFileName: fields.text({
          label: 'Résumé download name',
          description: 'The file name visitors get when they download it.',
          defaultValue: 'Maxwell_Tebi_Resume.pdf',
        }),
        resumePages: fields.integer({ label: 'Résumé page count', defaultValue: 1 }),
        ctaTitle: fields.text({ label: 'Footer heading', defaultValue: "Let's work together" }),
        ctaSubtitle: fields.text({ label: 'Footer subheading' }),
      },
    }),

    home: singleton({
      label: 'Home',
      path: 'src/content/pages/home',
      format: { data: 'json' },
      schema: {
        ...heroFields({ title: "Hi, I'm\nMaxwell\nTebi" }),
        tracks: fields.array(
          fields.object({
            title: fields.text({ label: 'Title', validation: { isRequired: true } }),
            lead: fields.text({ label: 'Subtitle' }),
            body: fields.text({ label: 'Text', multiline: true }),
            linkLabel: fields.text({ label: 'Link text' }),
            linkUrl: link('Link'),
            shape: fields.select({
              label: 'Corner shape',
              options: [
                { label: 'Circle', value: 'circle' },
                { label: 'Square', value: 'square' },
              ],
              defaultValue: 'circle',
            }),
          }),
          { label: '"What I do" cards', itemLabel: (p) => p.fields.title.value },
        ),
        stats: statList('Stats band'),
        selectedWork: fields.array(
          fields.object({
            title: fields.text({ label: 'Title', validation: { isRequired: true } }),
            meta: fields.text({ label: 'Details line' }),
            url: link('Link', 'A page path like /innovations/biobrief or /research#flood-risk, or a full URL.'),
          }),
          { label: 'Selected work', itemLabel: (p) => p.fields.title.value },
        ),
      },
    }),

    about: singleton({
      label: 'About',
      path: 'src/content/pages/about',
      format: { data: 'json' },
      schema: {
        heroTitle: fields.text({ label: 'Hero title', defaultValue: 'About me', validation: { isRequired: true } }),
        heroLead: fields.text({ label: 'Hero subtitle' }),
        heroBody: fields.array(fields.text({ label: 'Paragraph', multiline: true }), {
          label: 'Hero paragraphs',
          itemLabel: (p) => p.value.slice(0, 60) + '…',
        }),
        facts: fields.array(
          fields.object({
            label: fields.text({ label: 'Label', validation: { isRequired: true } }),
            value: fields.text({ label: 'Value', validation: { isRequired: true } }),
          }),
          { label: 'Facts bar', itemLabel: (p) => `${p.fields.label.value}: ${p.fields.value.value}` },
        ),
        education: fields.array(
          fields.object({
            meta: fields.text({ label: 'Dates & place', description: 'e.g. Expected May 2030 · Salisbury, NC' }),
            school: fields.text({ label: 'School', validation: { isRequired: true } }),
            degree: fields.text({ label: 'Degree / programme' }),
            badges: textList('Badges', 'Badge'),
            note: fields.text({ label: 'Note', multiline: true }),
            current: fields.checkbox({ label: 'Highlight (dark border)', defaultValue: false }),
          }),
          { label: 'Education', itemLabel: (p) => p.fields.school.value },
        ),
        experience: fields.array(
          fields.object({
            date: fields.text({ label: 'Dates', validation: { isRequired: true } }),
            place: fields.text({ label: 'Place' }),
            role: fields.text({ label: 'Role', validation: { isRequired: true } }),
            org: fields.text({ label: 'Organisation' }),
            body: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Experience', itemLabel: (p) => `${p.fields.role.value} — ${p.fields.org.value}` },
        ),
        toolkit: fields.array(
          fields.object({
            group: fields.text({ label: 'Group name', validation: { isRequired: true } }),
            items: textList('Tools', 'Tool'),
          }),
          { label: 'Toolkit', itemLabel: (p) => p.fields.group.value },
        ),
      },
    }),

    research: singleton({
      label: 'Research',
      path: 'src/content/pages/research',
      format: { data: 'json' },
      schema: {
        ...heroFields({ title: 'My research' }),
        areas: fields.array(
          fields.object({
            title: fields.text({ label: 'Title', validation: { isRequired: true } }),
            body: fields.text({ label: 'Text', multiline: true }),
          }),
          { label: 'Research areas (black band)', itemLabel: (p) => p.fields.title.value },
        ),
        papers: fields.array(
          fields.object({
            title: fields.text({ label: 'Title', validation: { isRequired: true } }),
            anchor: fields.text({
              label: 'Link ID',
              description: 'Optional. Lets other pages link here, e.g. flood-risk → /research#flood-risk',
            }),
            year: fields.text({ label: 'Year / stage', description: 'e.g. 2026, Ongoing, Proposal' }),
            where: fields.text({ label: 'Where' }),
            statusLabel: fields.text({ label: 'Status label', description: 'e.g. Completed, In progress' }),
            statusStyle: fields.select({
              label: 'Status style',
              options: [
                { label: 'Outline (Completed)', value: 'outline' },
                { label: 'Solid black (award)', value: 'solid' },
                { label: 'Grey (In progress)', value: 'soft' },
                { label: 'Dashed (Seeking collaborators)', value: 'dashed' },
              ],
              defaultValue: 'outline',
            }),
            body: fields.text({ label: 'Description', multiline: true }),
            tags: textList('Tags', 'Tag'),
            links: fields.array(
              fields.object({
                label: fields.text({ label: 'Link text', validation: { isRequired: true } }),
                url: link('URL'),
                arrow: fields.select({
                  label: 'Arrow',
                  options: [
                    { label: '↗ (opens elsewhere)', value: '↗' },
                    { label: '→ (goes to a page)', value: '→' },
                  ],
                  defaultValue: '↗',
                }),
              }),
              { label: 'Links', itemLabel: (p) => p.fields.label.value },
            ),
          }),
          { label: 'Projects & papers', itemLabel: (p) => `${p.fields.year.value} — ${p.fields.title.value}` },
        ),
      },
    }),

    innovations: singleton({
      label: 'Innovations',
      path: 'src/content/pages/innovations',
      format: { data: 'json' },
      schema: {
        ...heroFields({ title: 'My innovations' }),
        featured: fields.object(
          {
            tag: fields.text({ label: 'Tag', defaultValue: 'Featured' }),
            note: fields.text({ label: 'Second tag', description: 'e.g. Moving to React Native + Expo' }),
            title: fields.text({ label: 'Title', validation: { isRequired: true } }),
            lead: fields.text({ label: 'Intro', multiline: true }),
            points: textList('Bullet points', 'Point'),
            stack: fields.text({ label: 'Tech stack line' }),
            codeUrl: link('Code URL'),
            demoUrl: link('Live demo URL'),
          },
          { label: 'Featured project (with the shuttle map)' },
        ),
      },
    }),

    leadership: singleton({
      label: 'Leadership',
      path: 'src/content/pages/leadership',
      format: { data: 'json' },
      schema: {
        ...heroFields({ title: 'My leadership' }),
        ciren: fields.object(
          {
            meta: fields.text({ label: 'Role & dates line' }),
            name: fields.text({ label: 'Name', validation: { isRequired: true } }),
            full: fields.text({ label: 'Full name' }),
            body: fields.text({ label: 'Description', multiline: true }),
            stats: statList('Stats grid'),
            partners: textList('Partners', 'Partner'),
          },
          { label: 'CIReN (black section)' },
        ),
        roles: fields.array(
          fields.object({
            org: fields.text({ label: 'Organisation line' }),
            title: fields.text({ label: 'Role', validation: { isRequired: true } }),
            body: fields.text({ label: 'Description', multiline: true }),
            stats: statList('Numbers'),
          }),
          { label: 'Other roles', itemLabel: (p) => p.fields.title.value },
        ),
      },
    }),

    blogPage: singleton({
      label: 'Blog page',
      path: 'src/content/pages/blog',
      format: { data: 'json' },
      schema: heroFields({ title: 'Blog' }),
    }),
  },

  collections: {
    projects: collection({
      label: 'Projects (Innovations)',
      path: 'src/content/projects/*',
      slugField: 'title',
      format: { data: 'json' },
      columns: ['title', 'badge'],
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
          slug: { label: 'Page address', description: 'Used in the URL: /innovations/<this>' },
        }),
        order: fields.integer({
          label: 'Order',
          description: 'Lower numbers show first in "More builds".',
          defaultValue: 10,
        }),
        badge: fields.text({ label: 'Badge', description: 'e.g. 94% accuracy, In progress' }),
        summary: fields.text({ label: 'Summary', multiline: true, validation: { isRequired: true } }),
        stack: fields.text({ label: 'Tech stack line', description: 'e.g. TensorFlow · scikit-learn · Streamlit' }),
        categories: fields.multiselect({
          label: 'Filter categories',
          options: buildCategories.map((c) => ({ label: c, value: c })),
        }),
        screenshot: fields.image({
          label: 'Screenshot',
          description: 'Shown on the card and the case study. Leave empty to show the placeholder.',
          directory: 'public/images/projects',
          publicPath: '/images/projects/',
        }),
        codeUrl: link('Code URL'),
        demoUrl: link('Live demo URL'),
        problem: fields.text({ label: 'Case study: The problem', multiline: true }),
        built: fields.text({ label: 'Case study: What I built', multiline: true }),
        results: fields.text({ label: 'Case study: Results', multiline: true }),
        next: fields.text({ label: "Case study: What's next", multiline: true }),
      },
    }),

    posts: collection({
      label: 'Blog posts',
      path: 'src/content/blog/*',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'date'],
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
          slug: { label: 'Page address', description: 'Used in the URL: /blog/<this>' },
        }),
        summary: fields.text({ label: 'Summary', multiline: true, validation: { isRequired: true } }),
        category: fields.select({
          label: 'Category',
          options: [
            ...postCategories.map((c) => ({ label: c, value: c })),
            { label: 'None (shows [Category])', value: 'none' },
          ],
          defaultValue: 'Research',
        }),
        date: fields.date({
          label: 'Publish date',
          description: 'Posts are listed newest first. Read time is worked out automatically.',
        }),
        featured: fields.checkbox({
          label: 'Featured',
          description: 'Shown in the big card at the top of the Blog page. Tick it on one post only.',
          defaultValue: false,
        }),
        draft: fields.checkbox({
          label: 'Draft',
          description: 'Drafts are hidden on the live site.',
          defaultValue: false,
        }),
        cover: fields.image({
          label: 'Cover image',
          directory: 'public/images/blog',
          publicPath: '/images/blog/',
        }),
        content: fields.markdoc({ label: 'Post', extension: 'md' }),
      },
    }),
  },
});
