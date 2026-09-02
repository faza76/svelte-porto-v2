export const projects = [
  {
    slug: 'medgateway',
    title: 'MedGateway',
    type: 'open-source',
    href: 'https://github.com/dkessler-dev/medgateway',
    subtitle: 'Universal healthcare data interoperability engine',
    description:
      'A real-time translation layer between HL7v2, FHIR, and the dozens of legacy hospital ' +
      'system dialects still in production. An event-driven pipeline normalizes inbound messages ' +
      'into a canonical clinical schema, so downstream systems only ever need to speak one format.',
    technologies: ['rust', 'postgres', 'nats jetstream', 'kubernetes'],
    links: [{ label: 'GitHub', href: 'https://github.com/dkessler-dev/medgateway', primary: true }]
  },
  {
    slug: 'factorypulse',
    title: 'FactoryPulse',
    type: 'open-source',
    href: 'https://github.com/dkessler-dev/factorypulse',
    subtitle: 'Real-time OEE & sensor telemetry for the shop floor',
    description:
      'A high-throughput ingestion and dashboarding platform for production-line telemetry. ' +
      'MQTT-based sensor feeds are aggregated into rolling OEE (availability, performance, quality) ' +
      'metrics with sub-second latency, so line supervisors see downtime as it happens, not in a ' +
      'shift report the next morning.',
    technologies: ['rust', 'timescaledb', 'mqtt', 'kubernetes', 'svelte'],
    links: [{ label: 'GitHub', href: 'https://github.com/dkessler-dev/factorypulse', primary: true }]
  },
  {
    slug: 'visionqc',
    title: 'VisionQC',
    type: 'open-source',
    href: 'https://github.com/dkessler-dev/visionqc',
    subtitle: 'Computer-vision defect detection for production lines',
    description:
      'A camera-based inline quality control system trained on real defect datasets from injection ' +
      'molding and PCB assembly lines. Runs inference at line speed on commodity edge hardware and ' +
      'flags defective units before they reach packaging.',
    technologies: ['python', 'pytorch', 'opencv', 'docker'],
    links: [{ label: 'GitHub', href: 'https://github.com/dkessler-dev/visionqc', primary: true }]
  },
  {
    slug: 'caresync',
    title: 'CareSync',
    type: 'closed-source',
    subtitle: 'Real-time clinical alerting across bedside devices',
    description:
      'An institution-scale monitoring and alerting platform that aggregates telemetry from bedside ' +
      'vitals monitors, infusion pumps, and ventilators, and routes clinically-significant events to ' +
      'the right care team over low-latency WebRTC channels — without adding another siloed app to ' +
      "the nursing station's workflow.",
    technologies: ['rust', 'webrtc', 'nats jetstream', 'postgres', 'kubernetes'],
    note: 'Closed-source project — media, details, and demo available on request.',
    links: []
  },
  {
    slug: 'predictivemaint',
    title: 'PredictiveMaint',
    type: 'closed-source',
    subtitle: 'Predicting equipment failure before it happens',
    description:
      'A predictive maintenance pipeline for industrial motors and pumps, trained on vibration and ' +
      'thermal sensor streams. Deployed across three manufacturing sites, it has caught bearing ' +
      'failures an average of 11 days before they would have caused unplanned downtime.',
    technologies: ['python', 'tensorflow', 'kafka', 'docker'],
    note: 'Closed-source project — media, details, and demo available on request.',
    links: []
  },
  {
    slug: 'traceline',
    title: 'TraceLine',
    type: 'open-source',
    href: 'https://github.com/dkessler-dev/traceline',
    subtitle: 'Cryptographically verifiable production lineage tracking',
    description:
      'A traceability engine for regulated manufacturing (medical devices, pharma packaging) where ' +
      'every processing step is tagged with a cryptographically verifiable audit token. Gives full, ' +
      'tamper-evident lineage from raw material lot to finished unit, ready for an FDA audit.',
    technologies: ['rust', 'postgres', 'nats jetstream', 'kubernetes'],
    links: [{ label: 'GitHub', href: 'https://github.com/dkessler-dev/traceline', primary: true }]
  },
  {
    slug: 'openline-collective',
    title: 'OpenLine Collective',
    type: 'community / ecosystem',
    href: 'https://openline.dev',
    subtitle: 'Open-source lab for healthcare & manufacturing software',
    description:
      'A research and engineering community I founded to explore infrastructure that healthcare and ' +
      'industrial software both need but nobody wants to build twice: interoperability, real-time ' +
      'telemetry, and regulatory-grade audit trails. Now a community of 150+ engineers coordinating ' +
      'projects on shared, enterprise-grade infrastructure.',
    technologies: ['python', 'go', 'rust', 'postgres', 'kubernetes'],
    links: [{ label: 'Visit Site', href: 'https://openline.dev', primary: true }]
  },
  {
    slug: 'simulacra',
    title: 'Simulacra',
    type: 'open-source',
    href: 'https://github.com/dkessler-dev/simulacra',
    subtitle: 'Digital twin simulator for wards and production cells',
    description:
      'A GPU-accelerated 2D digital twin engine for modeling patient flow through a hospital ward ' +
      'or parts flow through a manufacturing cell. Used to test staffing and layout changes against ' +
      'simulated demand before committing to them in the real world.',
    technologies: ['rust', 'vulkan'],
    links: [{ label: 'GitHub', href: 'https://github.com/dkessler-dev/simulacra', primary: true }]
  },
  {
    slug: 'scopedb',
    title: 'ScopeDB',
    type: 'open-source',
    href: 'https://github.com/dkessler-dev/scopedb',
    subtitle: 'Soft real-time engine for high-frequency signal data',
    description:
      'A specialized time-series and vector database engine built for high-frequency waveform data — ' +
      'vitals streams, vibration traces, sensor arrays — where query latency has to stay bounded even ' +
      'as ingest rates spike.',
    technologies: ['zig'],
    links: [{ label: 'View Source on GitHub', href: 'https://github.com/dkessler-dev/scopedb', primary: true }]
  },
  {
    slug: 'linkfloor',
    title: 'LinkFloor',
    type: 'open-source',
    href: 'https://github.com/dkessler-dev/linkfloor',
    subtitle: 'Multiplayer incident-response training, in the browser',
    description:
      'A browser-based, multiplayer emergency-response drill simulator used by hospital and plant ' +
      'safety teams to rehearse evacuations and incident response without pulling staff off the ' +
      'floor for a real drill. Rust and C game services with WebAssembly/WebRTC clients handle dozens ' +
      'of concurrent participants per session.',
    technologies: ['rust', 'c', 'wasm', 'webrtc', 'svelte', 'nats jetstream', 'postgres', 'kubernetes'],
    links: [{ label: 'View Source on GitHub', href: 'https://github.com/dkessler-dev/linkfloor', primary: true }]
  },
  {
    slug: 'streamworks',
    title: 'StreamWorks',
    type: 'open-source',
    href: 'https://github.com/dkessler-dev/streamworks',
    subtitle: 'Live video syndication for telehealth and remote floors',
    description:
      'Distributed, fault-tolerant live stream infrastructure: resilient RTMP ingest, H.264 ' +
      'transcoding, HLS packaging, and CDN delivery across a Rust + Kubernetes control plane. Powers ' +
      'both telehealth video visits and remote monitoring of factory floor camera feeds.',
    technologies: ['rust', 'ffmpeg', 'kubernetes'],
    links: [{ label: 'View Source on GitHub', href: 'https://github.com/dkessler-dev/streamworks', primary: true }]
  },
  {
    slug: 'remoterounds',
    title: 'RemoteRounds',
    type: 'open-source',
    href: 'https://github.com/dkessler-dev/remoterounds',
    subtitle: 'Remote clinical rounding, transcribed and structured',
    description:
      'A proof-of-concept platform integrating real-time transcription and medically-aware NLP to ' +
      'produce structured notes from remote nursing rounds. Demonstrates an end-to-end pipeline from ' +
      'live audio to structured documentation using Go, Flutter, and Kubernetes-backed services.',
    technologies: ['go', 'flutter', 'kubernetes'],
    links: [{ label: 'View Source on GitHub', href: 'https://github.com/dkessler-dev/remoterounds', primary: true }]
  }
];
