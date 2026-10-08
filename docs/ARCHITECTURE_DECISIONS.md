# Architecture Decision Records (ADR)

## Master Architecture Directive
As defined in **System Requirement 52**, Legalnorms Consultations operates on a strictly managed **Modular Monolith** pattern. 

### Why a Modular Monolith?
Microservices introduce severe operational complexities (network latency, distributed transactions, tracing complexity, deployment overhead). Until the platform hits true "Billion-User Scale" (Section 27) network constraints, the monolith provides maximum developer velocity and type safety.

### Approved Primitives
1. **Application Layer:** Next.js App Router (Stateless, container-friendly).
2. **Database:** PostgreSQL (Strictly normalized, Multi-tenant).
3. **Caching:** Redis (Session state, rate limiting, rapid lookup).
4. **Blob Storage:** S3 / R2 (Immutable regulatory documents).
5. **Search:** Elastic/Algolia (Denormalized high-speed indexing).
6. **Background Tasks:** Redis Queue / Cloud Tasks.

---

## Future Microservice Candidates
While we build a monolith today, we must maintain strict separation of concerns (Repositories -> Services -> Routers). 

The following workloads have been identified as primary candidates for eventual extraction into independently scalable microservices when performance metrics dictate:

### 1. The Regulatory Ingestion Pipeline
- **Reasoning:** Parsing gigabytes of FDA/EMA XML dumps or scraping global registries is CPU and memory intensive.
- **Extraction Path:** Can easily be broken out into an independent Python/Go worker service that writes directly to the shared Postgres DB or pushes via an internal API.

### 2. Document Processing & OCR
- **Reasoning:** OCR (Optical Character Recognition) on scanned medical PDFs blocks Node.js event loops and requires heavy RAM allocations.
- **Extraction Path:** A dedicated queue-worker running Rust or Python on highly scalable spot instances.

### 3. Notification Fan-Out Engine
- **Reasoning:** When a major drug (e.g., Aspirin) gets a safety alert, the system may need to dispatch 500,000+ emails and push notifications instantly. This would choke the primary web server.
- **Extraction Path:** The `NotificationService` abstraction we built seamlessly allows for this to be extracted to a separate queue-driven Go/Rust service.

### 4. Search Indexing Worker
- **Reasoning:** Keeping the Postgres database synced with the external Search Engine (Elastic) under heavy write load.
- **Extraction Path:** A CDC (Change Data Capture) service utilizing Debezium or similar to stream Postgres WAL logs directly to the search cluster, entirely bypassing the Node.js application layer.
