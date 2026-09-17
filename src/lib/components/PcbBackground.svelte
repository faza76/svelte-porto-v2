<script>
  import { onMount, onDestroy } from 'svelte';
  // Procedural PCB / circuit-board background.
  // Generates a pseudo-random layout of IC chips, orthogonal traces, and
  // animated signal pulses — for a tech/engineering visual.

  export let channels = 10;
  export let height = 750;
  export let bgColor = '#0a0e12';
  export let accentColor = '#36f2c2';

  let canvasEl;
  let containerEl;
  let ctx;
  let rafId;

  // --- noise pool (same technique as SignalBackground) ---
  const NOISE_POOL_SIZE = 8192;
  let noisePool;
  let noiseCursor = 0;

  // --- frame smoothing ---
  const FRAME_AVG_WINDOW = 5;
  let frameDeltas;
  let frameIndex = 0;
  let framesSeen = 0;
  let lastFrameTime = 0;

  // --- layout geometry (rebuilt on resize) ---
  let chips = [];
  let traces = [];
  let gridLines = [];
  let standaloneVias = [];

  // --- animated signals ---
  let signals = [];

  // --- display dimensions ---
  let displayWidth = 0;
  let displayHeight = 0;

  // --- accent color RGB ---
  let accentRgb = { r: 54, g: 242, b: 194 };

  // ------------------------------------------------------------------
  // helpers
  // ------------------------------------------------------------------
  function rand(lo, hi) { return lo + Math.random() * (hi - lo); }

  function randInt(lo, hi) { return Math.floor(rand(lo, hi + 1)); }

  function parseHex(color) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    return m
      ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
      : { r: 54, g: 242, b: 194 };
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // ------------------------------------------------------------------
  // PCB layout generation
  // ------------------------------------------------------------------
  function generateLayout(w, h) {
    const margin = 20;
    const innerW = w - margin * 2;
    const innerH = h - margin * 2;

    // Chip count scales with board area — fill the space
    const chipCount = Math.min(Math.max(Math.floor(Math.sqrt(w * h) / 35), 8), 40);

    // 1. Place chips on a grid with jitter
    const cols = Math.ceil(Math.sqrt(chipCount * (innerW / innerH)));
    const rows = Math.ceil(chipCount / cols);
    const cellW = innerW / cols;
    const cellH = innerH / rows;

    const newChips = [];
    let idx = 0;
    for (let r = 0; r < rows && idx < chipCount; r++) {
      for (let c = 0; c < cols && idx < chipCount; c++, idx++) {
        const isBig = idx % 5 === 0;
        const isMedium = idx % 3 === 0;
        const chipW = isBig ? rand(60, 95) : isMedium ? rand(45, 60) : rand(28, 42);
        const chipH = isBig ? rand(50, 75) : isMedium ? rand(35, 50) : rand(20, 32);
        const cx = margin + c * cellW + cellW * 0.5 + rand(-cellW * 0.25, cellW * 0.25);
        const cy = margin + r * cellH + cellH * 0.5 + rand(-cellH * 0.25, cellH * 0.25);
        const x = clamp(cx - chipW / 2, margin, w - margin - chipW);
        const y = clamp(cy - chipH / 2, margin, h - margin - chipH);

        const pinCount = isBig ? randInt(8, 12) : randInt(3, 6);
        const leftPins = [];
        const rightPins = [];
        for (let p = 0; p < pinCount; p++) {
          const py = y + (chipH / (pinCount + 1)) * (p + 1);
          leftPins.push({ x: x, y: py });
          rightPins.push({ x: x + chipW, y: py });
        }

        newChips.push({
          x, y, w: chipW, h: chipH,
          leftPins, rightPins,
          label: isBig ? ['CPU', 'MCU', 'NPU', 'FPGA', 'DSP', 'AI'][randInt(0, 5)] : `U${idx + 1}`
        });
      }
    }

    // 2. Collect all pins
    const allPins = [];
    for (const chip of newChips) {
      for (const pin of chip.leftPins) allPins.push({ ...pin, chip });
      for (const pin of chip.rightPins) allPins.push({ ...pin, chip });
    }

    // 3. Route orthogonal traces between random pin pairs
    const traceCount = Math.min(Math.floor(allPins.length * 0.8), 120);
    const usedPins = new Set();
    const newTraces = [];
    for (let t = 0; t < traceCount; t++) {
      let aIdx, bIdx;
      const available = [];
      for (let i = 0; i < allPins.length; i++) {
        if (!usedPins.has(i)) available.push(i);
      }
      if (available.length >= 2) {
        aIdx = available[randInt(0, available.length - 1)];
        usedPins.add(aIdx);
        const remaining = available.filter(i => i !== aIdx);
        bIdx = remaining[randInt(0, remaining.length - 1)];
        usedPins.add(bIdx);
      } else {
        aIdx = randInt(0, allPins.length - 1);
        bIdx = randInt(0, allPins.length - 1);
        if (aIdx === bIdx) bIdx = (bIdx + 1) % allPins.length;
      }

      const a = allPins[aIdx];
      const b = allPins[bIdx];

      // orthogonal path with 2-3 bend points
      const useThreeBends = Math.random() < 0.3;
      if (useThreeBends && Math.abs(a.x - b.x) > 80) {
        const mid1 = a.x + (b.x - a.x) * 0.3 + rand(-15, 15);
        const mid2 = a.x + (b.x - a.x) * 0.7 + rand(-15, 15);
        const midY = (a.y + b.y) / 2 + rand(-30, 30);
        newTraces.push({
          waypoints: [
            { x: Math.round(a.x), y: Math.round(a.y) },
            { x: Math.round(mid1), y: Math.round(a.y) },
            { x: Math.round(mid1), y: Math.round(midY) },
            { x: Math.round(mid2), y: Math.round(midY) },
            { x: Math.round(mid2), y: Math.round(b.y) },
            { x: Math.round(b.x), y: Math.round(b.y) }
          ]
        });
      } else {
        const midX = (a.x + b.x) / 2 + rand(-25, 25);
        newTraces.push({
          waypoints: [
            { x: Math.round(a.x), y: Math.round(a.y) },
            { x: Math.round(midX), y: Math.round(a.y) },
            { x: Math.round(midX), y: Math.round(b.y) },
            { x: Math.round(b.x), y: Math.round(b.y) }
          ]
        });
      }
    }

    // 4. Decorative traces — not connected to any pin, just fill
    const decorTraceCount = Math.floor(Math.sqrt(w * h) / 80);
    for (let i = 0; i < decorTraceCount; i++) {
      const x1 = rand(margin, w - margin);
      const y1 = rand(margin, h - margin);
      const x2 = rand(margin, w - margin);
      const y2 = rand(margin, h - margin);
      const midX = (x1 + x2) / 2 + rand(-40, 40);
      newTraces.push({
        waypoints: [
          { x: Math.round(x1), y: Math.round(y1) },
          { x: Math.round(midX), y: Math.round(y1) },
          { x: Math.round(midX), y: Math.round(y2) },
          { x: Math.round(x2), y: Math.round(y2) }
        ]
      });
    }

    // 5. Standalone vias scattered around
    const viaCount = Math.floor(Math.sqrt(w * h) / 18);
    const newVias = [];
    for (let i = 0; i < viaCount; i++) {
      newVias.push({
        x: rand(margin + 5, w - margin - 5),
        y: rand(margin + 5, h - margin - 5),
        r: rand(2, 4)
      });
    }

    // 6. Subtle grid lines
    const newGridLines = [];
    const gridSpacing = 50;
    const gridOffset = margin - (margin % gridSpacing);
    for (let x = gridOffset; x < w; x += gridSpacing) {
      newGridLines.push({ x1: x, y1: 0, x2: x, y2: h });
    }
    for (let y = gridOffset; y < h; y += gridSpacing) {
      newGridLines.push({ x1: 0, y1: y, x2: w, y2: y });
    }

    return { chips: newChips, traces: newTraces, gridLines: newGridLines, standaloneVias: newVias };
  }

  // ------------------------------------------------------------------
  // signal spawning
  // ------------------------------------------------------------------
  function spawnSignal() {
    if (traces.length === 0) return;
    const trace = traces[randInt(0, traces.length - 1)];
    const totalLen = traceLength(trace.waypoints);
    signals.push({
      trace,
      progress: 0,
      speed: rand(0.002, 0.006),
      waypointIdx: 0,
      segProgress: 0,
      totalLen
    });
  }

  function traceLength(wp) {
    let len = 0;
    for (let i = 1; i < wp.length; i++) {
      len += Math.hypot(wp[i].x - wp[i - 1].x, wp[i].y - wp[i - 1].y);
    }
    return len;
  }

  function getPosition(wp, progress) {
    let total = 0;
    const segLens = [];
    for (let i = 1; i < wp.length; i++) {
      const seg = Math.hypot(wp[i].x - wp[i - 1].x, wp[i].y - wp[i - 1].y);
      segLens.push(seg);
      total += seg;
    }
    const target = progress * total;
    let acc = 0;
    for (let i = 0; i < segLens.length; i++) {
      if (acc + segLens[i] >= target) {
        const t = (target - acc) / segLens[i];
        return {
          x: wp[i].x + (wp[i + 1].x - wp[i].x) * t,
          y: wp[i].y + (wp[i + 1].y - wp[i].y) * t,
          angle: Math.atan2(wp[i + 1].y - wp[i].y, wp[i + 1].x - wp[i].x)
        };
      }
      acc += segLens[i];
    }
    return { x: wp[wp.length - 1].x, y: wp[wp.length - 1].y, angle: 0 };
  }

  // ------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------
  function render() {
    if (!ctx || !displayWidth || !displayHeight) return;
    const w = displayWidth, h = displayHeight;
    const { r, g, b } = accentRgb;

    ctx.clearRect(0, 0, w, h);

    // board bg
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    // grid
    ctx.strokeStyle = `rgba(${r},${g},${b},0.04)`;
    ctx.lineWidth = 0.5;
    for (const gl of gridLines) {
      ctx.beginPath();
      ctx.moveTo(gl.x1, gl.y1);
      ctx.lineTo(gl.x2, gl.y2);
      ctx.stroke();
    }

    // traces (dim, constant)
    ctx.strokeStyle = `rgba(${r},${g},${b},0.15)`;
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const tr of traces) {
      const wp = tr.waypoints;
      ctx.beginPath();
      ctx.moveTo(wp[0].x, wp[0].y);
      for (let i = 1; i < wp.length; i++) ctx.lineTo(wp[i].x, wp[i].y);
      ctx.stroke();
    }

    // vias
    for (const tr of traces) {
      for (const wp of tr.waypoints) {
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},0.25)`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = bgColor;
        ctx.fill();
      }
    }

    // standalone vias
    for (const via of standaloneVias) {
      ctx.beginPath();
      ctx.arc(via.x, via.y, via.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},0.2)`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(via.x, via.y, via.r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = bgColor;
      ctx.fill();
    }

    // chips
    for (const chip of chips) {
      // body
      ctx.fillStyle = '#14181c';
      ctx.fillRect(chip.x, chip.y, chip.w, chip.h);
      ctx.strokeStyle = `rgba(${r},${g},${b},0.35)`;
      ctx.lineWidth = 1;
      ctx.strokeRect(chip.x, chip.y, chip.w, chip.h);

      // pin pads
      const allPins = [...chip.leftPins, ...chip.rightPins];
      for (const pin of allPins) {
        ctx.beginPath();
        ctx.arc(pin.x, pin.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},0.3)`;
        ctx.fill();
      }

      // silkscreen label
      if (chip.w > 40 && chip.h > 20) {
        ctx.font = `${Math.min(chip.w, chip.h) * 0.18}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(${r},${g},${b},0.25)`;
        ctx.fillText(chip.label, chip.x + chip.w / 2, chip.y + chip.h / 2);
      }
    }

    // animated signals
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const sig of signals) {
      const pos = getPosition(sig.trace.waypoints, sig.progress);
      const alpha = 1 - sig.progress * 0.3;

      // trail
      ctx.strokeStyle = `rgba(${r},${g},${b},${0.12 * alpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      const trailProgress = Math.max(0, sig.progress - 0.04);
      const trailPos = getPosition(sig.trace.waypoints, trailProgress);
      ctx.moveTo(trailPos.x, trailPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      // pulse dot
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${0.9 * alpha})`;
      ctx.fill();

      // glow
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${0.15 * alpha})`;
      ctx.fill();
    }
  }

  // ------------------------------------------------------------------
  // tick
  // ------------------------------------------------------------------
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

    // advance signals
    for (let i = signals.length - 1; i >= 0; i--) {
      const sig = signals[i];
      sig.progress += sig.speed * (dt * 60);
      if (sig.progress >= 1) {
        signals.splice(i, 1);
      }
    }

    // spawn new signals
    if (Math.random() < 0.03 * (dt * 60)) {
      spawnSignal();
    }

    render();
    rafId = requestAnimationFrame(tick);
  }

  // ------------------------------------------------------------------
  // resize
  // ------------------------------------------------------------------
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
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // regenerate layout on resize
    const layout = generateLayout(displayWidth, displayHeight);
    chips = layout.chips;
    traces = layout.traces;
    gridLines = layout.gridLines;
    standaloneVias = layout.standaloneVias;
    signals = [];
  }

  // ------------------------------------------------------------------
  // lifecycle
  // ------------------------------------------------------------------
  onMount(() => {
    ctx = canvasEl.getContext('2d', { alpha: true });
    noisePool = Float32Array.from({ length: NOISE_POOL_SIZE }, () => Math.random());
    frameDeltas = new Float64Array(FRAME_AVG_WINDOW);
    accentRgb = parseHex(accentColor);

    resize();
    // seed initial signals
    for (let i = 0; i < 3; i++) spawnSignal();

    window.addEventListener('resize', resize);
    rafId = requestAnimationFrame(tick);
  });

  onDestroy(() => {
    if (rafId) cancelAnimationFrame(rafId);
    if (typeof window !== 'undefined') window.removeEventListener('resize', resize);
  });
</script>

<div class="pcb-container" bind:this={containerEl} style="--bg-color:{bgColor}; --accent-color:{accentColor}; height:{height}px;">
  <canvas bind:this={canvasEl} aria-hidden="true"></canvas>
</div>

<style>
  .pcb-container { width: 100%; height: 100%; background: transparent; overflow: hidden; position: relative; }
  canvas { display: block; width: 100%; height: 100%; will-change: contents; transform: translateZ(0); }
</style>