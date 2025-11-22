# RFC-002: Dashboard App Shell & Navigation

| Status        | Draft |
| :---          | :--- |
| **Author**    | Claude Sonnet 3.5 |
| **Created**   | 2025-11-21 |
| **Reviewers** | User |

## 1. Context & Problem Statement

The application needs an authenticated dashboard area where users can access protected features. This requires:
- An app shell layout with persistent navigation
- Client-side navigation without full page reloads
- User state display (profile, settings access)
- Responsive design for desktop and mobile

**Critical Constraint**: All user data must be fetched via tRPC (per `api-standards.md`). No direct Clerk hooks (`useUser`, `useAuth`) in components.

## 2. Goals & Non-Goals

### Goals
- Create protected `/dashboard` route with layout
- Implement sidebar navigation with route highlighting
- Display user profile via tRPC auth query
- Support responsive collapse/expand for mobile
- Integrate with existing theme system

### Non-Goals
- Complex nested routing (keep flat for now)
- Full app navigation (header/footer for public pages)
- Mobile app navigation (Expo, separate phase)

## 3. Proposed Solution

### Architecture

```
┌─────────────────────────────────────┐
│         RootLayout (Global)         │
│  ┌──────────────────────────────┐  │
│  │   ClerkProvider + TRPCProvider  │
│  │   ThemeProvider            │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      /dashboard (Group Layout)      │
│  ┌──────────────────────────────┐  │
│  │   DashboardLayout            │  │
│  │   ├─ Sidebar (Navigation)    │  │
│  │   ├─ Header (User Profile)   │  │
│  │   └─ Content Area            │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│       /dashboard/page.tsx           │
│       /dashboard/settings/page.tsx  │
│       /dashboard/chat/page.tsx      │
└─────────────────────────────────────┘
```

### 3.1 Architecture Changes

**C4 Component Update**:
- Add `DashboardLayout` component
- Add `Sidebar` navigation component
- Add `UserNav` component (displays user from tRPC)

**Route Structure**:
```
/                       → Public home page
/sign-in                → Clerk sign-in (handled by middleware)
/dashboard              → Protected dashboard home
/dashboard/settings     → User settings
/dashboard/chat         → AI chat interface (Step 4)
```

### 3.2 API Changes

**No new tRPC procedures needed** - we'll use existing:
- `trpc.auth.getUser()` - Fetch current user profile

**Future Extension**:
```typescript
// Potential future addition (not in this RFC)
dashboard.getStats: protectedProcedure
  .query(() => DashboardStatsSchema)
```

### 3.3 Data Model Changes

**New Zod Schemas** (`packages/contracts/src/dashboard.ts`):
```typescript
export const NavigationItemSchema = z.object({
  label: z.string(),
  href: z.string(),
  icon: z.string(), // Lucide icon name
  badge: z.number().optional(),
});

export const DashboardLayoutPropsSchema = z.object({
  user: UserSchema,
  navigation: z.array(NavigationItemSchema),
});
```

## 4. Alternatives Considered

### Alternative 1: App Directory Route Groups Only
- **Pro**: Simpler, no custom layout component
- **Con**: Less control over sidebar/header behavior
- **Rejected**: Need custom components for navigation state

### Alternative 2: Client-Side Only Layout
- **Pro**: Easier to manage state
- **Con**: Flicker on load, poor SEO
- **Rejected**: Next.js App Router favors server components

### Alternative 3: Shared Layout with Public Pages
- **Pro**: Consistent navigation everywhere
- **Con**: Dashboard UX differs from marketing site
- **Rejected**: Dashboard needs dedicated chrome

## 5. Error Handling & Loading States

### Loading States (Required)

**User Profile Loading**:
```typescript
const { data: user, isLoading, error } = trpc.auth.getUser.useQuery();

if (isLoading) {
  return <DashboardSkeleton />; // Shimmer UI
}

if (error) {
  return <ErrorBoundary error={error} />; // Graceful degradation
}

// Render with user.name, user.email, etc.
```

**UX Requirements**:
- **Skeleton Screens**: Show layout structure immediately (avoid blank white screen)
- **Progressive Rendering**: Show sidebar first, then user profile
- **No Flicker**: Use `staleTime: 5 * 60 * 1000` (5 min) in React Query config

### Error Handling (Required)

**Error Types**:
1. **Network Error** (offline, timeout)
   - Show: "Unable to connect. Check your internet."
   - Action: Retry button
   - Fallback: Show cached user data (if available)

2. **Auth Error** (401, session expired)
   - Show: "Session expired. Please sign in again."
   - Action: Redirect to `/sign-in`

3. **Server Error** (500)
   - Show: "Something went wrong. We're looking into it."
   - Action: Retry button
   - Log: Send error to OpenTelemetry

**Error Boundary**:
```typescript
// apps/web/components/error-boundary.tsx
<ErrorBoundary fallback={<DashboardError />}>
  <DashboardLayout />
</ErrorBoundary>
```

### Offline Experience

**React Query Config**:
```typescript
staleTime: 5 * 60 * 1000,        // 5 minutes
cacheTime: 10 * 60 * 1000,       // 10 minutes
retry: 3,                         // Retry failed requests
refetchOnWindowFocus: true,       // Refresh on tab focus
```

**Behavior**:
- User profile cached for 10 minutes
- Dashboard navigable offline (static routes)
- Show "Offline" badge in header
- Auto-sync when connection restored

### Performance Budgets

| Metric | Target | Max |
|--------|--------|-----|
| **TTI (Time to Interactive)** | < 2s | 3s |
| **Dashboard Bundle** | < 100 KB | 150 KB |
| **User Profile Fetch** | < 200ms | 500ms |
| **Navigation Click** | < 100ms | 200ms |

**Enforcement**: Lighthouse CI fails build if budget exceeded.

---

## 6. Cross-Cutting Concerns

### Security
- `/dashboard/*` protected by `middleware.ts` (already configured)
- User data fetched server-side (no client-side leaks)
- No sensitive info in URL params

### Privacy
- User email/profile only displayed to authenticated owner
- No PII in navigation state

### Observability

**Analytics Events** (via OpenTelemetry):
```typescript
// Track these events (no PII)
- dashboard.viewed
- dashboard.navigation.clicked (with route)
- dashboard.error.shown (with error code)
```

**Error Tracking**:
- tRPC errors → Logged to OpenTelemetry with trace ID
- User-facing errors → Toast notification + error boundary
- Silent errors → Background telemetry only

**Metrics to Monitor**:
- Dashboard load time (P50, P95, P99)
- tRPC `auth.getUser` latency
- Error rate by error type
- User retention (7-day, 30-day)

### Performance
- Server Components for layout (no JavaScript for shell)
- Client Components only where interactivity needed
- tRPC caching via React Query (5-minute stale time)

## 6. Rollout Plan

### Feature Flag
- **Key**: `dashboard.enabled`
- **Default**: `true` (once auth is working)
- **Rollout**: Immediate (internal testing)

### Migration
- No migration needed (new feature)

### Verification
1. Manual QA: Navigate to `/dashboard` → should show user name
2. Integration test: Mock tRPC, verify layout renders
3. Accessibility: Run Axe on dashboard layout

---

## Implementation Checklist

### Core Components
- [ ] Create `/app/(dashboard)/layout.tsx`
- [ ] Build `Sidebar` component with navigation items
- [ ] Build `UserNav` component using `trpc.auth.getUser()`
- [ ] Create `/app/(dashboard)/dashboard/page.tsx`
- [ ] Add responsive mobile menu

### Error Handling & Loading
- [ ] Create `DashboardSkeleton` component
- [ ] Create `ErrorBoundary` wrapper component
- [ ] Add error retry logic
- [ ] Configure React Query `staleTime` and `cacheTime`
- [ ] Add offline indicator badge

### Testing
- [ ] Test protected route redirect
- [ ] Test loading states (throttle network in DevTools)
- [ ] Test error states (kill server, expire session)
- [ ] Test offline experience
- [ ] Run Lighthouse CI (verify performance budgets)
