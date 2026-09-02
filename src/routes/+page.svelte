<script>
  import SignalBackground from '$lib/components/SignalBackground.svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import { profile } from '$lib/data/profile.js';
  import { projects } from '$lib/data/projects.js';

  export let data;
  $: latestPost = data.latestPost;

  let toastVisible = false;
  let toastTimer;

  function copyEmail() {
    navigator.clipboard?.writeText(profile.emailAddress).catch(() => {});
    toastVisible = true;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toastVisible = false), 2000);
  }

  function backToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<svelte:head>
  <title>{profile.siteTitle}</title>
</svelte:head>

<a class="skip" href="#projects">Skip to projects</a>

<main class="page" id="top">
  <div class="signal-background">
    <SignalBackground channels={10} height={750} bgColor="#0a0e12" accentColor="#36f2c2" />
  </div>

  <div class="shell">
    <header class="header" aria-label="Site header">
      <div class="header__content">
        <p class="header__tagline">{profile.tagline}</p>
        <p class="header__description">{profile.description}</p>
        <p class="header__teaser">{profile.teaser}</p>
        <p class="header__meta">
          <a class="link" href={profile.githubUrl} target="_blank" rel="external noreferrer">
            github: <span class="link__mono"><strong class="highlight">{profile.githubHandle}</strong></span>
          </a><br />
          <button class="link email-btn" on:click={copyEmail}>
            email: <span class="link__mono"><strong class="highlight">{profile.emailDisplay}</strong></span>
          </button>
        </p>
      </div>
    </header>

    <section class="section" id="projects" aria-labelledby="projects-title">
      <div class="grid" role="list">
        {#if latestPost}
          <a
            href={`/blog/${latestPost.date}/${latestPost.slug}`}
            class="card blog-teaser"
            aria-label={`Read latest blog post: ${latestPost.title}`}
          >
            <p class="blog-teaser__eyebrow">Latest from the blog</p>
            <h3 class="blog-teaser__title">
              <span>{latestPost.title}</span>
              <span class="blog-teaser__date">· {latestPost.date}</span>
            </h3>
            <p class="blog-teaser__excerpt">{latestPost.excerpt}</p>
            <span class="blog-teaser__cta">Read post →</span>
          </a>
        {/if}

        {#each projects as project (project.slug)}
          <ProjectCard {project} />
        {/each}
      </div>
    </section>

    <footer class="footer" id="contact">
      <div class="footer__inner">
        <span>{profile.credentials}</span>
        <span class="footer__sep" aria-hidden="true">·</span>
        <a class="link" href={profile.githubUrl} target="_blank" rel="external noreferrer">
          GitHub: <span class="link__mono"><strong>{profile.githubHandle}</strong></span>
        </a>
        <span class="footer__sep" aria-hidden="true">·</span>
        <button class="link email-btn" on:click={copyEmail}>
          email: <span class="link__mono"><strong>{profile.emailDisplay}</strong></span>
        </button>
        <span class="footer__sep" aria-hidden="true">·</span>
        <button class="link email-btn" on:click={backToTop}>Back to top</button>
      </div>
    </footer>
  </div>
</main>

{#if toastVisible}
  <div class="toast">Copied to clipboard!</div>
{/if}
