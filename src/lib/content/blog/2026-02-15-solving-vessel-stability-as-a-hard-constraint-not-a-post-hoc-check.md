---
title: Solving Vessel Stability as a Hard Constraint, Not a Post-Hoc Check
date: 2026-02-15
slug: solving-vessel-stability-as-a-hard-constraint-not-a-post-hoc-check
excerpt: Most packing tools treat vessel stability as a validation step after the fact. Encoding it as a constraint in the solver produces better solutions and eliminates the "fix it in post" cycle.
---

The standard workflow in many logistics departments: pack the modules, then check if the vessel is stable. If not, rearrange. Repeat. This works, but it means the stability constraint is guiding human intuition rather than the optimizer.

## The problem with post-hoc stability checks

When stability is checked after packing, you get one of two outcomes:

1. **It passes.** Great, but you don't know if a different arrangement would have been both stable and faster to load.
2. **It fails.** Now you're manually rearranging modules, each rearrangement potentially violating a different constraint, in a cycle that can take hours.

The issue is that vessel stability is a continuous constraint over discrete placement decisions. The center of gravity calculation depends on the exact position and weight of every module on the vessel. It's not something you can eyeball.

## Encoding stability in CP-SAT

Vessel stability can be expressed as linear constraints over the placement variables. For each module:

- Its weight is known.
- Its position (x, y coordinates on the vessel) is a function of the slot it's assigned to.

The center of gravity is the weighted average of all module positions. The stability constraint requires this point to fall within a polygon defined by the vessel's load line certificate. This polygon can be represented as a set of linear inequalities — exactly what CP-SAT handles natively.

The key insight: the slot-to-position mapping is a constant (the slot positions are fixed on the vessel), so the center of gravity calculation is a linear function of the assignment variables. No approximations needed.

## What changed

With stability as a hard constraint, the solver never produces an infeasible plan. Every solution it returns is something you can load without worrying about the stability check failing afterward.

More importantly, the solver found arrangements that human planners hadn't considered: placing a lighter module in a seemingly suboptimal slot to balance the center of gravity, which then freed up a better slot for a heavier module that had a tight loading window. The interactions between stability, weight limits, and precedence constraints are exactly the kind of thing CP-SAT excels at — and exactly the kind of thing human intuition struggles with.

## The broader point

Any time you have a constraint that you're currently checking after the fact, ask whether it can be encoded as a constraint in the solver. The solver will find solutions that satisfy it by construction, rather than solutions that happen to satisfy it by coincidence.
