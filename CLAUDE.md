# FashionOS - AI-Powered Fashion Events Platform

**Version**: 1.0.0
**Last Updated**: 2025-10-01
**Project Type**: Multi-tenant SaaS Platform for Fashion Events Management

---

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Coding Standards](#coding-standards)
- [Key Workflows](#key-workflows)
- [Development Commands](#development-commands)
- [Deployment](#deployment)
- [Best Practices](#best-practices)

---

## 📋 Project Overview

### Mission
Transform fashion event management from a 3-day process into a 3-minute automated workflow through AI-powered tools, connecting event organizers, designers, models, venues, sponsors, and attendees in one unified marketplace.

### Value Proposition
- ⚡ **10x faster** event creation vs industry standard
- 🎯 **Fashion-specific** workflows (runway management, model casting, designer portfolios)
- 🤖 **AI-powered** content generation and event planning
- 💰 **Integrated payments** with Stripe Connect
- 📊 **Real-time analytics** for data-driven decisions
- 🌎 **Colombian market focus** with WhatsApp and Instagram integration

### Target Market
Colombian fashion industry with emphasis on:
- WhatsApp Business API integration for notifications
- Instagram content capture and social auth
- Multi-vendor fashion designer marketplace
- Media production services (photography, video for ecommerce/social media)

### Key Stakeholders
1. **Admins** - Platform administrators
2. **Organizers** - Event creators and managers
3. **Designers** - Fashion designers showcasing collections
4. **Models** - Talent for runway and photoshoots
5. **Venues** - Event spaces and locations
6. **Sponsors** - Brand partners with ROI tracking
7. **Attendees** - Ticket buyers and event participants
8. **Vendors** - Service providers (media, production)

---

## 🏗️ Architecture

### Frontend Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5 with SWC
- **Routing**: React Router DOM v6
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 3 + CSS Variables
- **Forms**: React Hook Form + Zod validation
- **State Management**: TanStack Query (React Query)
- **Authentication**: Clerk (social auth + user management)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion

### Backend & Database
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth + Clerk integration
- **Storage**: Supabase Storage + Cloudinary
- **Edge Functions**: Supabase Functions (Deno)
- **Real-time**: Supabase Realtime subscriptions
- **Vector DB**: Qdrant Cloud (AI embeddings)

### AI & Automation
- **AI Orchestration**: CopilotKit (state machine for event wizard)
- **Agent Framework**: CrewAI (multi-agent workflows)
- **Workflow Automation**: Mastra + n8n
- **LLM Providers**: OpenAI, Anthropic (Claude), Perplexity, Groq
- **Search**: Tavily API (web crawling and search)
- **Web Scraping**: Firecrawl (social media content capture)

### Payments & Commerce
- **Payment Gateway**: Stripe
- **Integration Type**: Stripe Connect (platform model)
- **Webhooks**: Supabase Edge Functions
- **Features**: Checkout, Payment Intents, Refunds, Disputes

### Media & Assets
- **Image/Video Storage**: Cloudinary
- **Asset Management**: Cloudinary transformations and optimization
- **CDN**: Cloudinary CDN + Vercel Edge Network

### DevOps & Deployment
- **Hosting**: Vercel (Frontend + Edge Functions)
- **CI/CD**: GitHub Actions + Vercel auto-deploy
- **Package Manager**: pnpm (primary), npm (fallback)
- **Monitoring**: Sentry
- **Email**: SendGrid

---

## 🗄️ Database Schema

### Core Philosophy
- **Multi-tenant** architecture via `organization_id`
- **Snake_case** naming convention for all tables and columns
- **Row Level Security (RLS)** enabled on ALL tables
- **Soft deletes** preferred over hard deletes where applicable
- **Audit timestamps**: `created_at`, `updated_at` on all tables
- **JSONB** for flexible metadata fields

### Key Tables

#### Organizations & Users
```sql
-- Multi-tenant organizations
organizations (id, name, slug, subscription_tier, settings, created_at, updated_at)

-- User profiles (extends auth.users)
profiles (id, email, full_name, avatar_url, phone, bio, social_links, preferences)

-- User roles within organizations (many-to-many)
user_roles (id, user_id, organization_id, role, permissions, is_active)
  -- role ENUM: admin, organizer, staff, sponsor, designer, model, attendee, vendor, media
```

#### Events
```sql
-- Core events table
events (
  id, organization_id, venue_id, organizer_id,
  title, slug, description, event_type, category, status,
  starts_at, ends_at, timezone, capacity,
  ticket_tiers JSONB, pricing JSONB, requirements JSONB,
  media JSONB, metadata JSONB, is_featured
)
  -- status ENUM: draft, published, active, completed, cancelled, archived

-- Ticket types for events
tickets (
  id, event_id, name, description,
  price, currency, quantity_available, quantity_sold,
  tier_type, benefits JSONB, is_active,
  sales_start_at, sales_end_at
)

-- Purchased tickets
bookings (
  id, organization_id, event_id, ticket_id, buyer_id,
  booking_reference, quantity, unit_price, total_amount, currency,
  status, payment_method, payment_intent_id, voucher_code,
  qr_code, checked_in_at
)
  -- status ENUM: pending, confirmed, cancelled, refunded, no_show, completed
```

#### Venues
```sql
venues (
  id, organization_id, name, slug, description,
  capacity, base_price, currency, amenities JSONB,
  location JSONB, contact_info JSONB, images JSONB,
  availability JSONB, is_active
)
```

#### Fashion Entities
```sql
-- Fashion designers
designers (
  id, organization_id, user_id, brand_name, portfolio_url, bio,
  specializations TEXT[], collections JSONB, social_media JSONB,
  is_verified, is_featured
)

-- Models
models (
  id, organization_id, user_id, agency,
  measurements JSONB, portfolio JSONB, specialties TEXT[],
  hourly_rate, availability JSONB, experience_level,
  is_verified, is_featured
)
```

### RLS Policies

**Security Philosophy**: Deny by default, explicit grants

**Helper Functions**:
```sql
current_user_org_id()                    -- Get user's primary org
user_has_role(user_id, org_id, role)    -- Check role membership
is_admin()                               -- Check if user is admin
```

**Policy Patterns**:
1. **Read Policies**: Users see own org data OR public data (for events, assets)
2. **Write Policies**: Organizers/Admins only within own org
3. **Tenant Isolation**: All queries filtered by `organization_id`
4. **Public Data**: Events with `status='published'` are publicly readable

**Example Policy**:
```sql
-- Events select policy
CREATE POLICY "Events select policy" ON events
  FOR SELECT USING (
    is_admin() OR
    organization_id = current_user_org_id() OR
    status = 'published'
  );
```

### Analytics Views
```sql
-- Pre-aggregated views for dashboard performance
v_dashboard_kpis          -- Key metrics per organization
v_popular_events          -- Events by booking count
v_booking_categories      -- Breakdown by event category
v_financial_kpis          -- Revenue, profit margins
v_venue_performance       -- Venue utilization and revenue
v_model_stats             -- Model performance metrics
v_designer_stats          -- Designer participation
```

---

## 💻 Coding Standards

### TypeScript Conventions

**File Organization**:
```
src/
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui primitives
│   └── [feature]/   # Feature-specific components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configs
├── pages/           # Route components
│   ├── dashboard/   # Protected dashboard pages
│   ├── auth/        # Sign in/up pages
│   └── services/    # Service detail pages
├── services/        # API/business logic
├── integrations/    # Third-party integrations
│   └── supabase/
├── types/           # TypeScript type definitions
└── utils/           # Helper utilities
```

**Naming Conventions**:
- **Components**: PascalCase (e.g., `EventCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useEventData.ts`)
- **Utilities**: camelCase (e.g., `formatCurrency.ts`)
- **Types**: PascalCase (e.g., `EventType`, `BookingStatus`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DASHBOARD_ACCESS`)

**Component Structure**:
```typescript
import { FC } from 'react';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: EventType;
  onSelect?: (id: string) => void;
  className?: string;
}

export const EventCard: FC<EventCardProps> = ({
  event,
  onSelect,
  className
}) => {
  return (
    <div className={cn("rounded-lg border p-4", className)}>
      {/* Component content */}
    </div>
  );
};
```

**Supabase Query Patterns**:
```typescript
// Always use TypeScript types from generated schema
import { Database } from '@/integrations/supabase/types';

type Event = Database['public']['Tables']['events']['Row'];

// Use React Query for data fetching
const { data: events, isLoading, error } = useQuery({
  queryKey: ['events', { organizationId }],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('organization_id', organizationId)
      .order('starts_at', { ascending: true });

    if (error) throw error;
    return data as Event[];
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### SQL Conventions

**Migration Files**: Located in `supabase/migrations/`
- Naming: `YYYYMMDDHHMMSS_descriptive_name.sql`
- Always include rollback statements in comments
- Test migrations locally before deploying

**Schema Naming**:
- Tables: `snake_case`, plural (e.g., `events`, `user_roles`)
- Columns: `snake_case` (e.g., `created_at`, `organization_id`)
- Foreign keys: `{table}_id` (e.g., `event_id`, `venue_id`)
- Enums: Singular noun (e.g., `user_role`, `event_status`)
- Indexes: `idx_{table}_{column}` (e.g., `idx_events_org_id`)

**RLS Policy Naming**:
```sql
"{Table} {operation} policy"
-- Examples:
"Events select policy"
"Bookings insert policy"
"Venues update policy"
```

### UI/UX Design Rules

**Mobile-First Approach**:
- Design for mobile (320px+) first
- Tablet breakpoint: 768px
- Desktop breakpoint: 1024px
- Large desktop: 1280px+

**Accessibility (WCAG 2.1 AA)**:
- All interactive elements keyboard accessible
- Proper ARIA labels on custom components
- Color contrast ratio ≥ 4.5:1 for text
- Focus indicators visible
- Screen reader friendly

---

## 🔄 Key Workflows

### 1. Event Creation Wizard (CopilotKit State Machine)

**State Flow**:
```
welcome → event_basics → venue → schedule →
ticketing → payments → review_publish → promotion →
live_ops → post_event → done
```

**States**:
- `welcome`: Introduction and event type selection
- `event_basics`: Title, description, dates, timezone
- `venue`: Physical or virtual venue selection
- `schedule`: Session creation with start/end times
- `ticketing`: Ticket tiers (name, price, quantity, sales window)
- `payments`: Stripe Connect onboarding
- `review_publish`: Final review and publish toggle
- `promotion`: Marketing and social media setup
- `live_ops`: Day-of event management
- `post_event`: Analytics and recap
- `error`: Error recovery with retry/save draft

**Autosave**: Triggered on every `NEXT` transition to `wizard_states` table

**Success Criteria**:
- Wizard completion < 3 minutes (happy path)
- p95 latency < 800ms per step
- Completion rate ≥ 80%

### 2. Ticket Purchase Flow

**Steps**:
1. User browses events on `/events`
2. Clicks event → views `/events/:id`
3. Selects ticket tier and quantity
4. Redirects to Stripe Checkout
5. Completes payment
6. Stripe webhook updates `bookings` table
7. User receives confirmation email with QR code
8. QR code stored in `bookings.qr_code`

**Webhook Handler**: `/supabase/functions/stripe-webhook/index.ts`
- Verifies Stripe signature
- Idempotent processing (checks `payment_logs` table)
- Updates `bookings` and `transactions` tables

### 3. Designer Onboarding

**Steps**:
1. User signs up with Clerk
2. Selects "Designer" role during onboarding
3. Creates designer profile (brand name, bio, portfolio URL)
4. Uploads collection images to gallery
5. Tavily scrapes social media and website for additional content
6. AI analyzes portfolio and suggests tags
7. Admin reviews and sets `is_verified=true`
8. Designer appears in `/designers` directory

### 4. Sponsor ROI Tracking

**Flow**:
1. Organizer creates event
2. Adds sponsor packages with pricing tiers
3. Sponsor commits to package via dashboard
4. System tracks: impressions, social mentions, lead generation, content
5. Post-event ROI dashboard shows metrics

---

## 🔧 Development Commands

### Frontend (Vite + React)

```bash
# Development
pnpm dev                  # Start dev server (http://localhost:8080)
pnpm build                # Production build
pnpm preview              # Preview production build

# Code Quality
pnpm lint                 # ESLint check
pnpm test                 # Run Vitest tests
pnpm test:ui              # Vitest UI mode
pnpm test:coverage        # Coverage report
```

### Supabase

```bash
# Local Development
supabase start            # Start local Supabase (Docker)
supabase stop             # Stop local instance
supabase db reset         # Reset local DB to migrations

# Migrations
supabase migration new <name>           # Create new migration
supabase db push                        # Push local changes to remote

# Functions
supabase functions new <name>           # Create new Edge Function
supabase functions serve                # Run functions locally
supabase functions deploy <name>        # Deploy to remote

# Types
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

### Stripe CLI (Testing Webhooks)

```bash
# Forward webhooks to local server
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook

# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger charge.refunded
```

---

## 🚀 Deployment

### Environment Variables

**Production (.env.production)**:
```bash
# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...

# Supabase
VITE_SUPABASE_URL=https://qydcfiufcoztzymedtbo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_ACCESS_TOKEN=sbp_...

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=dzqy2ixl0
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# AI Services
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
TAVILY_API_KEY=tvly-...
COPILOT_API_KEY=ck_pub_...

# Qdrant
QDRANT_URL=https://...gcp.cloud.qdrant.io
QDRANT_API_KEY=eyJ...
```

**Never commit**: `.env`, `.env.local`, `.env.production`

### Vercel Deployment

**Setup**:
1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Configure build settings:
   - Framework: Vite
   - Build command: `pnpm build`
   - Output directory: `dist`
   - Install command: `pnpm install`

### Supabase Production Setup

**Database**:
1. Create project at supabase.com
2. Run migrations: `supabase db push`
3. Enable RLS on all tables
4. Configure connection pooling (PgBouncer)

**Edge Functions**:
```bash
# Deploy webhook handlers
supabase functions deploy stripe-webhook
supabase functions deploy clerk-webhook
```

**Secrets** (for Edge Functions):
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## ✅ Best Practices

### Security

**Authentication**:
- Clerk handles auth, Supabase handles authorization
- JWT tokens validated on every request
- Social OAuth: Instagram, WhatsApp, Google

**RLS Policies**:
```sql
-- ALWAYS deny by default
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Explicit grants only
CREATE POLICY "Users see own org events" ON events
  FOR SELECT USING (organization_id = current_user_org_id());
```

**Input Validation**:
```typescript
// Client-side validation with Zod
const eventSchema = z.object({
  title: z.string().min(3).max(200),
  starts_at: z.string().datetime(),
  capacity: z.number().int().positive(),
});
```

### Performance

**Database Optimization**:
- Use indexes on frequently queried columns
- Materialize complex views
- Use `select()` with specific columns, not `select('*')`
- Implement pagination with `range()`

**React Query Optimization**:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      cacheTime: 10 * 60 * 1000,     // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
```

**Code Splitting**:
```typescript
// Lazy load routes
const EventDetail = lazy(() => import('./pages/EventDetail'));

// Wrap in Suspense
<Suspense fallback={<LoadingSkeleton />}>
  <Routes>
    <Route path="/events/:id" element={<EventDetail />} />
  </Routes>
</Suspense>
```

### Error Handling

**Client-Side**:
```typescript
import { toast } from 'sonner';

try {
  await updateEvent(eventId, data);
  toast.success('Event updated successfully');
} catch (error) {
  console.error('Update failed:', error);
  toast.error('Failed to update event. Please try again.');
}
```

**Server-Side** (Edge Functions):
```typescript
try {
  const result = await processPayment(paymentIntent);
  return new Response(JSON.stringify(result), { status: 200 });
} catch (error) {
  console.error('Payment processing failed:', error);
  return new Response(JSON.stringify({
    error: 'Payment processing failed',
    message: error.message
  }), { status: 500 });
}
```

---

## 🚨 Critical Reminders

1. **NEVER disable RLS** on production tables
2. **ALWAYS validate user input** on both client and server
3. **NEVER expose API keys** in client-side code
4. **ALWAYS use transactions** for multi-table updates
5. **NEVER trust client-side timestamps** - use `now()` in SQL
6. **ALWAYS handle Stripe webhook idempotency**
7. **NEVER commit** `.env` files to git
8. **ALWAYS test migrations** locally before deploying
9. **NEVER use `SELECT *`** - specify columns explicitly
10. **ALWAYS provide loading states** for async operations

---

**Last Updated**: 2025-10-01
**Maintainer**: Development Team

---
# Claude Code Instructions

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
	
*This CLAUDE.md file is the authoritative source of truth for the FashionOS codebase.*
