<script>
  import { profile } from '$lib/data/profile.js';

  export let data;

  let copied = false;
  let copyTimer;

  function copyLink() {
    if (typeof window === 'undefined') return;
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    copied = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (copied = false), 2000);
  }
</script>

<svelte:head>
  <title>{data.post.title} · {profile.name}</title>
</svelte:head>

<article class="blog-post">
  <p class="blog-post__back"><a href="/blog">← All posts</a></p>

  <header class="blog-post__header">
    <h1>{data.post.title}</h1>
    <p>{data.post.date}</p>
  </header>

  <div class="blog-post__content">
    {@html data.post.html}
  </div>

  <div class="share">
    <p class="share__label">Share this post</p>
    <div class="share__actions">
      <button class="share__button" on:click={copyLink}>
        <span class="share__text">{copied ? 'Copied!' : 'Copy link'}</span>
      </button>
      <a
        class="share__button"
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(data.post.title)}`}
        target="_blank"
        rel="noreferrer"
      >
        <span class="share__text">Share on X</span>
      </a>
    </div>
  </div>

  <nav class="post-nav">
    {#if data.olderPost}
      <a class="post-nav__link" href={`/blog/${data.olderPost.date}/${data.olderPost.slug}`}>
        ← {data.olderPost.title}
      </a>
    {:else}
      <span class="post-nav__placeholder"></span>
    {/if}

    {#if data.newerPost}
      <a class="post-nav__link post-nav__link--next" href={`/blog/${data.newerPost.date}/${data.newerPost.slug}`}>
        {data.newerPost.title} →
      </a>
    {:else}
      <span class="post-nav__placeholder"></span>
    {/if}
  </nav>

  <footer class="footer">
    <div class="footer__inner">
      <a class="link footer-link" href={profile.githubUrl} target="_blank" rel="external noreferrer">
        GitHub: <span class="link__mono">{profile.githubHandle}</span>
      </a>
      <span class="footer__sep" aria-hidden="true">·</span>
      <a class="link footer-link" href="/blog">All posts</a>
    </div>
  </footer>
</article>

<style>
  /* Ported from the real site's blog-post component styles. */
  .blog-post {
    max-width: 64rem;
    margin: 0 auto;
    padding: clamp(1.25rem, 4vw, 3rem);
    padding-top: clamp(1.5rem, 4vw, 3rem);
    color: #f3f6ffe6;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }
  .blog-post__back { margin: 0; }
  .blog-post__back a { color: #f3f6ffcc; text-decoration: none; }
  .blog-post__back a:hover, .blog-post__back a:focus-visible { text-decoration: underline; text-underline-offset: .2em; }

  .blog-post__header { margin-top: .9rem; padding-bottom: .85rem; border-bottom: 1px solid rgba(222, 232, 255, .12); }
  .blog-post__header h1 { margin: 0; font-size: clamp(1.4rem, 2.5vw, 2rem); line-height: 1.35; }
  .blog-post__header p { margin: .5rem 0 0; color: #f3f6ff99; font-size: .88rem; }

  .blog-post__content { margin-top: 1.25rem; line-height: 1.75; font-size: 1rem; color: #f3f6ffdb; }
  .blog-post__content :global(h1),
  .blog-post__content :global(h2),
  .blog-post__content :global(h3),
  .blog-post__content :global(h4),
  .blog-post__content :global(h5),
  .blog-post__content :global(h6) { margin: 1.55rem 0 .55rem; line-height: 1.35; font-weight: 700; color: #f3f6fff5; }
  .blog-post__content :global(h2) { margin-top: 2rem; padding-bottom: .35rem; font-size: clamp(1.25rem, 2vw, 1.5rem); border-bottom: 1px solid rgba(222, 232, 255, .12); }
  .blog-post__content :global(h3) { margin-top: 1.8rem; font-size: clamp(1.1rem, 1.6vw, 1.28rem); font-weight: 680; }
  .blog-post__content :global(p) { margin: .9rem 0; }
  .blog-post__content :global(a) { color: #36f2c2f0; text-decoration: underline; text-underline-offset: .2em; }
  .blog-post__content :global(ul), .blog-post__content :global(ol) { margin: .9rem 0; padding-left: 1.5rem; }
  .blog-post__content :global(ul) { list-style: disc; }
  .blog-post__content :global(ol) { list-style: decimal; }
  .blog-post__content :global(li) { margin: .25rem 0; }
  .blog-post__content :global(code) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    background: #000; padding: .08rem .35rem;
  }
  .blog-post__content :global(pre) { overflow-x: auto; padding: .85rem 1rem; background: #000; border: 1px solid rgba(222, 232, 255, .1); }
  .blog-post__content :global(pre code) { padding: 0; background: transparent; }
  .blog-post__content :global(blockquote) { margin: 1rem 0; padding-left: .9rem; border-left: 2px solid rgba(222, 232, 255, .2); color: #f3f6ffc7; }
  .blog-post__content :global(img) { display: block; max-width: min(100%, 42rem); height: auto; margin: 1.5rem auto; }

  .share { margin-top: clamp(1.5rem, 4vw, 2.5rem); padding-top: 1rem; border-top: 1px solid rgba(222, 232, 255, .12); }
  .share__label { margin: 0; font-size: .9rem; color: #f3f6ffb8; }
  .share__actions { margin-top: .6rem; display: flex; gap: .5rem; flex-wrap: wrap; }
  .share__button {
    display: inline-flex; align-items: center; gap: .4rem; padding: .4rem .65rem;
    border: 1px solid rgba(222, 232, 255, .22); background: #ffffff05; color: #f3f6ffe6;
    text-decoration: none; font: inherit; cursor: pointer;
  }
  .share__button:hover { border-color: #36f2c280; color: #f3f6ff; }
  .share__text { font-size: .85rem; line-height: 1; }

  .post-nav {
    margin-top: clamp(1.75rem, 4vw, 2.5rem); margin-bottom: .6rem;
    display: flex; justify-content: space-between; align-items: center; gap: .75rem; width: 100%;
  }
  .post-nav__link { display: inline-flex; align-items: center; color: #f3f6ffb8; text-decoration: none; font-size: .94rem; }
  .post-nav__link--next { justify-content: flex-end; margin-left: auto; }
  .post-nav__link:hover, .post-nav__link:focus-visible { text-decoration: underline; text-underline-offset: .2em; }
  .post-nav__placeholder { display: block; width: 1px; height: 1px; }

  .footer { margin-top: 0; padding-top: 1.25rem; border-top: 1px solid rgba(222, 232, 255, .09); }
  .footer__inner { display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; justify-content: center; color: #f3f6ffad; font-size: .95rem; }
  .footer__sep { color: #f3f6ff59; }
  .link {
    color: #36f2c2eb; text-decoration: none; border-bottom: 1px solid rgba(54, 242, 194, .3);
    transition: border-color .14s ease, color .14s ease;
  }
  .link:hover { color: #36f2c2; border-color: #36f2c28c; }
  .link__mono { color: #f3f6ffe6; }
</style>
