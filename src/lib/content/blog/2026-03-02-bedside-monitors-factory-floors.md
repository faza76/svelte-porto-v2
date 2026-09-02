---
title: From Bedside Monitors to Factory Floors
date: 2026-03-02
slug: bedside-monitors-factory-floors
excerpt: A vitals monitor and a vibration sensor have almost nothing in common — except that the software watching them faces the exact same design problems.
---

I split my time between two industries that don't talk to each other much: hospital systems and manufacturing plants. Every time I move between them, I'm struck by how often the *software* problem is identical even when the *domain* isn't.

## Same shape, different signal

A patient monitor streams heart rate, SpO2, and blood pressure. A production line streams vibration, temperature, and current draw. Neither is interesting in isolation — what matters is:

- **Baseline drift** — what's normal for *this* patient, or *this* motor, isn't necessarily what's normal on average.
- **Alarm fatigue** — a system that pages someone for every out-of-range reading gets ignored within a week, whether the someone is a night-shift nurse or a maintenance tech.
- **Explainability under scrutiny** — when an alert fires, both a clinician and a plant engineer want to know *why*, immediately, not after digging through a dashboard.

## Where the transfer actually helps

Building an anomaly-detection pipeline for one domain gives you a working mental model for the other faster than starting from scratch. The math is often literally the same — a rolling z-score against a learned baseline doesn't know or care whether the input is a heart rate or a bearing temperature.

The parts that *don't* transfer are the ones worth respecting: consequence severity, regulatory posture, and who's accountable when the system is wrong. A false negative on a factory floor costs you a machine. A false negative at a bedside costs something else entirely. The engineering pattern is portable; the stakes are not, and good systems are honest about that difference in how conservatively they're tuned.
