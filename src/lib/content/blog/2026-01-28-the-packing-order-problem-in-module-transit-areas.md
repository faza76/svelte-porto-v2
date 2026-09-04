---
title: The Packing Order Problem in Module Transit Areas
date: 2026-01-28
slug: the-packing-order-problem-in-module-transit-areas
excerpt: When modules arrive in a transit area and need to be loaded into a mother container, the order you pack them matters more than the packing itself. Here's why.
---

Module logistics in offshore construction and heavy fabrication have a peculiar constraint that most packing problems ignore: the modules arrive in a sequence determined by fabrication completion, but they must be packed into the mother container in reverse order of unloading at the destination. This creates a sequencing problem layered on top of a packing problem.

## Why the order matters

A mother container (or transport barge) has limited deck space. Modules must be placed so that:

1. **Structural integrity**: Heavier modules go on lower tiers. This is a hard constraint — exceeding stack weight limits risks catastrophic failure at sea.
2. **Unloading order**: The last module loaded must be the first one unloaded at the destination. If the destination site has limited crane capacity, the unloading sequence may have additional precedence constraints.
3. **Center of gravity**: The loaded arrangement must keep the vessel's center of gravity within safety limits. This is a continuous constraint over discrete placements.

If you pack modules greedily by weight (heaviest first), you often end up with a sequence that violates the unloading order constraint, requiring you to unpack and repack — wasting time in an already tight schedule.

## The CP-SAT formulation

The decision variables are:

- **Position**: For each module, which slot in the mother container it occupies.
- **Tier**: Which vertical level it sits on.
- **Sequence**: For modules sharing a crane path, which one is loaded first.

Constraints:

- Weight tier limits (heavy modules on lower tiers).
- Precedence: If module A must unload before module B, then A's slot must be accessible from B's slot without moving other modules.
- Center of gravity: Computed as a weighted average of slot positions, constrained to stay within a polygon defined by the vessel's stability certificate.
- Arrival time: A module cannot be placed before it arrives in the transit area.

The objective minimizes total loading time, which is a function of crane travel between consecutive placements.

## What the solver found

On a test case with 24 modules, 4 tiers, and a 6-hour loading window, the solver produced a sequence that:

- Respected all weight and stability constraints.
- Achieved 94% of theoretical minimum loading time.
- Left exactly the right slots open for three late-arriving modules that weren't in the original schedule.

The greedy approach (heaviest-first, ignore arrival order) produced a feasible solution in 2 minutes but required 38% more crane moves because of the repacking needed to satisfy unloading precedence.

## Why this matters

In offshore construction, the mother container loading window is often on the critical path. Saving 38% of crane time on a loading operation that takes 6 hours is a 2+ hour improvement. On a project where the vessel charter costs $50,000/day, that's meaningful money for a few hundred lines of Python.
