<script>
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';

  let scrolled = false;

  function onScroll() {
    scrolled = window.scrollY > 40;
  }

  onMount(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });
  onDestroy(() => {
    if (typeof window !== 'undefined') window.removeEventListener('scroll', onScroll);
  });

  $: onBlog = $page.url.pathname.startsWith('/blog');
</script>

<header class="site-header" class:site-header--scrolled={scrolled}>
  <div class="site-header__inner" class:site-header__inner--with-title={onBlog}>
    {#if onBlog}
      <a class="site-header__title" href="/blog">daniel's blog</a>
    {/if}
    <nav class="site-nav" aria-label="Primary">
      <ul>
        <li><a href="/">Projects</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="https://github.com/dkessler-dev" target="_blank" rel="external noreferrer">GitHub</a></li>
        <li><a href="/#contact">Contact</a></li>
      </ul>
    </nav>
  </div>
</header>

<style>
  .site-header__inner--with-title { justify-content: space-between; }
</style>
