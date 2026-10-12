# Editing the site

All text, projects, blog posts, images and the résumé are edited in the content editor. No code needed.

| Where | Address | What happens when you click **Save** |
|---|---|---|
| Live site | `https://<your-site>/keystatic` (sign in with GitHub) | The change is committed to GitHub; Vercel rebuilds and it's live in about a minute. |
| Your laptop | `http://localhost:4321/keystatic` (after `npm run dev`) | The files change on your laptop. Commit and push to publish. |

> Edits made online land on GitHub. Run `git pull` before working on the code locally.

## What's where

| Editor section | Controls |
|---|---|
| **Site settings** | Name, email, location, LinkedIn/GitHub, search description, résumé PDF, footer heading |
| **Home** | Hero, the two "What I do" cards, stats band, Selected work list |
| **About** | Hero, facts bar, education, experience, toolkit |
| **Research** | Hero, research areas, projects & papers |
| **Innovations** | Hero and the featured project (the one with the shuttle map) |
| **Leadership** | Hero, CIReN section, other roles |
| **Blog page** | Blog hero text |
| **Projects (Innovations)** | The "More builds" cards and each project's case-study page |
| **Blog posts** | Posts |

Section headings ("What I do", "Selected work"…), layout, shapes and animation live in code.

## Common tasks

**Add a project.** Projects (Innovations) → **+**. Fill in the title, summary, badge, stack and categories (these drive the filter buttons). Upload a screenshot, add the code/demo links, and write the four case-study sections. Use **Order** to set its position (lower shows first). It gets its own page at `/innovations/<page address>`.

**Write a blog post.** Blog posts → **+**. Write in the editor on the left; set the summary, category, **publish date** and cover image on the right. Tick **Draft** to keep it off the live site. Tick **Featured** to put it in the big card at the top of the Blog page (on one post at a time). Read time is calculated for you.

**Replace your résumé.** Site settings → Résumé (PDF) → **Choose file**. Update the page count if it changed.

**Reorder or remove items** in any list (experience, stats, roles…): drag the ⠿ handle, or click the bin icon.

**Line breaks in big headings.** Hero titles keep the line breaks you type (press Enter).

**Links.** Paste a full URL (`https://…`) or a page path (`/research`). Empty links point nowhere until you fill them in, and an empty demo link shows "Live demo [Add link]".

**Linking to a research entry.** Give the paper a **Link ID** such as `flood-risk`; then `/research#flood-risk` jumps straight to it (Home → Selected work uses this).

**Placeholders.** Anything still in `[brackets]` is a placeholder from the design. Replace it whenever the real content is ready.
