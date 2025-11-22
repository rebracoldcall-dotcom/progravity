# RFC-008: Production Readiness

| Status        | Draft |
| :---          | :--- |
| **Author**    | Claude (Antigravity) |
| **Created**   | 2025-11-22 |
| **Reviewers** | User |

## 1. Context & Problem Statement

Before launching to production, we need observability, security, and performance monitoring to ensure a "Google-Grade" experience.

**Goals**: 
- Catch errors before users report them
- Monitor performance bottlenecks
- Secure the application
- Track user behavior for product decisions

## 2. Goals & Non-Goals

### Goals
- **Error Tracking**: Integrate Sentry for real-time error monitoring
- **Analytics**: Add basic event tracking (Posthog or similar)
- **Security**: Implement security headers, rate limiting, CORS
- **Performance**: Add performance monitoring for API routes
- **Logging**: Structured logging for debugging

### Non-Goals
- Full APM (Application Performance Monitoring) - use lightweight monitoring
- GDPR compliance tooling (assume US-only for MVP)
- Load testing / stress testing (future)

## 3. Proposed Solution

### 3.1 Error Tracking (Sentry)

**Why Sentry**: Industry standard, great Next.js integration.

```typescript
// apps/web/instrumentation.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

### 3.2 Analytics

**Options**: Posthog (open-source), Mixpanel, Amplitude  
**Choice**: Posthog (privacy-friendly, self-hostable)

Track key events:
- User signup
- Subscription upgrade
- Team invitation sent
- Chat message sent

### 3.3 Security Headers

**Implement**:
- CSP (Content Security Policy)
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options
- Rate limiting on API routes

### 3.4 Performance Monitoring

- Next.js built-in analytics
- Custom metrics for tRPC endpoints
- Database query logging (when we add DB)

## 4. Implementation Steps

1. Install Sentry and configure
2. Add security headers via `next.config.js`
3. Implement rate limiting middleware
4. Add analytics events
5. Create monitoring dashboard

## 5. Security Considerations

- Ensure Sentry doesn't log PII (Personally Identifiable Information)
- Sanitize error messages before sending to client
- Rate limit authentication endpoints

## 6. Rollout Plan

- Phase 9.1: Error tracking + Security
- Phase 9.2: Analytics + Performance monitoring
