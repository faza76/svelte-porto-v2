import { getAllPosts } from '$lib/utils/posts.js';

export function load() {
  return {
    posts: getAllPosts()
  };
}
