---
title: Flow Optimization Beyond Static Planning
date: 2027-01-10
slug: flow-optimization-beyond-static-planning
excerpt: Container yards are not warehouses. They're dynamic networks where every movement creates a ripple of constraints. Static planning fails the moment reality diverges from the model.
---

Most container yards plan operations on static models: a snapshot of inventory, a scheduled vessel arrival, a precomputed crane sequence. The approach works until the first truck arrives late, the first container is mis-stacked, or the first vessel changes its berthing window.

## The network is the model

ContainerFlow treats the yard as a flow network with time-varying capacities. Each zone — quay, yard, transit — has a maximum throughput, but that maximum isn't a fixed number. It depends on the current state: which cranes are busy, which gates are backed up, which stacks have open slots.

This is the difference between planning and optimization. Planning asks: what sequence minimizes total time? Optimization asks: what sequence minimizes total time *given the current state*?

## The CP-SAT core

Under the hood, we use Google OR Tools' CP-SAT solver to find optimal dispatch sequences. The solver handles hard constraints — crane travel limits, stack height rules, vessel deadlines — and optimizes against soft objectives like reducing unnecessary moves.

The challenge isn't the solver's speed. It's the speed of updating the model when reality changes. If a truck breaks down at the gate, the network changes. The solver needs the updated capacity within milliseconds, not minutes.

That's why we keep a live state snapshot in memory and maintain a delta stream of changes. The solver doesn't rebuild from scratch; it reuses what it can and updates only what changed.

## Static planning is a snapshot, not a strategy

Static models provide a baseline, but treating them as strategy is the same mistake as navigating a road trip with a paper map while ignoring live traffic updates. The map isn't wrong; it's just no longer sufficient.
