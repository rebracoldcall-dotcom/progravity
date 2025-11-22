# RFC-005: Billing & Subscription (Stripe)

| Status        | Draft |
| :---          | :--- |
| **Author**    | Antigravity |
| **Created**   | 2025-11-22 |
| **Reviewers** | User |

## 1. Context & Problem Statement

We need to monetize Progravity by offering subscription plans (e.g., "Pro" plan for AI usage). We need a secure, PCI-compliant way to handle payments and manage subscriptions.

**Constraints**:
- No own database yet (use Clerk Metadata for persistence).
- tRPC-first for client interactions.
- "Google-Grade" security (no keys in client).

## 2. Goals & Non-Goals

### Goals
- Integrate Stripe for payments.
- Store customer ID and subscription status in Clerk User Metadata.
- Create a Pricing Page.
- Handle Webhooks (Checkout Completed, Subscription Updated/Deleted).
- Gate features based on subscription status (Feature Flags integration).

### Non-Goals
- Usage-based billing (metered) - MVP is flat rate.
- Multiple currencies (USD only for MVP).
- In-app invoice generation (Stripe handles this).

## 3. Proposed Solution

### Architecture

```
┌─────────────────────────────────────┐
│      Pricing UI Component           │
│  (Client-side, Dashboard Page)      │
└──────────────┬──────────────────────┘
               │ tRPC (createCheckoutSession)
               ▼
┌─────────────────────────────────────┐
│      Billing Router                 │
│  (Server-side API Layer)            │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       ▼               ▼
┌─────────────┐ ┌─────────────┐
│    Stripe   │ │    Clerk    │
└─────────────┘ └─────────────┘
       ▲
       │ Webhooks
       ▼
┌─────────────────────────────────────┐
│   Webhook Handler (/api/webhooks)   │
│   (Next.js Route Handler)           │
└─────────────────────────────────────┘
```

### 3.1 Data Model (Clerk Metadata)

We will store the following in `user.publicMetadata`:

```typescript
interface UserMetadata {
  stripe: {
    customerId: string;
    subscriptionId: string | null;
    status: "active" | "past_due" | "canceled" | "incomplete" | null;
    planId: string | null;
  }
}
```

### 3.2 Package Structure

**New Package**: `@progravity/billing`
- Exports Stripe client instance.
- Exports webhook signature verification helpers.
- Exports subscription plan constants.

### 3.3 API Changes

**New tRPC Router: `billing`**

```typescript
// Create a checkout session URL
billing.createCheckoutSession: protectedProcedure
  .input(z.object({ planId: z.string() }))
  .mutation(async ({ ctx, input }) => { ... })

// Get portal URL (for managing subscription)
billing.createPortalSession: protectedProcedure
  .mutation(async ({ ctx }) => { ... })
```

### 3.4 Webhook Handling

**Route**: `/api/webhooks/stripe`
- Verify signature.
- Handle `checkout.session.completed`: Link Stripe Customer ID to Clerk User.
- Handle `customer.subscription.updated`: Update status in Clerk.
- Handle `customer.subscription.deleted`: Remove status in Clerk.

## 4. Security Considerations

- **Secret Keys**: `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in `.env.local`.
- **Signature Verification**: STRICT verification of webhook signatures to prevent spoofing.
- **Idempotency**: Webhook handler should be idempotent.

## 5. Rollout Plan

1. Create `@progravity/billing`.
2. Implement Webhook Handler.
3. Implement tRPC Router.
4. Create Pricing Page.
5. Verify with Stripe CLI.
