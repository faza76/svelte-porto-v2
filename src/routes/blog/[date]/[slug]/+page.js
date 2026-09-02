import { error } from '@sveltejs/kit';
import { getAllPosts } from '$lib/utils/posts.js';

export function load({ params }) {
  const posts = getAllPosts(); // sorted newest first
  const idx = posts.findIndex((p) => p.date === params.date && p.slug === params.slug);

  if (idx === -1) {
    throw error(404, 'Post not found');
  }

  return {
    post: posts[idx],
    // posts are newest-first, so the array index before this one is the newer post
    newerPost: posts[idx - 1] ?? null,
    olderPost: posts[idx + 1] ?? null
  };
}
