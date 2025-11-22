# RFC-001: Authentication System

| Status        | Draft |
| :---          | :--- |
| **Author**    | Antigravity |
| **Created**   | 2025-11-21 |
| **Reviewers** | User |

## 1. Context & Problem Statement

The application requires a secure, scalable authentication system that supports:
- Email/password authentication
- OAuth providers (Google, GitHub)
- Session management
- Protected routes (server-side and client-side)

**Critical Constraint**: All authentication logic must be accessible via the tRPC API layer, per the "Contract is Law" policy defined in `docs/arch/api-standards.md`. Direct SDK usage in components violates our architecture.

## 2. Goals & Non-Goals

### Goals
- Implement authentication with minimal vendor lock-in
- Expose auth state via typed tRPC procedures
- Support server-side and client-side route protection
- Enable feature-flagged rollout

### Non-Goals
- Custom auth implementation (we will use a managed provider)
- Multi-factor authentication (Phase 2)
- Passwordless auth (Phase 2)

## 3. Proposed Solution

### Architecture

```
┌─────────────┐
│   Frontend  │
│  (React)    │
└──────┬──────┘
       │ tRPC Client
       ▼
┌─────────────┐
│ Auth Router │ ← tRPC Procedures
│  (tRPC)     │
└──────┬──────┘
       │ Clerk SDK
       ▼
┌─────────────┐
│    Clerk    │ ← External Auth Provider
└─────────────┘
```

**Abstraction Layer**: Clerk is an implementation detail. Frontend never imports `@clerk/nextjs` directly.

### 3.1 Architecture Changes

**C4 Component Update**:
- Add `Auth Router` component to the API Layer
- Frontend components use `trpc.auth.*` procedures
- Clerk SDK is isolated to the API layer

### 3.2 API Changes

**New tRPC Router: `auth`**

```typescript
// GET current user session
auth.getSession: protectedProcedure
  .query(() => AuthSessionSchema)

// POST sign out
auth.signOut: protectedProcedure
  .mutation(() => { success: boolean })

// GET user profile
auth.getUser: protectedProcedure
  .query(() => UserSchema)
```

All responses validated with Zod schemas in `@progravity/contracts`.

### 3.3 Data Model Changes

**New Zod Schemas** (`packages/contracts/src/auth.ts`):
```typescript
export const AuthSessionSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
  email: z.string().email(),
  isAuthenticated: z.boolean(),
});

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  imageUrl: z.string().url().nullable(),
});
```

## 4. Alternatives Considered

### Alternative 1: Auth.js (NextAuth)
- **Pro**: Open source, more control
- **Con**: More maintenance, fewer features
- **Rejected**: Clerk offers better DX and security features

### Alternative 2: Supabase Auth
- **Pro**: Includes database
- **Con**: Vendor lock-in to Supabase ecosystem
- **Rejected**: We may not use Supabase for database

### Alternative 3: Direct Clerk SDK in Components
- **Pro**: Simpler initial implementation
- **Con**: Violates tRPC policy, tight coupling
- **Rejected**: Not "Google-Grade"

## 5. Cross-Cutting Concerns

### Security
- All auth tokens stored in HTTP-only cookies (handled by Clerk)
- CSRF protection via Clerk middleware
- No sensitive data in localStorage

### Privacy
- User emails stored in Clerk (SOC 2 compliant)
- No PII logged to console or OpenTelemetry

### Observability
- Auth failures logged with OpenTelemetry spans
- tRPC errors surfaced to frontend with typed error codes

### Performance
- Session check is server-side (no client-side flicker)
- tRPC uses React Query for caching

## 6. Rollout Plan

### Feature Flag
- **Key**: `auth.enabled`
- **Default**: `false`
- **Rollout**: Enable for internal testing, then gradual public rollout

### Migration
- No database migrations needed (Clerk manages user DB)
- Existing unauthenticated users redirected to sign-in page

### Verification
1. Unit tests for tRPC auth procedures
2. Integration tests for sign-in/sign-out flows
3. Manual QA on staging environment
