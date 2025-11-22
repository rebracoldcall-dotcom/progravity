# Progravity - Production Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com - **FREE**)
- Clerk account (already set up)
- Stripe account (already set up)
- OpenAI API key (already set up)

---

## Step 1: Install Vercel CLI

```bash
# Install globally
npm i -g vercel

# Or use pnpm
pnpm add -g vercel

# Login to Vercel
vercel login
```

---

## Step 2: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Production ready MVP"

# Create GitHub repo and push
# (Follow GitHub's instructions to create new repo)
git remote add origin https://github.com/YOUR_USERNAME/progravity.git
git branch -M main
git push -u origin main
```

---

## Step 3: Connect to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your GitHub repo (`progravity`)
4. Vercel will auto-detect Next.js

**Important Settings**:
- **Framework Preset**: Next.js
- **Root Directory**: `apps/web`
- **Build Command**: `cd ../.. && pnpm install && pnpm build --filter=web`
- **Output Directory**: `apps/web/.next`
- **Install Command**: `pnpm install`

---

## Step 4: Configure Environment Variables

In Vercel dashboard, add these **Environment Variables**:

### Authentication (Clerk)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### AI Chat (OpenAI)
```
OPENAI_API_KEY=sk-...
```

### Billing (Stripe)
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (will configure in Step 6)
STRIPE_PRICE_ID_PRO=price_...
```

### Production Monitoring (Sentry)
```
NEXT_PUBLIC_SENTRY_DSN=https://...@o....ingest.sentry.io/...
SENTRY_AUTH_TOKEN=sntrys_... (get from Sentry dashboard)
```

### App Configuration
```
NEXT_PUBLIC_APP_URL=https://YOUR_APP.vercel.app
NODE_ENV=production
```

---

## Step 5: Deploy

```bash
# From project root
cd progravity

# Deploy to production
vercel --prod
```

Vercel will:
1. Build your app
2. Deploy to `https://YOUR_APP.vercel.app`
3. Assign a production URL

---

## Step 6: Configure Stripe Webhooks

1. Go to **Stripe Dashboard** → **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. **Endpoint URL**: `https://YOUR_APP.vercel.app/api/webhooks/stripe`
4. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Webhook Signing Secret** (`whsec_...`)
6. Add it to Vercel Environment Variables as `STRIPE_WEBHOOK_SECRET`
7. **Redeploy** to apply the new env var:
   ```bash
   vercel --prod
   ```

---

## Step 7: Update Clerk Settings

1. Go to **Clerk Dashboard** → **Your App** → **API Keys**
2. Update **Authorized Origins**:
   - Add: `https://YOUR_APP.vercel.app`
3. Update **Authorized Redirect URLs**:
   - Add: `https://YOUR_APP.vercel.app/dashboard`

---

## Step 8: Test in Production

### 1. Authentication
- Visit `https://YOUR_APP.vercel.app`
- Sign up / Sign in
- Verify redirect to dashboard

### 2. AI Chat
- Go to `/dashboard/chat`
- Send a message
- Verify streaming response

### 3. Billing
- Go to `/dashboard/billing`
- Click **"Upgrade to Pro"**
- Complete checkout (use Stripe test card: `4242 4242 4242 4242`)
- Verify redirect back to billing page

### 4. Webhooks
- Check Vercel logs: `vercel logs --prod`
- Verify webhook received
- Check Clerk user metadata for subscription status

### 5. Teams
- Create organization
- Invite member
- Verify invitation email sent

---

## Step 9: Monitor & Debug

### Vercel Logs
```bash
# Real-time logs
vercel logs --prod --follow

# Recent logs
vercel logs --prod
```

### Sentry Dashboard
- Visit https://sentry.io
- Check for errors
- Set up alerts

### Stripe Dashboard
- Check webhook delivery status
- View successful/failed payments

---

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify `pnpm` is being used (not `npm`)
- Ensure all dependencies are in `package.json`

### Environment Variables Not Working
- Redeploy after adding env vars
- Check spelling and formatting
- Ensure no trailing spaces

### Webhooks Not Working
- Verify webhook URL is correct
- Check Stripe webhook signing secret
- View Vercel function logs for errors

---

## Post-Deployment Checklist

- [ ] App loads at production URL
- [ ] Authentication works (sign up/sign in)
- [ ] AI chat streams responses
- [ ] Billing flow completes
- [ ] Webhooks update user metadata
- [ ] Team invitations send emails
- [ ] Sentry captures errors
- [ ] All pages render correctly

---

## Going Live (When Ready)

### Add Custom Domain (Pro Plan - $20/month)
1. Upgrade to Vercel Pro
2. Add custom domain in Vercel settings
3. Update DNS records
4. Update Clerk/Stripe URLs

### Performance Optimization
- Enable Vercel Analytics
- Set up caching strategies
- Optimize images with `next/image`

### Security
- Rate limit sensitive endpoints
- Add CAPTCHA to sign-up
- Enable 2FA for admin accounts

---

**You're now deployed! 🚀**

Questions? Check Vercel docs: https://vercel.com/docs
