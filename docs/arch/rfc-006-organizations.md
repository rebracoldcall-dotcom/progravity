# RFC-006: Organization & Team Management

| Status        | Draft |
| :---          | :--- |
| **Author**    | Antigravity |
| **Created**   | 2025-11-22 |
| **Reviewers** | User |

## 1. Context & Problem Statement

Users need to collaborate. We need a way to group users into "Organizations" or "Teams" and manage access.

**Constraints**:
- Strict tRPC-first policy (avoid direct Clerk SDK in frontend where possible, though Clerk components are allowed for Auth UI, for core app logic we prefer our own UI calling tRPC).
- Use Clerk as the identity provider and organization store.

## 2. Goals & Non-Goals

### Goals
- Create/Delete Organizations.
- Invite members by email.
- List organization members.
- Switch active organization.

### Non-Goals
- Granular permissions (RBAC) beyond Admin/Member for now.
- SAML SSO (Enterprise feature).

## 3. Proposed Solution

### Architecture

```
┌─────────────────────────────────────┐
│      Team Settings UI               │
│  (Custom UI, not Clerk Components)  │
└──────────────┬──────────────────────┘
               │ tRPC
               ▼
┌─────────────────────────────────────┐
│      Team Router                    │
│  (Server-side API Layer)            │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       ▼               ▼
┌─────────────┐ ┌─────────────┐
│ Clerk API   │ │ Clerk Meta  │
└─────────────┘ └─────────────┘
```

### 3.1 Data Model

We rely on Clerk's `Organization` and `OrganizationMembership` objects.
We do NOT duplicate this data in a local DB yet.

### 3.2 API Changes

**New tRPC Router: `team`**

```typescript
// Create Organization
team.create: protectedProcedure
  .input(z.object({ name: z.string(), slug: z.string() }))
  .mutation(...)

// List Members
team.getMembers: protectedProcedure
  .query(...)

// Invite Member
team.inviteMember: protectedProcedure
  .input(z.object({ email: z.string(), role: z.enum(["admin", "member"]) }))
  .mutation(...)
```

### 3.3 UI Changes

**Page**: `/dashboard/team`
- **Header**: Show current Org name.
- **Member List**: Table of members.
- **Invite Button**: Opens modal/form to invite.
- **Switcher**: We might use Clerk's `<OrganizationSwitcher />` in the sidebar for convenience, as re-implementing that perfectly is complex. *Decision: Use Clerk's Switcher in Sidebar, but Custom UI for management page.*

## 4. Security Considerations

- Ensure users can only list members of their *active* organization.
- Validate roles properly.

## 5. Rollout Plan

1. Create `team` router.
2. Create Team Management Page.
3. Add `<OrganizationSwitcher />` to Sidebar (exception to "Custom UI" for navigation elements).
