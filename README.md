# RemoteJobs

A full-stack remote job board where employers post listings and candidates discover opportunities — with role-based access, Stripe billing, and cloud file storage.

**Live:** [remote-job-board-rouge.vercel.app](https://remote-job-board-rouge.vercel.app)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| Database | PostgreSQL via Supabase + Prisma ORM |
| Auth | NextAuth v5 — Google OAuth |
| Payments | Stripe Checkout + Webhooks |
| Storage | Supabase Storage (company logos) |
| Styling | Tailwind CSS v4 + shadcn/ui + lucide-react |
| Deployment | Vercel |

---

## Features

### Candidates
- Browse jobs with keyword search, category filters, job type, and experience level
- Save and unsave jobs with a single click
- Dedicated saved jobs page

### Employers
- Create a company profile with logo upload (drag & drop, Supabase Storage)
- Post, edit, and delete job listings
- Free plan: up to 3 active job posts
- Premium plan: unlimited posts + featured placement via Stripe
- Employer dashboard to manage jobs and company details

### Payments
- Stripe Checkout session for upgrading to Premium
- Webhook-driven subscription sync — no polling
- Featured jobs toggle for Premium employers (30-day window per job)

---

## Architecture Highlights

- **Edge middleware RBAC** — route protection via `proxy.ts` using NextAuth's `auth()` directly at the edge; no token decoding round-trips
- **JWT role refresh** — role written to JWT immediately after onboarding via `unstable_update`, no stale session reads
- **Webhook-first billing** — Stripe subscription state is synced entirely through webhooks (`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`)
- **Server Actions** — job CRUD, role assignment, and company updates handled via Next.js Server Actions with runtime validation

---

## Access Control

| Route | CANDIDATE | EMPLOYER | ADMIN |
|---|---|---|---|
| `/` | ✅ | ✅ | ✅ |
| `/saved` | ✅ | ❌ | ✅ |
| `/dashboard` | ❌ | ✅ | ✅ |
| `/post-job` | ❌ | ✅ | ✅ |
| `/onboarding` | new users only | new users only | ❌ |

---

## Subscription Plans

| Plan | Job Posts | Featured Listings |
|---|---|---|
| `FREE` | Max 3 | ❌ |
| `PREMIUM_POSTER` | Unlimited | ✅ |

---

## Local Setup

### Prerequisites
- Node.js 18+
- Supabase project (PostgreSQL)
- Google OAuth credentials
- Stripe account (test mode)

### Environment Variables

```env
NEXT_PUBLIC_URL=
DATABASE_URL=
DIRECT_URL=
AUTH_SECRET=
AUTH_URL=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_PREMIUM_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

### Installation

```bash
git clone https://github.com/yourusername/remotejobs.git
cd remotejobs
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Stripe Webhook (Local)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── saved-jobs/         # Save/unsave toggle
│   │   ├── upload/             # Auth-gated logo upload (EMPLOYER/ADMIN only)
│   │   └── stripe/
│   │       ├── checkout/       # Creates Stripe Checkout session
│   │       └── webhook/        # Handles Stripe subscription events
│   ├── dashboard/              # Employer dashboard + job edit
│   ├── jobs/[slug]/            # Job detail page
│   ├── onboarding/             # Role selection (first sign-in)
│   ├── post-job/               # Post a job form
│   └── saved/                  # Candidate saved jobs
├── components/
│   ├── JobCard.tsx
│   ├── DashboardClient.tsx
│   ├── CreateCompanyForm.tsx
│   ├── PostJobForm.tsx
│   ├── EditJobForm.tsx
│   └── Navbar.tsx
├── lib/
│   ├── prisma.ts
│   ├── supabase.ts
│   └── utils.ts
├── auth.ts                     # NextAuth config + JWT/session callbacks
└── proxy.ts                    # Edge middleware, RBAC enforcement
```

---

## Color Palette

| | Hex |
|---|---|
| Navy | `#1A1A2E` |
| Yellow | `#FFE97D` |
| Yellow Hover | `#FDD835` |

---

## License

MIT
