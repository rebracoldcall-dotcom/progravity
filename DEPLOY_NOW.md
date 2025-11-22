# 🚀 FINAL DEPLOYMENT STEPS

## ✅ COMPLETED (by Claude)
- [x] Git initialized
- [x] All files committed
- [x] `.env.example` created with all required variables
- [x] `vercel.json` configured for monorepo
- [x] Build verified (passing)

---

## 📋 YOUR 3 REMAINING STEPS

### Step 1: Create GitHub Repository & Push

**Option A: Via GitHub Website**
1. Go to: https://github.com/new
2. Repository name: `progravity`
3. **DO NOT** check "Initialize with README"
4. Click "Create repository"
5. Copy the commands shown, OR run:

```bash
cd c:/Users/rinoruser/Desktop/progravity
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/progravity.git
git push -u origin main
```

---

### Step 2: Deploy to Vercel

```bash
cd c:/Users/rinoruser/Desktop/progravity
vercel --prod
```

**Vercel will ask questions - use these answers**:
- **Set up and deploy?** → `Y` (Yes)
- **Which scope?** → Your account
- **Link to existing project?** → `N` (No)
- **Project name?** → `progravity`
- **In which directory is your code located?** → `./apps/web`
- **Want to override settings?** → `Y` (Yes)
  - **Build Command?** → `cd ../.. && pnpm install && pnpm build --filter=web`
  - **Output Directory?** → `apps/web/.next`
  - **Development Command?** → (leave default)

Vercel will build and deploy. **Copy the production URL** it gives you!

---

### Step 3: Configure Environment Variables in Vercel

1. Go to: https://vercel.com/dashboard
2. Click your **progravity** project
3. Go to **Settings** → **Environment Variables**
4. Add EACH variable from `.env.example`:

**From your .env.local (apps/web)**:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=... (copy from apps/web/.env.local)
CLERK_SECRET_KEY=... (copy from apps/web/.env.local)
OPENAI_API_KEY=... (copy from apps/web/.env.local)
STRIPE_SECRET_KEY=... (copy from apps/web/.env.local)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=... (copy from apps/web/.env.local)
STRIPE_PRICE_ID_PRO=... (copy from apps/web/.env.local)
```

**New variables for production**:
```
NEXT_PUBLIC_APP_URL=https://YOUR_VERCEL_URL.vercel.app (use URL from Step 2)
NODE_ENV=production
STRIPE_WEBHOOK_SECRET=whsec_... (get from Stripe dashboard - see below)
```

**For Sentry (optional - can skip for now)**:
```
NEXT_PUBLIC_SENTRY_DSN=... (sign up at sentry.io)
SENTRY_AUTH_TOKEN=... (from Sentry dashboard)
```

5. Click **"Redeploy"** after adding variables

---

### Step 4: Configure Stripe Webhook

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. **Endpoint URL**: `https://YOUR_VERCEL_URL.vercel.app/api/webhooks/stripe`
4. **Events to listen to**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **"Add endpoint"**
6. Click **"Reveal"** next to "Signing secret"
7. Copy the `whsec_...` value
8. Add it to Vercel as `STRIPE_WEBHOOK_SECRET`
9. Redeploy in Vercel

---

### Step 5: Update Clerk URLs

1. Go to: https://dashboard.clerk.com
2. Select your app
3. Go to **API Keys**
4. Scroll to **"Authorized origins"**
5. Add: `https://YOUR_VERCEL_URL.vercel.app`
6. Scroll to **"Authorized redirect URLs"**
7. Add: `https://YOUR_VERCEL_URL.vercel.app/dashboard`

---

## 🎉 DONE! Test Your App

Visit: `https://YOUR_VERCEL_URL.vercel.app`

**Test these flows**:
1. ✅ Sign up / Sign in
2. ✅ Create organization
3. ✅ Go to `/dashboard/chat` → Send message
4. ✅ Go to `/dashboard/billing` → Upgrade to Pro
5. ✅ Check Clerk dashboard → Verify metadata updated

---

## 🆘 Troubleshooting

**Build fails?**
- Check Vercel logs in dashboard
- Verify all env vars are set
- Ensure build command is correct

**Webhooks not working?**
- Check webhook URL matches your Vercel URL
- Verify signing secret in Vercel env vars
- Look at Stripe webhook logs

**Auth not working?**
- Verify Clerk URLs are updated
- Check Clerk API keys in Vercel

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Stripe Webhooks: https://stripe.com/docs/webhooks
- Clerk Setup: https://clerk.com/docs

**You're deploying a production-ready SaaS app! 🚀**
