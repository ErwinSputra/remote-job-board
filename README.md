# RemoteJobs

A full-stack remote job board web application built with Next.js, Supabase, and Stripe.

---

## Tech Stack

| Layer         | Technology                                                  |
| ------------- | ----------------------------------------------------------- |
| Framework     | Next.js 16.2.6 (App Router)                                 |
| Database      | PostgreSQL via Supabase                                     |
| ORM           | Prisma 7.8.0 (adapter-pg)                                   |
| Auth          | NextAuth v5 beta (`next-auth@5.0.0-beta.31`) — Google OAuth |
| Payments      | Stripe (Test Mode)                                          |
| Styling       | Tailwind CSS v4                                             |
| UI Components | shadcn/ui + lucide-react                                    |
| Toasts        | sonner                                                      |
| Runtime       | Node.js                                                     |

---

## Features

### For Candidates

- Browse remote jobs with keyword, job type, and experience level search
- Filter jobs by category pills
- View full job detail with company info and similar jobs sidebar
- Bookmark / save jobs
- Saved jobs page

### For Employers

- Google OAuth sign-in with role selection onboarding
- Create and manage company profile
- Post jobs (FREE plan: max 3 jobs)
- Edit and delete job postings
- Stripe Checkout session for upgrading to PREMIUM
- Unlimited featured job postings on PREMIUM plan
- Employer dashboard with job management and company editing

### General

- Featured jobs section (PREMIUM perk)
- Company profile pages
- Role-based routing and access control via `proxy.ts`
- Stripe webhook for subscription management
- SEO metadata on all pages
- Custom error, loading, and 404 pages

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (PostgreSQL)
- A Google OAuth app
- A Stripe account (test mode)

### Installation

```bash
git clone https://github.com/yourusername/remotejobs.git
cd remotejobs
npm install
```

### Environment Variables

Create a `.env` file in the root with the following:

```env
# General / App URL
NEXT_PUBLIC_URL="http://localhost:3000"

# Supabase / PostgreSQL
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
AUTH_SECRET="your-auth-secret"
AUTH_URL="http://localhost:3000"

# Google OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_PREMIUM_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
```

### Run Locally

```bash
npm run dev
```

App runs at `http://localhost:3000`.

### Stripe Webhook (Local Development)

To test Stripe webhooks locally, use the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Employers are redirected to a Stripe Checkout session created at `/api/stripe/checkout`. On success, the webhook at `/api/stripe/webhook` upgrades their subscription to `PREMIUM_POSTER`.

The webhook handles:

- `checkout.session.completed` → upgrades user to `PREMIUM_POSTER`
- `customer.subscription.deleted` → downgrades user back to `FREE`

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage — job listings
│   ├── layout.tsx                  # Root layout + global metadata
│   ├── error.tsx                   # Error boundary page
│   ├── loading.tsx                 # Loading UI
│   ├── not-found.tsx               # 404 page
│   ├── globals.css                 # Global styles
│   ├── api/
│   │   ├── auth/                   # NextAuth handlers
│   │   ├── companies/              # Company API routes
│   │   ├── jobs/                   # Job CRUD API
│   │   ├── saved-jobs/             # Save/unsave job API
│   │   ├── subscription/           # Subscription status API
│   │   └── stripe/
│   │       ├── checkout/           # Creates Stripe Checkout session
│   │       └── webhook/            # Handles Stripe events
│   ├── companies/
│   │   ├── [slug]/                 # Company profile page
│   │   └── create/                 # Create company form (new employers)
│   ├── dashboard/                  # Employer dashboard
│   │   └── jobs/[id]/edit/         # Edit job page
│   ├── jobs/
│   │   └── [slug]/                 # Job detail page
│   ├── onboarding/                 # Role selection after first sign-in
│   ├── post-job/                   # Post a job form
│   ├── saved/                      # Candidate saved jobs
│   ├── testing/                    # Testing routes
│   └── upgrade/                    # Upgrade to premium page
├── components/
│   ├── AuthButton.tsx
│   ├── BookmarkButton.tsx
│   ├── CategoryPills.tsx
│   ├── CreateCompanyForm.tsx
│   ├── DashboardClient.tsx
│   ├── EditJobForm.tsx
│   ├── JobCard.tsx
│   ├── MobileMenu.tsx
│   ├── Navbar.tsx
│   ├── OnboardingCards.tsx
│   ├── PostJobForm.tsx
│   ├── SearchBar.tsx
│   └── UpgradeButton.tsx
├── lib/
│   ├── categories.ts               # Standardized job category list
│   ├── prisma.ts                   # Prisma client
│   └── utils.ts                    # Helpers (formatSalary, etc.)
├── types/
│   ├── next-auth.d.ts              # NextAuth type extensions
├── auth.ts                         # NextAuth config
└── proxy.ts                        # Route protection middleware
```

---

## User Roles

| Role        | Access                                            |
| ----------- | ------------------------------------------------- |
| `null`      | New user — redirected to `/onboarding`            |
| `CANDIDATE` | Can browse, search, and save jobs                 |
| `EMPLOYER`  | Can post jobs, manage company, upgrade to premium |
| `ADMIN`     | Full access to all routes                         |

---

## Subscription Plans

| Plan             | Job Posts | Featured |
| ---------------- | --------- | -------- |
| `FREE`           | Max 3     | ❌       |
| `PREMIUM_POSTER` | Unlimited | ✅       |

---

## Color Palette

| Name         | Hex       |
| ------------ | --------- |
| Navy         | `#1A1A2E` |
| Yellow       | `#FFE97D` |
| Yellow Hover | `#FDD835` |

---

## Deployment

This project is designed to deploy on **Vercel**. When deploying:

1. Add all environment variables from `.env` to your Vercel project settings
2. Set both `NEXT_PUBLIC_URL` and `AUTH_URL` to your production domain (e.g., `https://yourdomain.com`)
3. Update `metadataBase` in `src/app/layout.tsx` to your production domain
4. Set up your Stripe webhook endpoint in the Stripe dashboard pointing to `https://yourdomain.com/api/stripe/webhook`
5. Run `npx prisma generate` as part of your build command if needed
