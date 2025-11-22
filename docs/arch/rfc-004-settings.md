# RFC-004: Settings & Feature Flags

| Status        | Draft |
| :---          | :--- |
| **Author**    | Antigravity |
| **Created**   | 2025-11-22 |
| **Reviewers** | User |

## 1. Context & Problem Statement

The application needs a centralized area for users to manage their profile and preferences. Additionally, we need a robust feature flag system to safely roll out new features (like the AI Chat we just built) and manage system behavior without code deploys.

**Critical Constraint**: All data mutations must go through tRPC. No direct database access or external API calls from the client.

## 2. Goals & Non-Goals

### Goals
- Implement `/dashboard/settings` page.
- Create a Feature Flag system (client & server).
- Allow users to update profile (Name, etc.) via tRPC.
- Allow users to toggle theme (Light/Dark/System) - *already exists in sidebar, but add to settings for completeness*.
- Expose feature flags to the frontend via tRPC.

### Non-Goals
- Billing/Subscription management (Phase 6).
- Complex team/organization management (Phase 7).
- A/B testing framework (out of scope).

## 3. Proposed Solution

### Architecture

```
┌─────────────────────────────────────┐
│      Settings UI Component          │
│  (Client-side, Dashboard Page)      │
└──────────────┬──────────────────────┘
               │ tRPC Client
               ▼
┌─────────────────────────────────────┐
│      Settings Router                │
│  (Server-side API Layer)            │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       ▼               ▼
┌─────────────┐ ┌─────────────┐
│ Clerk (Auth)│ │ FeatureFlags│
└─────────────┘ └─────────────┘
```

### 3.1 Feature Flags

**Package**: `@progravity/feature-flags`

**Implementation**:
- Simple in-memory or environment-variable based flags for MVP.
- Typed flags using TypeScript.

**Flags**:
```typescript
export const flags = {
  "chat.enabled": boolean,
  "billing.enabled": boolean,
}
```

### 3.2 API Changes

**New tRPC Router: `settings`**

```typescript
// GET current feature flags
settings.getFeatureFlags: publicProcedure
  .query(() => FeatureFlagsSchema)

// UPDATE user profile
settings.updateProfile: protectedProcedure
  .input(UpdateProfileSchema)
  .mutation(() => UserSchema)
```

### 3.3 UI Changes

**Page**: `/dashboard/settings/page.tsx`
- **Profile Section**: Form to update First Name, Last Name.
- **Appearance Section**: Theme toggle.
- **Features Section**: Read-only list of active feature flags (for debugging/transparency).

## 4. Alternatives Considered

### Alternative 1: LaunchDarkly / PostHog
- **Pro**: Full featured, managed service.
- **Con**: Overkill for MVP, adds external dependency.
- **Rejected**: We'll build a simple internal system first.

### Alternative 2: Database-backed Flags
- **Pro**: Dynamic updates without deploy.
- **Con**: Requires DB setup (which we haven't finalized yet).
- **Rejected**: Env vars are sufficient for now.

## 5. Rollout Plan

1. Implement `@progravity/feature-flags`.
2. Create `settings` tRPC router.
3. Build Settings UI.
4. Verify profile updates work.
