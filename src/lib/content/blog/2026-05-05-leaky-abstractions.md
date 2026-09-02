---
title: Leaky Abstractions
date: 2026-05-05
slug: leaky-abstractions
excerpt: Software is principally concerned with abstractions. Every one of them leaks eventually — the question is whether your system is designed to survive that, or built as if it never will.
---

Software is principally concerned with abstractions. Instead of writing binary, we have programming languages that abstract away the machine-readable details. Instead of repeating thousands of lines of code to perform some action, we abstract the action as a function, a service, a library.

Every abstraction I've ever relied on has eventually leaked. The ORM that hides SQL until a query plan goes sideways under load. The message queue that hides network partitions until you're debugging a duplicate delivery at 2am. The container orchestrator that hides the underlying machine until a noisy neighbor pins a CPU core.

## The leak is not the bug

The instinct when an abstraction leaks is to patch it — add a special case, catch the exception, paper over the seam. Sometimes that's right. More often it just moves the leak somewhere harder to see.

The more durable fix is to design as if the abstraction *will* leak, because it will. That means:

- Logging and tracing at the boundary, not just inside your own code, so when something below the abstraction misbehaves you can see it happen instead of inferring it from symptoms three layers up.
- Timeouts and circuit breakers on every call that crosses a trust boundary, not just the ones that have bitten you before.
- Treating "what happens when this fails" as part of the interface contract, not an afterthought bolted on after the first incident.

## Where this matters most

This gets sharper the higher the stakes of the system underneath the abstraction. In regulated environments — healthcare data pipelines, manufacturing control systems — the temptation to trust the abstraction is strongest exactly where the cost of it leaking is highest. A "reliable" message bus that silently drops a message under backpressure is a minor annoyance in a chat app and a serious problem in a system routing clinical alerts or halting a production line.

You can't get rid of leaky abstractions. You can only decide, ahead of time, whether your system finds out about the leak from a graceful degradation path or from an incident report.
