---
title: MQTT or Not: The Telemetry Backbone Decision for IoT Yard Systems
date: 2026-04-10
slug: mqtt-or-not-the-telemetry-backbone-decision-for-iot-yard-systems
excerpt: MQTT is the default choice for IoT telemetry, but it's not always the right one. Here's the tradeoff analysis I did before committing to it for a container yard mapping system.
---

When you're collecting position data from hundreds of BLE beacons, dozens of RFID readers, and a handful of UWB anchors, every few seconds, you need a telemetry backbone. MQTT is the obvious choice for IoT. But "obvious" is not the same as "right," so I actually evaluated the alternatives.

## The candidates

1. **MQTT**: Pub/sub, lightweight, designed for constrained devices. The industry standard for IoT.
2. **Kafka**: Pub/sub with durability and replay. Overkill for sensor telemetry? Maybe not.
3. **NATS**: Pub/sub with better performance than MQTT, less ecosystem. My go-to for application-level messaging.
4. **Direct HTTP/REST**: Simple, but polling hundreds of devices every few seconds doesn't scale.

## What I actually needed

- **At-most-once delivery**: Sensor readings are redundant. If I miss one, the next one arrives in 5 seconds. No need for exactly-once semantics.
- **Low latency**: Position data should appear on the dashboard within 1-2 seconds of the physical event.
- **Topic hierarchy**: I need to subscribe to "all beacons in yard section A" or "all RFID events from crane 3" without maintaining separate topic lists.
- **Broker availability**: The broker must be resilient to a single node failure. The yard operates 24/7.

## Why MQTT won

Kafka provides durability and replay, which I don't need for sensor telemetry — I'm writing directly to InfluxDB for historical storage. Kafka's operational complexity (ZooKeeper, partition management) is overhead I don't want to manage for a system that should be boring infrastructure.

NATS has better performance than MQTT and I use it extensively in other projects. But MQTT has something NATS doesn't: native support for constrained devices with flaky connectivity. MQTT's QoS levels (0, 1, 2) let you tune delivery guarantees per topic. QoS 0 (at-most-once) for high-frequency sensor data, QoS 1 (at-least-once) for critical events like container identification at crane pickup. NATS doesn't have this granularity built in.

MQTT's topic hierarchy (`yard/section-A/stack-3/beacon-42`) maps naturally to the physical hierarchy of the yard. Subscribing to `yard/section-A/#` gives me everything in section A. This is a small thing, but it means the topic structure documents itself.

## The broker choice

I run EMQX as the MQTT broker. It handles 10,000+ concurrent connections per node, supports clustering for HA, and has a built-in HTTP API for monitoring. Mosquitto is simpler but doesn't cluster natively. For a production system that runs 24/7, EMQX's operational maturity is worth the extra resource usage.

## What I'd change

If I were starting today, I'd evaluate MQTT 5.0's shared subscriptions feature, which lets multiple consumers share the load on a topic. My current setup uses a single consumer per topic, which works at current scale but won't if the yard doubles its sensor count. Shared subscriptions would let me scale the consumer horizontally without changing the broker or the publishers.

The other thing I'd do differently is add a lightweight message queue (NATS JetStream or Redis Streams) between MQTT and InfluxDB as a buffer. Right now, if InfluxDB is temporarily unavailable, MQTT messages are lost (QoS 0). A buffer with a short retention window would handle brief InfluxDB outages without the complexity of end-to-end exactly-once delivery.
