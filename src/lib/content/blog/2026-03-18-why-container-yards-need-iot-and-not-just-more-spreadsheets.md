---
title: Why Container Yards Need IoT, Not Just More Spreadsheets
date: 2026-03-18
slug: why-container-yards-need-iot-and-not-just-more-spreadsheets
excerpt: Most container yards track location with spreadsheets updated by hand. This works until it doesn't — and when it fails, you lose containers. Here's what IoT changes.
---

A container yard is a warehouse where the inventory moves itself (via crane) and the storage slots are three-dimensional. Tracking what's where, and when it moved, is a fundamentally different problem from a static warehouse. Most yards still manage this with spreadsheets updated by operators after the fact, which creates a gap between reality and the record that grows every hour.

## The failure mode of manual tracking

The spreadsheet works fine when operations are slow and predictable. The moment you have:

- **Peak periods** with high throughput, where operators don't have time to update the record after each move.
- **Emergency pulls** where a container needs to be located and retrieved urgently, and the last recorded position is 3 moves out of date.
- **Multi-yard operations** where a container is in transit between yards and nobody is sure which yard's spreadsheet has the current record.

...the spreadsheet becomes a liability. Operators stop trusting it, start making radio calls to ask "where is container X?", and the system degrades to verbal coordination.

## The IoT stack

The system I built uses:

- **BLE beacons** on containers for coarse-grained position (which stack, which bay). Cheap, long battery life, good enough for "which section is it in."
- **RFID tags** on containers for precise identification when a crane picks them up. The RFID reader on the crane's spreader confirms identity at the moment of handling.
- **UWB anchors** for precise positioning (within 30cm) when exact slot-level tracking is needed. More expensive, used selectively in high-value areas.
- **MQTT** for real-time telemetry from all sensors to a central broker.
- **InfluxDB** for time-series storage of position and event data.
- **A Svelte dashboard** that shows current positions, movement history, and handling heat maps.

## What the dashboard changed

The immediate win was not the real-time position tracking — that's expected. The real win was the movement history and heat map. By visualizing which areas of the yard see the most handling activity, the yard manager reorganized the layout to put high-turnover containers in stacks closest to the loading docks. This reduced average crane travel per pull by 22% without changing a single constraint in the pulling sequence solver.

The second win was anomaly detection. When a container's position changes without a corresponding crane event in the log, it means either the tracking missed an event or someone moved a container outside the system. Both cases are worth investigating, and the system now catches them automatically instead of relying on an operator noticing a discrepancy weeks later.

## The takeaway

IoT in a container yard is not about replacing the spreadsheet with a fancier spreadsheet. It's about closing the gap between "what happened" and "what the record says happened" to zero, in real time. Once that gap is closed, you can build optimization and anomaly detection on top of accurate data, which is something you can never do with hand-maintained records.
