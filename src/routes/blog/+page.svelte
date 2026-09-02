<script>
  import { profile } from '$lib/data/profile.js';

  export let data;
</script>

<svelte:head>
  <title>Blog · {profile.name}</title>
</svelte:head>

<div class="blog-index">
  <p class="blog-index__back"><a href="/">← Back to projects</a></p>

  {#if data.posts.length === 0}
    <p class="blog-index__empty">No posts yet.</p>
  {:else}
    <ul class="blog-index__list">
      {#each data.posts as post (post.slug)}
        <li>
          <h2><a href={`/blog/${post.date}/${post.slug}`}>{post.title}</a></h2>
          <p class="blog-index__meta">{post.date}</p>
          <p class="blog-index__excerpt">{post.excerpt}</p>
        </li>
      {/each}
    </ul>
  {/if}

  <footer class="footer">
    <div class="footer__inner">
      <a class="link" href={profile.githubUrl} target="_blank" rel="external noreferrer">
        GitHub: <span class="link__mono"><strong>{profile.githubHandle}</strong></span>
      </a>
      <span class="footer__sep" aria-hidden="true">·</span>
      <a class="link" href="/">Back to projects</a>
    </div>
  </footer>
</div>

<style>
  /* Ported from the real site's blog-index component styles. */
  .blog-index {
    max-width: 64rem;
    margin: 0 auto;
    padding: clamp(1.25rem, 4vw, 3rem);
    padding-top: clamp(1.5rem, 4vw, 3rem);
    color: #f3f6ffe6;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }
  .blog-index__back a { color: #f3f6ffcc; }
  .blog-index__back a:hover { text-decoration: underline; text-underline-offset: .2em; }
  .blog-index__empty { margin-top: 1.4rem; color: #f3f6ffa8; }
  .blog-index__list { list-style: none; padding: 0; margin: 1.25rem 0 0; }
  .blog-index__list li { padding: 1rem 0; border-top: 1px solid rgba(222, 232, 255, .1); }
  .blog-index__list h2 { margin: 0; font-size: 1.05rem; font-weight: 560; }
  .blog-index__list a { color: #f3f6fff0; text-decoration: none; }
  .blog-index__list a:hover, .blog-index__list a:focus-visible { text-decoration: underline; text-underline-offset: .22em; }
  .blog-index__meta { margin: .2rem 0 0; font-size: .86rem; color: #f3f6ff94; }
  .blog-index__excerpt {
    margin: .55rem 0 0; color: #f3f6ffc7; line-height: 1.6;
    overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3;
  }
  .footer { margin-top: clamp(2.25rem, 5vw, 3.5rem); padding-top: 1.25rem; border-top: 1px solid rgba(222, 232, 255, .09); }
  .footer__inner { display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; justify-content: center; color: #f3f6ffad; font-size: .95rem; }
  .footer__sep { color: #f3f6ff59; }
  .link {
    color: #36f2c2eb; text-decoration: none; border-bottom: 1px solid rgba(54, 242, 194, .3);
    transition: border-color .14s ease, color .14s ease;
  }
  .link:hover { color: #36f2c2; border-color: #36f2c28c; }
  .link__mono { color: #f3f6ffe6; }
</style>
