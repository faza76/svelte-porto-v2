---
title: The Cost of Free
date: 2026-10-03
slug: the-cost-of-free
excerpt: Every dependency you add is a bet that the maintainer will keep maintaining it, that the API won't break in ways that cost you a week, and that the security posture will stay acceptable. Free isn't free.
---

I've watched three teams in the last year hit the same wall: a critical dependency they relied on went unmaintained, changed direction, or was deprecated with a migration guide that assumed a team three times their size. The fix was never impossible, but it was always expensive in ways that hadn't been budgeted for.

## The dependency audit nobody does

Before adding a new library, most teams evaluate: does it solve the problem, is the API pleasant, is it well-documented? These are the easy questions.

The harder ones:

- How many open issues and PRs are there, and how old are they?
- Is there one maintainer or several?
- What happened the last time the API changed?
- What are its dependencies, and who maintains *those*?

This isn't paranoia. It's the same risk assessment you'd do before hiring a contractor you've never worked with. Except in this case the contractor is going to be embedded in your codebase indefinitely.

## Vendoring is unfashionable and underrated

The trend is toward fewer direct dependencies and more standard library. In Go, this has been conventional wisdom for years. In JavaScript, it's heresy — the ecosystem rewards composition through packages over reinvention through code.

But every line of code you write yourself is a line you understand completely. Every line pulled in from a dependency is a line you have to understand well enough to debug when it breaks in production at 3am and the maintainer's GitHub profile shows their last commit was eight months ago.

## The real calculation

The cost of a dependency isn't the time you save writing code. It's the time you save minus the time you'll eventually spend:

- Debugging its edge cases
- Upgrading it through breaking changes
- Replacing it when it's abandoned
- Auditing it for security vulnerabilities

Sometimes the math works out. A well-maintained library with a stable API and a small surface area is almost always worth it. The trouble is distinguishing that from the library that looks great on adoption day and becomes a liability two years later.

There's no formula for this. There's only experience, and the humility to admit that "we'll deal with it later" has a cost that compounds.