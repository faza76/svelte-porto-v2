# danielkessler.dev — SvelteKit clone

A working SvelteKit recreation of thavlik.dev's structure and design system, with the
persona, projects, and blog posts rewritten for a fictional **Daniel Kessler — Software
Engineer, Healthcare & Manufacturing Systems**.

Nothing about the original site owner's real identity, real repositories, or real content
is reused here — names, project descriptions, and blog posts are invented to fit the new
persona. Only the *engineering patterns* (layout, design tokens, canvas animation
technique, content architecture) are carried over.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  app.html              SvelteKit HTML shell
  app.css               Global design tokens + shared component classes
  lib/
    data/
      profile.js         The persona: name, tagline, bio, contact info
      projects.js         The portfolio grid content
    content/
      blog/*.md          Blog posts as Markdown files with frontmatter
    utils/
      posts.js            Loads + parses the markdown at build time
    components/
      SignalBackground.svelte   The animated canvas background
      SiteHeader.svelte          Sticky nav with scroll state
      ProjectCard.svelte         One project grid card
  routes/
    +layout.svelte        Mounts the header + imports app.css
    +page.svelte / +page.js         Homepage
    blog/
      +page.svelte / +page.js               Blog index
      [date]/[slug]/+page.svelte / +page.js  Individual post (URL: /blog/2026-05-05/my-post)
```

## Content model

Blog posts are plain Markdown files in `src/lib/content/blog/`, one per post, named
`YYYY-MM-DD-slug.md`, e.g.:

```markdown
---
title: My Post Title
date: 2026-05-05
slug: my-post-title
excerpt: One or two sentences shown in the index and the homepage teaser.
---

Markdown body goes here.
```

`src/lib/utils/posts.js` uses Vite's `import.meta.glob` to load every file in that folder
at build time, parses the frontmatter with a small hand-written parser (not a full YAML
parser — stick to flat `key: value` frontmatter), and renders the body with `marked`.

To add a post: drop a new `.md` file in `src/lib/content/blog/` following the same
frontmatter shape. It will automatically appear in the blog index and, if it's the most
recent by date, in the homepage teaser card.

Projects are a plain JS array in `src/lib/data/projects.js` — edit, add, or remove entries
directly; each maps to one `ProjectCard`.

## The animated background

`SignalBackground.svelte` is a from-scratch reimplementation (not a library) of a
multi-channel synthetic signal generator: each "channel" is a sum of four sine oscillators
(loosely modeled on EEG frequency bands — delta/theta/alpha/beta), Gaussian noise, and two
kinds of randomly-timed transient events (a sharp biphasic "spike" and a slower
spindle/K-complex-style burst), rendered to `<canvas>` every frame. It's intentionally
generic enough to read as either a vitals monitor or an industrial sensor array, which
fits a healthcare + manufacturing persona.

Tunable via props: `channels`, `height`, `bgColor`, `accentColor`.

## What's simplified vs. the original site

- No `/api/thumbnail`-style image resizing endpoint — project cards use a text
  placeholder in place of real screenshots/video, since there's no real media to show.
- No mobile-specific "tap to reveal" card behavior or collapsible hamburger menu — this
  clone's header is desktop-oriented; add a media query + toggle state to `SiteHeader.svelte`
  if you want that back.
- Frontmatter parsing is intentionally minimal (flat key/value only). Swap in `gray-matter`
  or `js-yaml` if you need lists/nested frontmatter.
