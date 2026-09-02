<script>
  import { onMount, onDestroy } from 'svelte';

  // A multi-channel synthetic signal generator, styled to read equally well
  // as a bedside vitals monitor or an array of factory-floor sensors.
  // Ported from the original per-channel delta/theta/alpha/beta oscillator
  // model, kept general-purpose (it's no longer EEG-specific).

  export let channels = 10;
  export let height = 750;
  export let bgColor = '#0a0e12';
  export let accentColor = '#36f2c2';

  let canvasEl;
  let containerEl;
  let ctx;
  let rafId;

  const SAMPLE_RATE = 1000;
  const GRID_COLS = 8;
  const HISTORY_LEN = SAMPLE_RATE * GRID_COLS;
  const FRAME_AVG_WINDOW = 5;
  const NOISE_POOL_SIZE = 8192;

  let simTime = 0;
  let slowPhase = 0;
  let writeIndex = 0;

  let noisePool;
  let noiseCursor = 0;

  let frameDeltas;
  let frameIndex = 0;
  let framesSeen = 0;
  let lastFrameTime = 0;

  let channelParams;
  let history;
  let channelColors;

  let spikes = [];
  let spindles = [];
  let gradientCache = null;
  let gradientCacheHeight = 0;

  let displayWidth = 0;
  let displayHeight = 0;

  function rand(lo, hi) {
    return lo + Math.random() * (hi - lo);
  }

  function buildChannelParams() {
    return Array.from({ length: channels }, () => ({
      deltaFreq: rand(1, 4), deltaPhase: Math.random() * Math.PI * 2, deltaAmp: rand(0.3, 0.5),
      thetaFreq: rand(4, 7), thetaPhase: Math.random() * Math.PI * 2, thetaAmp: rand(0.15, 0.25),
      alphaFreq: rand(8, 12), alphaPhase: Math.random() * Math.PI * 2, alphaAmp: rand(0.2, 0.35),
      betaFreq: rand(13, 25), betaPhase: Math.random() * Math.PI * 2, betaAmp: rand(0.08, 0.15),
      lastValue: 0
    }));
  }

  function buildChannelColors() {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(accentColor);
    const base = m
      ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
      : { r: 54, g: 242, b: 194 };
    return Array.from({ length: channels }, (_, i) => {
      const shade = 1 - (i / channels) * 0.25;
      return `rgba(${Math.floor(base.r * shade)}, ${Math.floor(base.g * shade)}, ${Math.floor(base.b * shade)}, 0.6)`;
    });
  }

  function gaussian() {
    let u = noisePool[noiseCursor];
    let v = noisePool[(noiseCursor + 1) % NOISE_POOL_SIZE];
    noiseCursor = (noiseCursor + 2) % NOISE_POOL_SIZE;
    u = Math.max(u, 1e-4);
    v = Math.max(v, 1e-4);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function makeSpike() {
    const count = Math.floor(rand(2, Math.min(5, channels) + 1));
    const pool = Array.from({ length: channels }, (_, i) => i);
    const chans = [];
    for (let i = 0; i < count; i++) chans.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    return { time: simTime + rand(3, 7), duration: rand(0.08, 0.2), amplitude: rand(1.5, 3), decay: rand(15, 25), channels: chans };
  }
  function spikeValue(t, ev) {
    const i = t - ev.time;
    if (i < -0.05 || i > ev.duration + 0.1) return 0;
    const peakT = ev.time + ev.duration * 0.2;
    const peak = Math.exp(-Math.pow((t - peakT) * ev.decay, 2));
    const troughT = peakT + ev.duration * 0.3;
    const trough = -0.3 * Math.exp(-Math.pow((t - troughT) * ev.decay * 0.7, 2));
    return ev.amplitude * (peak + trough);
  }

  function makeSpindle() {
    const count = Math.floor(rand(Math.ceil(channels * 0.6), channels + 1));
    const preferred = [0, 1, 6, 7].filter((c) => c < channels);
    const pool = Array.from({ length: channels }, (_, i) => i);
    const chans = [];
    for (const c of preferred) {
      if (chans.length < count) { chans.push(c); pool.splice(pool.indexOf(c), 1); }
    }
    while (chans.length < count && pool.length) chans.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    return { time: simTime + rand(3, 5), amplitude: rand(2.5, 4), channels: chans, sharpWaveFreq: rand(12, 14), slowWaveFreq: rand(0.5, 2) };
  }
  function spindleValue(t, ev) {
    const n = t - ev.time;
    if (n < -0.05 || n > 1.0) return 0;
    const dip = -Math.exp(-Math.pow((n - 0.075) / 0.04, 2));
    const bump = 0.7 * Math.exp(-Math.pow((n - 0.35) / 0.15, 2));
    let burst = 0;
    if (n >= 0.15 && n <= 0.55) {
      burst = 0.35 * Math.exp(-Math.pow((n - 0.35) / 0.2, 2)) * Math.sin(2 * Math.PI * ev.sharpWaveFreq * n);
    }
    const lateDip = -0.15 * Math.exp(-Math.pow((n - 0.65) / 0.08, 2));
    return ev.amplitude * (dip + bump + burst + lateDip);
  }

  function channelValue(ch, t) {
    const p = channelParams[ch];
    const drift = 0.15 * Math.sin(slowPhase);
    const delta = p.deltaAmp * Math.sin(2 * Math.PI * p.deltaFreq * t + p.deltaPhase);
    const theta = p.thetaAmp * Math.sin(2 * Math.PI * p.thetaFreq * t + p.thetaPhase);
    const alpha = p.alphaAmp * Math.sin(2 * Math.PI * p.alphaFreq * t + p.alphaPhase);
    const beta = p.betaAmp * Math.sin(2 * Math.PI * p.betaFreq * t + p.betaPhase);
    const noise = 0.05 * gaussian();

    let raw = drift + delta + theta + alpha + beta + noise;
    for (const ev of spikes) if (ev.channels.includes(ch)) raw += spikeValue(t, ev);
    for (const ev of spindles) if (ev.channels.includes(ch)) raw += spindleValue(t, ev);

    const smoothed = 0.85 * p.lastValue + 0.15 * raw;
    p.lastValue = smoothed;
    return smoothed;
  }

  function prefillHistory() {
    for (let i = 0; i < HISTORY_LEN; i++) {
      simTime += 1 / SAMPLE_RATE;
      slowPhase += (2 * Math.PI * 2.5) / SAMPLE_RATE;
      for (let ch = 0; ch < channels; ch++) history[ch][i] = channelValue(ch, simTime);
    }
    writeIndex = 0;
  }

  function advance(dt) {
    const simSeconds = dt * 0.5;
    const steps = Math.floor(simSeconds * SAMPLE_RATE);
    for (let s = 0; s < steps; s++) {
      simTime += 1 / SAMPLE_RATE;
      slowPhase += (2 * Math.PI * 2.5) / SAMPLE_RATE;
      for (let ch = 0; ch < channels; ch++) history[ch][writeIndex] = channelValue(ch, simTime);
      writeIndex = (writeIndex + 1) % HISTORY_LEN;
    }
    spikes = spikes.filter((e) => e.time + e.duration + 0.2 > simTime);
    while (spikes.filter((e) => e.time > simTime).length < 2) spikes.push(makeSpike());
    spindles = spindles.filter((e) => e.time + 1 > simTime);
    while (spindles.filter((e) => e.time > simTime).length < 2) spindles.push(makeSpindle());
  }

  function render() {
    if (!ctx || !displayWidth || !displayHeight) return;
    const w = displayWidth, h = displayHeight;
    ctx.clearRect(0, 0, w, h);

    const rowH = h / channels;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 1; i < channels; i++) { const y = i * rowH; ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    for (let i = 1; i < GRID_COLS; i++) { const x = (w / GRID_COLS) * i; ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    ctx.stroke();

    const samplesPerPixel = HISTORY_LEN / w;
    ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let ch = 0; ch < channels; ch++) {
      const rowCenter = (ch + 0.5) * rowH;
      const amp = (rowH - rowH * 0.15) / 2;
      const buf = history[ch];
      ctx.strokeStyle = channelColors[ch];
      ctx.beginPath();
      const startIdx = writeIndex % HISTORY_LEN;
      ctx.moveTo(0, rowCenter - (buf[startIdx] / 1.5) * amp);
      for (let x = 1; x < w; x++) {
        const idx = (writeIndex + Math.floor(x * samplesPerPixel)) % HISTORY_LEN;
        ctx.lineTo(x, rowCenter - (buf[idx] / 1.5) * amp);
      }
      ctx.stroke();
    }

    const fadeH = h * 0.3;
    if (!gradientCache || gradientCacheHeight !== h) {
      gradientCache = ctx.createLinearGradient(0, h - fadeH, 0, h);
      gradientCache.addColorStop(0, 'rgba(0,0,0,0)');
      gradientCache.addColorStop(0.5, 'rgba(0,0,0,0.7)');
      gradientCache.addColorStop(0.8, 'rgba(0,0,0,0.95)');
      gradientCache.addColorStop(1, 'rgba(0,0,0,1)');
      gradientCacheHeight = h;
    }
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = gradientCache;
    ctx.fillRect(0, h - fadeH, w, fadeH);
    ctx.globalCompositeOperation = 'source-over';

    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.6;
    ctx.fillRect(0, 0, w, 2);
    ctx.globalAlpha = 1;
  }

  function tick(now) {
    if (lastFrameTime === 0) { lastFrameTime = now; rafId = requestAnimationFrame(tick); return; }
    const rawDelta = now - lastFrameTime;
    lastFrameTime = now;
    if (rawDelta >= 1) {
      frameDeltas[frameIndex] = rawDelta;
      frameIndex = (frameIndex + 1) % FRAME_AVG_WINDOW;
      if (framesSeen < FRAME_AVG_WINDOW) framesSeen++;
    }
    let sum = 0;
    for (let i = 0; i < framesSeen; i++) sum += frameDeltas[i];
    const dt = Math.min((sum / (framesSeen || 1)) / 1000, 0.1);

    advance(dt);
    render();
    rafId = requestAnimationFrame(tick);
  }

  function resize() {
    if (!containerEl || !canvasEl) return;
    const rect = containerEl.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    displayWidth = rect.width;
    displayHeight = rect.height || height;
    canvasEl.width = displayWidth * dpr;
    canvasEl.height = displayHeight * dpr;
    canvasEl.style.width = displayWidth + 'px';
    canvasEl.style.height = displayHeight + 'px';
    gradientCache = null;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  onMount(() => {
    ctx = canvasEl.getContext('2d', { alpha: true });
    noisePool = Float32Array.from({ length: NOISE_POOL_SIZE }, () => Math.random());
    frameDeltas = new Float64Array(FRAME_AVG_WINDOW);
    channelParams = buildChannelParams();
    channelColors = buildChannelColors();
    history = Array.from({ length: channels }, () => new Float32Array(HISTORY_LEN));

    prefillHistory();
    spikes.push(makeSpike(), makeSpike());
    spindles.push(makeSpindle(), makeSpindle());

    resize();
    window.addEventListener('resize', resize);
    rafId = requestAnimationFrame(tick);
  });

  onDestroy(() => {
    if (rafId) cancelAnimationFrame(rafId);
    if (typeof window !== 'undefined') window.removeEventListener('resize', resize);
  });
</script>

<div class="signal-container" bind:this={containerEl} style="--bg-color:{bgColor}; --accent-color:{accentColor}; height:{height}px;">
  <canvas bind:this={canvasEl} aria-hidden="true"></canvas>
</div>

<style>
  .signal-container { width: 100%; height: 100%; background: transparent; overflow: hidden; position: relative; }
  canvas { display: block; width: 100%; height: 100%; will-change: contents; transform: translateZ(0); }
</style>
