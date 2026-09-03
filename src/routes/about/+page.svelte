<script>
  import { profile } from '$lib/data/profile.js';
</script>

<svelte:head>
  <title>About // {profile.name}</title>
</svelte:head>

<main class="page">
  <div class="shell">
    <header class="header">
      <div class="header__content">
        <p class="header__tagline">{profile.tagline}</p>
        <h1>About {profile.name}</h1>
        <p class="header__description">{profile.description}</p>
        <p class="header__credentials">{profile.credentials}</p>
        <p class="header__teaser">{profile.teaser}</p>
      </div>
    </header>
  </div>
</main>

<style>
  .page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  .shell {
    max-width: 640px;
    width: 100%;
  }
  .header {
    text-align: left;
  }
  .header__content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    color: #e0e0e0;
  }
  .header__tagline {
    font-size: 0.875rem;
    color: #888;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .header__description {
    font-size: 1.125rem;
    line-height: 1.6;
    color: #ccc;
    margin: 0;
  }
  .header__credentials {
    font-size: 0.875rem;
    color: #666;
    margin: 0;
  }
  .header__teaser {
    font-size: 0.9375rem;
    color: #888;
    margin: 0;
  }
</style>