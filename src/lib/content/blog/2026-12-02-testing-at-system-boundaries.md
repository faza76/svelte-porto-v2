---
title: Testing at System Boundaries
date: 2026-12-02
slug: testing-at-system-boundaries
excerpt: Unit tests prove your logic works in isolation. Integration tests prove your assumptions about the outside world are still valid. Most teams over-invest in the first and under-invest in the second.
---

I reviewed a codebase recently with ninety-percent unit test coverage and a CI pipeline that passed reliably. It also had a bug that only appeared when the actual email provider changed their API response format. No test had ever exercised that boundary.

## The unit test trap

Unit tests are satisfying. They run fast, they're deterministic, and they give you a green checkmark. But they test the world you control, which is the smaller half of most production systems. The other half is external services, databases, queues, and filesystems that behave in ways your mocks don't capture.

I'm not arguing against unit tests. I'm arguing against the confidence they give you when you haven't tested the seams. A function that parses JSON perfectly against a mock is still broken if the real payload adds an unexpected field that changes the type of a nested value.

## Mocks lie

Every mock is a theory about how an external system behaves. Theories are wrong more often than we'd like. The database driver you mocked against version 3.1 returns slightly different errors in 3.4. The HTTP client you wrapped doesn't actually retry on the status code you assumed. The queue drops messages after a timeout you didn't know existed.

When your tests pass against mocks and fail in production, the problem isn't the code. It's the model of the world the tests were built on.

## The boundary is where risk lives

Integration tests are slower, flakier, and harder to set up. They're also where your system actually touches reality. The database schema is what it is, not what you think it is. The third-party API has rate limits and undocumented quirks that change without notice.

The teams I trust most have a clear hierarchy. Unit tests for algorithmic logic and edge cases. Integration tests at every system boundary. A smaller suite of end-to-end tests that exercise critical paths through the whole stack. The proportions matter more than the absolute numbers.

## What to do instead

Write tests against real dependencies where you can. Use testcontainers for databases. Hit a sandbox API for payment providers. Run your message queue in Docker for CI. Yes, it's slower. Yes, it's more setup. But it's also the only way to find out your migrations don't match your models before you deploy.

The goal isn't perfect coverage. It's calibrated confidence. Know what you've tested, know what you've assumed, and be honest about the gap between them.
