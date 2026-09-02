import { marked } from 'marked';

// Eagerly import every markdown file in src/lib/content/blog as a raw string.
// Vite resolves this glob at build time, so no filesystem access is needed at runtime.
const modules = import.meta.glob('/src/lib/content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
});

/**
 * Minimal frontmatter parser — good enough for simple `key: value` pairs.
 * Not a full YAML parser; if you need nested/list frontmatter, swap in
 * a real library (e.g. `js-yaml` or `gray-matter`).
 */
function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, body: raw };

  const [, frontmatterBlock, body] = match;
  const data = {};
  for (const line of frontmatterBlock.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    value = value.replace(/^["']|["']$/g, ''); // strip surrounding quotes
    data[key] = value;
  }
  return { data, body: body.trim() };
}

let cache = null;

/** All posts, sorted newest first. */
export function getAllPosts() {
  if (cache) return cache;
  cache = Object.values(modules)
    .map((raw) => {
      const { data, body } = parseFrontmatter(raw);
      return {
        title: data.title ?? 'Untitled',
        date: data.date ?? '',
        slug: data.slug ?? '',
        excerpt: data.excerpt ?? '',
        html: marked.parse(body)
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return cache;
}

export function getLatestPost() {
  return getAllPosts()[0] ?? null;
}

export function getPostByDateSlug(date, slug) {
  return getAllPosts().find((p) => p.date === date && p.slug === slug) ?? null;
}
