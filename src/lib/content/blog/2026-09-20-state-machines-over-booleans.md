---
title: State Machines Over Booleans
date: 2026-09-20
slug: state-machines-over-booleans
excerpt: Every boolean flag is a state you didn't name. Two flags give you four possible states, three flags give you eight, and after that you're managing complexity with variable names instead of structure.
---

I refactored a payment workflow last quarter that was held together by three boolean fields: `isInitiated`, `isProcessed`, and `isRefunded`. On the surface it seemed clean. In practice, the combination `(true, true, true)` was reachable in production and meant something nobody had documented.

The bug reports were surreal. Refunds applied to payments that hadn't settled. Notifications sent for states that shouldn't have been possible. Each fix added another check against an invalid combination, which created new edge cases.

## Booleans multiply

Two independent booleans represent four states. Three represent eight. By the time you have four or five, you've built a state machine by accident, except without the guardrails. Invalid transitions don't throw errors. They create data that your code has to handle defensively forever.

The problem isn't the booleans themselves. It's that they allow states you never intended. A payment can't be both processed and refunded in most systems, but the schema says it can. The database will happily store it. Your code will eventually encounter it.

## Enumerate the states

A state machine forces you to name what you mean. `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`, `REFUNDED`. Each state is explicit. Each transition is defined or disallowed. The invalid combinations simply don't exist.

The refactor wasn't complicated. I replaced the three booleans with a single status enum and a set of allowed transitions. The diff was smaller than I expected. The reduction in defensive checks was dramatic. The code went from asking "what combination of flags do I have?" to "what state am I in, and what can I do from here?"

## Events, not mutations

The second change was to model transitions as events rather than direct mutations. Instead of setting `status = 'COMPLETED'`, the system processes a `PaymentCompleted` event. This sounds like overhead until you need to answer questions like "how did this payment get into this state?" or "what happens if we need to replay this?"

Events give you an audit trail by design. They make it natural to add hooks: send a notification on `PaymentFailed`, update analytics on `PaymentCompleted`, release inventory on `PaymentRefunded`. The state machine becomes the backbone of the domain logic instead of a side effect of it.

## The real win

The biggest benefit wasn't the cleaner code. It was the conversations it enabled. When a product manager asked about a new flow, we could pull up the state diagram and talk about whether it was a new state or a new transition. The model matched how the business thought about the problem. That's the sign of a good abstraction.
