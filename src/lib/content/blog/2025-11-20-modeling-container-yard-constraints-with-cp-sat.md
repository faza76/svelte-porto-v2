---
title: Modeling Container Yard Constraints with CP-SAT
date: 2025-11-20
slug: modeling-container-yard-constraints-with-cp-sat
excerpt: Container yards are deceptively complex constraint problems. Here's how I used Google OR Tools CP-SAT to model module-pulling sequences — and why naive greedy heuristics fail in practice.
---

A container yard looks simple from the outside: stacks of modules, a few cranes, some trucks. But the moment you try to figure out the optimal pulling sequence — which module to move first, which crane to assign, where to temporarily place a blocking module — the combinatorics explode.

## Why greedy doesn't work

The naive approach is greedy: pull the module you need next, move whatever is in the way first. This works until you realize that every temporary placement creates new blocking relationships, and the sequence of unblocking moves can spiral into a cascade of rehandles that dominates total handling time.

In a yard with 200 modules across 15 stacks, each with 3-6 layers, a greedy sequence might require 40-60% more crane moves than an optimized one. That's not a rounding error — it's hours of crane time per shift.

## The CP-SAT formulation

Google OR Tools CP-SAT is a constraint solver that handles integer programming with a mix of SAT-solver techniques and LP relaxation. For the pulling sequence problem, the key decisions are:

- **Sequence variables**: For each module that needs to be pulled, an integer variable representing its position in the pulling order.
- **Crane assignment**: Which crane handles each move, with no two moves on the same crane overlapping in time.
- **Temporary placement**: Where blocking modules go when displaced, subject to available slot constraints.

The objective function minimizes total crane travel distance plus a penalty for each temporary placement (to prefer direct pulls over rehandles).

## What made it tractable

The raw problem has millions of feasible combinations. Three things brought it under CP-SAT's solve budget:

1. **Symmetry breaking**: Two cranes of identical capacity are interchangeable — fixing the first move to crane 1 eliminates redundant branches.
2. **Precedence constraints**: If module A is stacked on module B, A must be pulled first. Encoding this as a constraint rather than branching on it reduced search space dramatically.
3. **Time windows**: Pull requests arrive in batches with delivery deadlines. Using CP-SAT's interval variables for time windows let the solver prune infeasible branches early.

On a 200-module test case, CP-SAT found a provably optimal solution in under 8 seconds on a laptop. A heuristic approach with simulated annealing took 30 seconds and produced a solution 12% worse.

## The takeaway

Constraint solvers are underused in logistics problems where people reach for heuristics by default. If your problem has discrete decisions, constraints that interact, and an objective you can express linearly — CP-SAT is probably the right tool before you start inventing a metaheuristic.
