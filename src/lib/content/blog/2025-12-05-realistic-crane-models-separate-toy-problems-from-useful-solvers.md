---
title: Realistic Crane Models Separate Toy Problems from Useful Solvers
date: 2025-12-05
slug: realistic-crane-models-separate-toy-problems-from-useful-solvers
excerpt: The gap between a textbook container scheduling model and one that actually runs in a yard comes down to how honestly you model the crane. Here's what I learned the hard way.
---

Most OR papers on container yard optimization assume the crane is a point that teleports between locations with a fixed travel time. This is fine for a homework assignment. It is useless for a real yard.

## What the textbook misses

A real gantry crane has:

- **Non-symmetric travel**: Moving an empty spreader is faster than moving a loaded one. The loaded speed depends on weight.
- **Positioning overhead**: Aligning the spreader over a container takes time that depends on wind conditions and operator skill, not just distance.
- **Conflict zones**: Two cranes on the same rail cannot pass each other. If crane A is between crane B and its destination, B has to wait.
- **Fatigue and shift rules**: Operators take breaks. Breaks are staggered. A crane going offline mid-move needs the move completed first.

## How I modeled it

Rather than abstracting the crane away, I modeled it as an interval variable in CP-SAT with:

- A travel-time function that takes origin, destination, and load state as inputs.
- A no-overlap constraint between cranes on shared rails, which CP-SAT handles natively with `AddNoOverlap`.
- Break windows as fixed unavailable intervals that the solver must work around.

The travel-time function is a lookup table indexed by bay distance and load weight, rather than a formula. This trades elegance for accuracy — a deliberate choice when the "formula" would be a piecewise-linear approximation of a lookup table anyway.

## What changed

With the realistic crane model, the solver produces sequences that yard operators can actually follow. In early iterations with the simplified model, the solver would produce sequences requiring a crane to move through a zone that was physically blocked by another crane — something that never shows up in the abstract model because the no-overlap constraint wasn't specific enough.

The realistic model also revealed that break scheduling is not a minor detail. A 15-minute staggered break pattern across two cranes creates a 5-minute window every hour where only one crane is available. The solver learned to front-load time-critical pulls into those windows.

## The lesson

If you're building a solver for a physical system, the model's fidelity at the boundary between "planning" and "execution" is what determines whether the plan survives contact with reality. Invest your modeling effort there, not in the objective function.
