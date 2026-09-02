---
title: Why Interoperability Standards Feel Like Legacy Debt
date: 2026-01-12
slug: interoperability-standards-legacy-debt
excerpt: HL7v2 and OPC-UA both promise interoperability. In practice, every deployment I've touched has its own dialect — and the standard becomes the thing you have to work around.
---

Every hospital I've integrated with claims to speak HL7v2. Every plant I've integrated with claims to speak OPC-UA. Both statements are technically true and practically useless, because "speaks the standard" and "speaks the standard the way you expect" are different claims.

## The dialect problem

HL7v2 segments are pipe-delimited and, on paper, well specified. In practice, every EHR vendor has opinions about which optional fields get populated, in what order custom Z-segments show up, and how timestamps are formatted when the underlying database was designed in 1998. OPC-UA has the same story on the industrial side: the standard defines an information model, but every PLC vendor's node hierarchy looks just different enough that a client written against one line's tags needs revisiting for the next.

The standard isn't the interoperability layer. It's the *vocabulary* you use to describe the interoperability layer you still have to build.

## What actually helps

Two things have consistently paid off more than chasing spec compliance:

1. **A canonical internal schema.** Don't let external dialects leak into your domain model. Translate at the edge, once, and let everything downstream assume a clean shape.
2. **Contract tests against real message samples**, not synthetic ones generated from the spec. The edge cases that break integrations are never the ones the spec anticipated.

None of this is unique to healthcare or manufacturing — it's the same lesson as any integration with a third party you don't control. The standard buys you a shared vocabulary for the problem, not a solution to it.
