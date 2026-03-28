# Community & Monetization Hub (Next.js 14+)

Boilerplate for:
- Next.js App Router + TypeScript + Tailwind
- Clerk auth with protected `/admin`
- Supabase (Realtime comments)
- Stripe Checkout gifts with `/api/webhooks/stripe`

## Setup

1. Copy `.env.example` to `.env.local` and fill in keys.
2. Create Supabase schema from `supabase/setup.sql` (or `supabase/setup.ts`).
3. Install dependencies and run:

```bash
npm install
npm run dev
```

## Key routes

- `/` persona-driven landing page
- `/admin` protected by Clerk
- `/books/[id]` cover + external “Read Now” + realtime comments + Stripe gift button
- `/api/webhooks/stripe` Stripe webhook handler

