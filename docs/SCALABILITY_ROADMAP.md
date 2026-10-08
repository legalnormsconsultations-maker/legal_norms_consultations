# Legalnorms Consultations - Scalability Roadmap

As mandated by **System Requirement 60**, the platform rejects the fallacy of "unlimited scalability." Every scaling stage introduces severe operational tradeoffs. We scale only when monitored bottlenecks prove it necessary.

---

## Stage 1: The Optimized Monolith (Current State)
*Single production PostgreSQL database + Redis caching + Global CDN*

- **Bottleneck Addressed:** N/A (Baseline architecture). Capable of supporting 10k-50k daily active users.
- **Solution:** Next.js application servers running statelessly, backed by a single heavily-indexed PostgreSQL master. Static assets and React payloads cached at the CDN Edge.
- **Migration Strategy:** Rapid iteration. Drizzle ORM pushing direct migrations to the single DB.
- **Operational Tradeoff:** Single point of failure at the PostgreSQL master. High risk of a bad query locking tables and taking down the entire API.

---

## Stage 2: Read Optimization & Async Offloading
*Read replicas + Queue workers + Dedicated Search (e.g. Elasticsearch)*

- **Bottleneck Addressed:** CPU exhaustion on the primary database due to complex `JOIN` queries for Drug searches, or UI timeouts caused by blocking PDF parsing tasks.
- **Solution:** 
  - Deploy PostgreSQL read-replicas. Route all `GET` API requests to replicas. 
  - Offload heavy ingestion/PDF tasks to Redis Queues (e.g., BullMQ).
  - Sync drug data into a dedicated search cluster (Elastic) for sub-50ms text retrieval.
- **Migration Strategy:** Implement a CDC (Change Data Capture) tool like Debezium to stream Postgres changes to Elasticsearch. Update the Next.js `Repository` layer to distinguish between read and write connections.
- **Operational Tradeoff:** Eventual consistency. Users may create a regulatory event and not see it in search results for 1-2 seconds. Queue monitoring introduces new devops overhead.

---

## Stage 3: Data Partitioning & Advanced Caching
*Database partitioning + Workload separation + Redis advanced structures*

- **Bottleneck Addressed:** Tables like `audit_logs` or `regulatory_events` reach 100M+ rows, causing index sizes to exceed RAM limits and slowing down basic inserts.
- **Solution:** 
  - Postgres Native Partitioning: Split massive tables chronologically (e.g., `audit_logs_2026_q1`, `audit_logs_2026_q2`).
  - Strict workload separation (Admin telemetry vs Client API).
- **Migration Strategy:** Requires scheduled maintenance to move massive historical tables into partitioned schemas. 
- **Operational Tradeoff:** Cross-partition queries become catastrophically slow. Developers must now always include a timestamp (partition key) when querying audit logs.

---

## Stage 4: Multi-Regional Availability
*Regional application deployment + Regional data architecture*

- **Bottleneck Addressed:** 200ms+ network latency for users in Europe/Asia hitting a US-East server. Regulatory compliance requiring data localization (e.g., EU GDPR vs US HIPAA boundaries).
- **Solution:** Deploy active-active Next.js application clusters in multiple global regions. Utilize distributed SQL (like CockroachDB or Spanner) or complex Postgres logical replication.
- **Migration Strategy:** High complexity. Codebase must be audited to ensure no reliance on localized server state. DNS routing via Anycast.
- **Operational Tradeoff:** Severe complexity in database replication. Conflicts arise if the same organization is edited simultaneously in Tokyo and New York. CI/CD deployments now take 4x longer to roll out globally.

---

## Stage 5: The Billion-Scale Distributed System
*Horizontal scaling + Selective sharding + Independently scalable services*

- **Bottleneck Addressed:** A single massive PostgreSQL cluster can no longer handle the sheer volume of global writes. The ingestion pipeline requires 1000x more compute than the web dashboard.
- **Solution:** 
  - Break the Modular Monolith into strict Microservices (Extract the `Background Ingestion Pipeline`, `Search Indexer`, and `Notification Fanout`).
  - Shard the database by `organizationId`. Tenancy data is physically split across dozens of smaller, isolated databases.
- **Migration Strategy:** Execute the architectural extractions mapped out in `ARCHITECTURE_DECISIONS.md`. Migrate tenants to specific shards using application-level routing.
- **Operational Tradeoff:** Distributed transactions are no longer possible. If a cross-shard transaction fails, the system must rely on complex Saga patterns or eventual consistency rollbacks. Tracing a single user request now requires sophisticated distributed observability tools (e.g., Jaeger/Datadog).
