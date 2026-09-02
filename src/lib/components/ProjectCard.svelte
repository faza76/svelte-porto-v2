<script>
  export let project;
</script>

<article class="card" id={project.slug} role="listitem" aria-labelledby={`${project.slug}-title`}>
  <div class="termbar">
    <h3 class="termbar__title" id={`${project.slug}-title`}>
      {#if project.href}
        <a href={project.href} target="_blank" rel="external noreferrer">{project.title}</a>
      {:else}
        {project.title}
      {/if}
    </h3>
    {#if project.href}
      <a
        class="badge badge--link"
        data-type={project.type}
        href={project.href}
        target="_blank"
        rel="external noreferrer"
        aria-label={`View ${project.title} source`}
      >
        {project.type.replace(/-/g, ' ')}
      </a>
    {:else}
      <span class="badge" data-type={project.type}>{project.type.replace(/-/g, ' ')}</span>
    {/if}
  </div>

  <div class="media" aria-label="Project media">
    <div class="media__placeholder" role="img" aria-label={`${project.title} media placeholder`}>
      <span class="media__placeholderText">{project.subtitle}</span>
    </div>
  </div>

  <div class="content">
    {#if project.subtitle}
      <p class="card__subtitle">{project.subtitle}</p>
    {/if}
    <p class="card__desc">{project.description}</p>

    {#if project.technologies?.length}
      <div class="tech-badges" aria-label="Technologies used">
        {#each project.technologies as tech (tech)}
          <span class="tech-badge" data-tech={tech}>{tech}</span>
        {/each}
      </div>
    {/if}

    {#if project.links?.length}
      <div class="links" aria-label="Project links">
        {#each project.links as link (link.href)}
          <a class={`btn ${link.primary ? 'btn--primary' : 'btn--ghost'}`} href={link.href} target="_blank" rel="external noreferrer">
            {link.label}
          </a>
        {/each}
      </div>
    {:else if project.note}
      <p class="card__note">{project.note}</p>
    {/if}
  </div>
</article>
