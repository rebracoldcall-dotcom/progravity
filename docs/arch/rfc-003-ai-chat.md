# RFC-003: AI Chat Interface

| Status        | Draft |
| :---          | :--- |
| **Author**    | Antigravity |
| **Created**   | 2025-11-21 |
| **Reviewers** | User |

## 1. Context & Problem Statement

The application needs an AI-powered chat interface where authenticated users can interact with an AI assistant using real-time streaming responses. This requires:
- A tRPC-based chat API with streaming support
- Real-time message display with streaming text
- Conversation history management
- Error handling for AI service failures
- User-friendly chat UI with responsive design

**Critical Constraint**: All AI interactions must be routed through tRPC (per `api-standards.md`). No direct Vercel AI SDK or OpenAI calls in the frontend.

## 2. Goals & Non-Goals

### Goals
- Implement protected `/dashboard/chat` route with chat interface
- Create tRPC chat router with streaming support
- Integrate OpenAI via Vercel AI SDK (server-side only)
- Display streaming responses in real-time
- Support conversation history (in-memory for MVP)
- Follow existing error handling patterns from dashboard

### Non-Goals
- Persistent conversation storage (database integration - Phase 2)
- Multi-model support (GPT-4, Claude, Gemini - Phase 2)
- Advanced features (RAG, function calling, embeddings - Phase 2)
- Mobile chat UI (separate Expo implementation)

## 3. Proposed Solution

### Architecture

```
┌─────────────────────────────────────┐
│      Chat UI Component              │
│  (Client-side, Dashboard Page)      │
└──────────────┬──────────────────────┘
               │ tRPC Client (streaming)
               ▼
┌─────────────────────────────────────┐
│      tRPC Chat Router               │
│  (Server-side API Layer)            │
└──────────────┬──────────────────────┘
               │ @progravity/ai
               ▼
┌─────────────────────────────────────┐
│    Vercel AI SDK + OpenAI           │
│  (External AI Service)              │
└─────────────────────────────────────┘
```

**Abstraction Layer**: OpenAI and Vercel AI SDK are implementation details. Frontend uses `trpc.chat.*` procedures only.

### 3.1 Architecture Changes

**C4 Component Update**:
- Add `Chat Router` to the API Layer
- Add `ChatInterface` component to the Dashboard
- Update `@progravity/ai` package to expose chat utilities

**Route Structure**:
```
/dashboard/chat         → AI chat interface (protected)
```

### 3.2 API Changes

**New tRPC Router: `chat`**

```typescript
// Stream chat completion
chat.sendMessage: protectedProcedure
  .input(ChatMessageInputSchema)
  .mutation(() => ReadableStream<string>)

// Future: Get conversation history
chat.getHistory: protectedProcedure
  .query(() => ChatHistorySchema)
```

**tRPC Streaming Support**:
- Use tRPC's experimental streaming support or HTTP streaming
- Alternative: SSE (Server-Sent Events) via Next.js API route if tRPC streaming is complex

### 3.3 Data Model Changes

**New Zod Schemas** (`packages/contracts/src/chat.ts`):
```typescript
export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.date(),
  id: z.string().uuid(),
});

export const ChatMessageInputSchema = z.object({
  message: z.string().min(1).max(4000),
  conversationId: z.string().uuid().optional(),
});

export const ChatHistorySchema = z.object({
  conversationId: z.string().uuid(),
  messages: z.array(ChatMessageSchema),
});
```

## 4. Alternatives Considered

### Alternative 1: Direct Vercel AI SDK in Frontend
- **Pro**: Simpler, uses `useChat()` hook
- **Con**: Violates tRPC policy, tight coupling, no auth abstraction
- **Rejected**: Not "Google-Grade", breaks architecture standards

### Alternative 2: REST API for Streaming
- **Pro**: More standard HTTP streaming
- **Con**: Loses tRPC type safety
- **Rejected**: Breaks "Contract is Law" policy

### Alternative 3: WebSockets for Chat
- **Pro**: Bi-directional, real-time
- **Con**: More complex infrastructure, overkill for one-way streaming
- **Rejected**: HTTP streaming is sufficient for MVP

### Alternative 4: Hybrid Approach (tRPC + API Route)
- **Pro**: Leverages tRPC for inputs, Next.js API route for streaming
- **Con**: Splits chat logic across two endpoints
- **Accepted**: This is a pragmatic compromise if tRPC streaming is too complex

## 5. Error Handling & Loading States

### Loading States (Required)

**Message Streaming**:
```typescript
const { mutate: sendMessage, isLoading } = trpc.chat.sendMessage.useMutation();

// Show typing indicator while streaming
if (isLoading) {
  return <TypingIndicator />;
}

// Stream arrives, display progressively
onStream((chunk) => {
  appendToMessage(chunk);
});
```

**UX Requirements**:
- **Typing Indicator**: Show animated dots while AI is generating
- **Progressive Display**: Stream tokens as they arrive (no wait for full response)
- **Auto-scroll**: Scroll to bottom as new content streams in
- **Disable Input**: Prevent new messages while streaming

### Error Handling (Required)

**Error Types**:
1. **Network Error** (offline, timeout)
   - Show: "Connection lost. Please check your internet."
   - Action: Retry button
   - Fallback: Keep previous messages visible

2. **Auth Error** (401, session expired)
   - Show: "Session expired. Please sign in again."
   - Action: Redirect to `/sign-in`

3. **AI Service Error** (OpenAI rate limit, 500)
   - Show: "AI service temporarily unavailable. Try again in a moment."
   - Action: Retry button
   - Log: Send error to OpenTelemetry

4. **Content Violation** (OpenAI content policy)
   - Show: "This message violates content policy."
   - Action: Clear input, allow retry with different message

**Error Boundary**:
```typescript
<ErrorBoundary fallback={<ChatError />}>
  <ChatInterface />
</ErrorBoundary>
```

### Performance Budgets

| Metric | Target | Max |
|--------|--------|-----|
| **First Token Latency** | < 500ms | 1s |
| **Streaming Speed** | > 50 tokens/s | 20 tokens/s |
| **Chat UI Bundle** | < 50 KB | 80 KB |
| **Message Send** | < 100ms | 200ms |

**Enforcement**: Monitor via OpenTelemetry, alert if P95 exceeds max.

---

## 6. Cross-Cutting Concerns

### Security
- All chat requests authenticated via Clerk (protectedProcedure)
- User messages sanitized before sending to OpenAI
- No user data logged to console (privacy)
- Rate limiting: 10 messages/minute per user (prevent abuse)

### Privacy
- No PII sent to OpenAI (beyond what user types)
- Conversation history ephemeral (in-memory, not persisted yet)
- GDPR compliance: User can clear history

### Observability

**Analytics Events** (via OpenTelemetry):
```typescript
// Track these events (no PII)
- chat.message.sent (with messageLength, conversationId)
- chat.stream.started
- chat.stream.completed (with duration, tokenCount)
- chat.error.shown (with errorCode)
```

**Metrics to Monitor**:
- First token latency (P50, P95, P99)
- Total tokens per conversation
- Error rate by error type
- User engagement (messages per session)

### Performance
- Server Components for chat layout
- Client Components for message input and streaming display
- Optimistic UI updates (show user message immediately)
- Debounce typing indicator (avoid flicker)

## 7. Rollout Plan

### Feature Flag
- **Key**: `chat.enabled`
- **Default**: `false`
- **Rollout**: Enable for testing, then gradual rollout

### Migration
- No migration needed (new feature)
- Add OpenAI API key to `.env.local`

### Verification

#### Automated Tests
1. **Unit Tests**: tRPC chat router with mocked OpenAI
   - Test: Message validation (min/max length)
   - Test: Streaming response chunks
   - Test: Error handling (OpenAI down, auth failure)

2. **Integration Tests**: Full chat flow with mocked AI
   - Test: Send message → Receive stream → Display in UI
   - Test: Multiple messages in conversation

#### Manual Verification
1. **Browser Test**: Navigate to `/dashboard/chat`
   - Send message → See streaming response
   - Test error states (disconnect network, expire session)
   - Test long messages (> 1000 chars)

2. **Performance Test**: Measure first token latency
   - Use browser DevTools Network tab
   - Target: < 500ms to first chunk

3. **Accessibility**: Run Axe on chat interface
   - Keyboard navigation (Tab, Enter to send)
   - Screen reader support (message announcements)

---

## Implementation Checklist

### Core API
- [ ] Create `packages/contracts/src/chat.ts` with Zod schemas
- [ ] Update `@progravity/ai` package with chat utilities
- [ ] Create `apps/web/server/trpc/routers/chat.ts`
- [ ] Add chat router to tRPC app router
- [ ] Implement streaming response handler

### UI Components
- [ ] Create `/app/(dashboard)/dashboard/chat/page.tsx`
- [ ] Build `ChatInterface` component
- [ ] Build `MessageList` component (with auto-scroll)
- [ ] Build `MessageInput` component (with send button)
- [ ] Build `TypingIndicator` component
- [ ] Add error states for chat failures

### Testing & Verification
- [ ] Test streaming in browser (send message, see response)
- [ ] Test error states (kill OpenAI, expire session)
- [ ] Measure first token latency (target < 500ms)
- [ ] Run Lighthouse (performance budget check)
- [ ] Test accessibility (keyboard, screen reader)

### Documentation
- [ ] Update AGENT_HANDOFF.md with chat implementation
- [ ] Create walkthrough.md with chat demo
