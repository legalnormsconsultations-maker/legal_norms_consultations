# Legalnorms Consultations - API Contract

## 1. Design Philosophy
The API is designed as a future B2B platform product. It strictly adheres to REST principles and returns predictable JSON structures.

## 2. Authentication
All endpoints under `/api/v1/*` require a Bearer token:
```http
Authorization: Bearer ln_live_xxxxxxxxxxxxxxxxx
```

## 3. Standard Response Format
**Success (200 OK):**
```json
{
  "success": true,
  "data": { ... },
  "meta": { "timestamp": "2026-09-30T10:00:00Z" }
}
```

**Error (4xx/5xx):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid drug manufacturer ID format.",
    "details": ["manufacturerId must be a valid UUID."]
  }
}
```

## 4. Pagination
Endpoints returning lists (e.g., `GET /api/v1/drugs`) support cursor-based pagination for high performance on massive datasets.
```http
GET /api/v1/drugs?limit=50&cursor=eyJpZCI6IjEyMyJ9
```

## 5. Rate Limits
Default API rate limit: `1000 requests / minute` per organization. 
Headers returned:
- `X-RateLimit-Limit: 1000`
- `X-RateLimit-Remaining: 999`
- `X-RateLimit-Reset: 1727712000`
