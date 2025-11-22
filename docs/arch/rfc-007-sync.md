# RFC-007: Local-First Sync (Replicache)

| Status        | Draft |
| :---          | :--- |
| **Author**    | Claude (Antigravity) |
| **Created**   | 2025-11-22 |
| **Reviewers** | User |

## 1. Context & Problem Statement

Users expect instant UI updates and the ability to work offline. Traditional request/response APIs create loading states and don't work without connectivity.

**Goal**: Implement a local-first sync layer that provides instant UI updates and offline support.

**Constraints**:
- tRPC-first policy (Replicache must integrate via tRPC endpoints).
- No external database yet (use Clerk as the source of truth for now).
- "Google-Grade" quality (optimistic UI, conflict resolution).

## 2. Goals & Non-Goals

### Goals
- **Instant UI**: Mutations apply locally before server confirmation.
- **Offline Support**: Users can interact when offline, sync when back online.
- **Replicache Integration**: Use Replicache for client-side state management.
- **tRPC Endpoints**: Implement `push` and `pull` endpoints via tRPC.

### Non-Goals
- Full CRDT conflict resolution (simple last-write-wins for MVP).
- Multi-device real-time collaboration (future enhancement).
- Persistent offline storage beyond browser session (future enhancement).

## 3. Proposed Solution

### Architecture

```
┌─────────────────────────────────────┐
│      React Components               │
│  (useSubscribe from Replicache)     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Replicache Client              │
│  (Local IndexedDB Cache)            │
└──────────────┬──────────────────────┘
               │ mutate() / pull()
               ▼
┌─────────────────────────────────────┐
│      tRPC Sync Router               │
│  (push, pull procedures)            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Clerk / External APIs          │
└─────────────────────────────────────┘
```

### 3.1 Data Model

For MVP, we will sync **Chat Messages** only.

**Client Schema**:
```typescript
{
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: number;
}
```

**Server Schema**: Same as client (simple pass-through).

### 3.2 API Changes

**New Package**: `@progravity/sync`
- Replicache client wrapper.
- Mutation definitions.

**New tRPC Router: `sync`**

```typescript
// Push mutations from client
sync.push: protectedProcedure
  .input(z.object({ mutations: z.array(...) }))
  .mutation(...)

// Pull latest state
sync.pull: protectedProcedure
  .input(z.object({ cookie: z.number().nullable() }))
  .query(...)
```

### 3.3 UI Changes

**Chat Interface**: Replace direct tRPC calls with Replicache mutations:
- `chatMutation.mutate()` → `replicache.mutate.sendMessage()`
- `trpc.chat.getHistory` → `useSubscribe(rep, async tx => tx.scan())`

## 4. Implementation Steps

1. Install `replicache` and `replicache-react`.
2. Create `@progravity/sync` package.
3. Implement `sync.push` and `sync.pull` tRPC procedures.
4. Update Chat UI to use Replicache.
5. Test offline mode.

## 5. Security Considerations

- Validate all mutations server-side.
- Ensure user can only sync their own data (check `userId` in `ctx.auth`).

## 6. Rollout Plan

- Phase 8.1: Chat messages only (MVP).
- Phase 8.2: Extend to other entities (Team data, Settings, etc.) - Future.
