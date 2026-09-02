import { getLatestPost } from '$lib/utils/posts.js';

export function load() {
  return {
    latestPost: getLatestPost()
  };
}
