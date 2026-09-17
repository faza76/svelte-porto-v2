export const projects = [
  {
    slug: 'containerflow',
    title: 'ContainerFlow',
    type: 'open-source',
    href: 'https://github.com/faza76/containerflow',
    subtitle: 'Container logistics tracking SPA',
    description:
      'Track shipments end-to-end with live status and bulk CSV import. Role-based dashboards with ' +
      'real-time WebSocket status updates, CSV bulk import with validation, audit log, and shipment ' +
      'history timeline.',
    technologies: ['react', 'typescript', 'prisma', 'postgresql', 'docker', 'websocket'],
    links: [{ label: 'GitHub', href: 'https://github.com/faza76/containerflow', primary: true }]
  },
  {
    slug: 'svelte-porto-v2',
    title: 'svelte-porto-v2',
    type: 'open-source',
    href: 'https://github.com/faza76/svelte-porto-v2',
    subtitle: 'Markdown-driven portfolio with SvelteKit',
    description:
      'Component-driven portfolio site with a headless Markdown CMS pipeline. Content is compiled from ' +
      '.md files at build time via MDsvex, with a component-driven design system and automated CI deploy to Vercel.',
    technologies: ['sveltekit', 'mdsvex', 'typescript', 'tailwind', 'vercel'],
    links: [{ label: 'GitHub', href: 'https://github.com/faza76/svelte-porto-v2', primary: true }]
  },
  {
    slug: 'simple-portfolio-svelte',
    title: 'simple-portfolio-svelte',
    type: 'open-source',
    href: 'https://github.com/faza76/simple-portfolio-svelte',
    subtitle: 'Minimal SSG portfolio — zero JS by default',
    description:
      'Fast, zero-JS-by-default portfolio built with SvelteKit SSG. Ships as static HTML to GitHub Pages or ' +
      'Vercel. Achieves Lighthouse 98+ and serves as the template for the v2 portfolio.',
    technologies: ['sveltekit', 'typescript', 'tailwind'],
    links: [{ label: 'GitHub', href: 'https://github.com/faza76/simple-portfolio-svelte', primary: true }]
  },
  {
    slug: 'notion-dashboard-webhook',
    title: 'NotionDashboard-WebHook',
    type: 'open-source',
    href: 'https://github.com/faza76/NotionDashboard-WebHook',
    subtitle: 'C# Webhook bridge for Notion databases',
    description:
      'Real-time Notion database webhook handler with event routing and signature-verified ingestion. ' +
      'ASP.NET Core receiver dispatches Notion database change events to downstream consumers.',
    technologies: ['csharp', 'dotnet', 'aspnetcore', 'docker'],
    links: [{ label: 'GitHub', href: 'https://github.com/faza76/NotionDashboard-WebHook', primary: true }]
  },
  {
    slug: 'starter-fullstack-angular-dotnet',
    title: 'starter-fullstack-angular-dotnet',
    type: 'open-source',
    href: 'https://github.com/faza76/starter-fullstack-angular-dotnet',
    subtitle: '.NET 8 clean-architecture starter kit',
    description:
      'Production-ready Angular + .NET 8 API starter with CI/CD. Clean architecture with Domain, Application, ' +
      'Infrastructure, and API layers, typed API contracts, and automated CI/CD pipelines.',
    technologies: ['angular', 'dotnet', 'csharp', 'typescript', 'docker', 'github-actions'],
    links: [{ label: 'GitHub', href: 'https://github.com/faza76/starter-fullstack-angular-dotnet', primary: true }]
  },
  {
    slug: 'halation-web-gsap-nextjs',
    title: 'halation-web-gsap-nextjs',
    type: 'open-source',
    href: 'https://github.com/faza76/halation-web-gsap-nextjs',
    subtitle: 'Cinematic scroll-driven GSAP experience',
    description:
      'A scroll-driven cinematic web experience built with GSAP ScrollTrigger and Next.js App Router. ' +
      'Demonstrates timeline-based animation sequences triggered by scroll position.',
    technologies: ['nextjs', 'gsap', 'typescript', 'tailwind'],
    links: [{ label: 'GitHub', href: 'https://github.com/faza76/halation-web-gsap-nextjs', primary: true }]
  },
  {
    slug: 'natasae-studio',
    title: 'Natasae Studio Profile',
    type: 'client',
    href: 'https://github.com/faza76/-Company-Profile-Natasae-Studio',
    subtitle: 'Architecture firm company profile',
    description:
      'A proof-of-concept platform integrating real-time transcription and medically-aware NLP to ' +
      'produce structured notes from remote nursing rounds. Demonstrates an end-to-end pipeline from ' +
      'live audio to structured documentation using Go, Flutter, and Kubernetes-backed services.',
    technologies: ['go', 'flutter', 'kubernetes'],
    links: [{ label: 'View Source on GitHub', href: 'https://github.com/dkessler-dev/remoterounds', primary: true }]
  },
  {
    slug: 'containerflow',
    title: 'ContainerFlow',
    type: 'open-source',
    href: 'https://github.com/faza76/ContainerFlow',
    subtitle: 'Real-time container flow optimization for port and yard operations',
    description:
      'A real-time container flow optimization engine for port terminals and inland container yards. ' +
      'Models container movement as a flow network with capacity constraints, tracks inventory across ' +
      'multiple zones, and generates dispatch recommendations for quay and yard cranes to minimize ' +
      'rehandles and reduce dwell time. Built on a CP-SAT core with a Rust + Svelte stack for low-latency ' +
      'state synchronization.',
    technologies: ['rust', 'svelte', 'cp-sat', 'postgres', 'nats jetstream', 'docker'],
    links: [{ label: 'GitHub', href: 'https://github.com/faza76/ContainerFlow', primary: true }]
  }
];