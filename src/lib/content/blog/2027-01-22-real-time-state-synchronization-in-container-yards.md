---
title: Real-Time State Synchronization in ContainerYards
date: 2027-01-22
slug: real-time-state-synchronization-in-container-yards
excerpt: A container yard with stale state is a yard with bad decisions. Synchronization isn't a networking problem — it's an architectural one.
---

Every container movement changes the state of the yard. A truck pulls a container from stack A to the gate. A crane stacks a container into slot 42-A. A vessel unloads 200 containers into the yard. If any of those events arrives late, or not at all, the system is operating on fiction.

## The synchronization gap

Most yard systems rely on periodic refreshes — poll the gate, poll the AIS, poll the TMS. By the time you've polled everything, the state has shifted. The result is a planning layer that makes decisions based on a picture that's already outdated.

ContainerFlow takes a different approach. Every sensor, gate event, and crane position is a real-time stream. NATS JetStream fans out those events to all interested consumers — the optimization engine, the dashboard, the alerting system — with exactly-once delivery semantics.

## What's synchronized

We synchronize four things: inventory position (where each container is), crane state (which crane is doing what), gate status (which lanes are occupied), and vessel schedule (what's next). Each domain has its own stream, but they share a common versioning scheme so downstream consumers can detect gaps.

When a stream gap appears, the system doesn't guess. It pauses optimization, flags the affected zones, and waits for the next snapshot from the source of truth. Better a slow decision than a wrong one.

## Architecture choices

Rust for the stream processors: low latency, no GC pauses, easy to model state machines with.
Svelte for the dashboard: reactive updates when the underlying streams change.
Postgres for the persistent model: reliable storage with bounded query complexity.

The important design choice is that no component assumes it has the canonical state. Every component has a local view, and every local view has an expiry. Stale views are marked as such and excluded from optimization input.
