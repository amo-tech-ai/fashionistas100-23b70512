# AGENTS.md — FashionOS Development Guide

This document is the single source of truth for AI agents and developers working on the FashionOS fashion event management platform. The core value proposition is enabling fashion professionals to create an event in 3 minutes (versus the 3‑day industry standard). Every feature and decision should reinforce that outcome.

---

## Project Overview

- Project Name: FashionOS
- Purpose: Specialized event management for fashion industry professionals with 3‑minute event creation
- Repository: `/home/sk/fashionistas/fashionistas-working`
- GitHub: https://github.com/amo-tech-ai/fashionistas100-23b70512
- Live URL: https://fashionistas100-23b70512.vercel.app
- Backend: https://github.com/amo-tech-ai/fashion-platform-backend

---

## Technical Stack

- Frontend: React 18 + TypeScript + Vite
- UI Components: shadcn/ui + Tailwind CSS
- State Management: Zustand + React Query (TanStack Query)
- Database: Supabase PostgreSQL (Project ID: `vuvfqjhkppmbdeqsflbn`)
- Authentication: Clerk
- Payments: Stripe Connect
- File Storage: Cloudinary
- AI Integration: OpenAI GPT‑4 + CopilotKit
- Automation: n8n + WhatsApp Business API
- Deployment: Vercel
- Testing: Vitest + React Testing Library
- Code Quality: ESLint + Prettier + TypeScript strict mode

---

## Environment Variables

Create `.env` and `.env.local` (do not commit secrets). Template:

```bash
# Supabase
VITE_SUPABASE_URL=https://vuvfqjhkppmbdeqsflbn.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE=your_service_role_key  # server-side only

# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx  # server-side only

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx  # server-side only
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_CONNECT_CLIENT_ID=ca_xxx

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx  # server-side only

# OpenAI
OPENAI_API_KEY=sk-xxx

# WhatsApp Business API
WHATSAPP_BUSINESS_API_TOKEN=EAAGxxx
WHATSAPP_PHONE_NUMBER_ID=xxxx
WHATSAPP_BUSINESS_ACCOUNT_ID=xxxx

# App
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:5173
```

---

## Primary Users

1. Event Organizers – Create fashion shows
2. Fashion Designers – Showcase collections
3. Models – Casting applications
4. Venues – List spaces, manage bookings
5. Vendors – Offer services (catering, production, styling)
6. Sponsors – Find events, track ROI
7. Media – Get accredited, access content
8. Ticket Buyers – Discover and attend events

---

## Key Differentiators

- Fashion‑specific terminology and workflows
- Integrated model casting and designer applications
- Runway lineup management tools
- Fashion week coordination capabilities
- Industry‑standard backstage management

---

## Database Schema (Supabase PostgreSQL)

Notes:
- Users authenticate with Clerk; JWT `sub` must match `users.clerk_id` for RLS.
- JSONB used for flexible fashion‑specific metadata (e.g., measurements, ticket tiers).

```sql
-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Roles and enums
create type user_role as enum (
  'admin','organizer','designer','model','vendor','sponsor','media','buyer'
);

create type event_status as enum ('draft','published','archived');
create type ticket_status as enum ('valid','used','refunded','cancelled');

-- Users
create table if not exists public.users (
  id            uuid primary key default uuid_generate_v4(),
  clerk_id      text unique not null,
  email         text unique not null,
  role          user_role not null default 'buyer',
  profile_data  jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

-- Events
create table if not exists public.events (
  id             uuid primary key default uuid_generate_v4(),
  title          text not null,
  slug           text unique not null,
  type           text not null, -- runway, presentation, showroom, etc.
  status         event_status not null default 'draft',
  organizer_id   uuid not null references public.users(id) on delete cascade,
  venue_id       uuid, -- reference to venues table (future) or external id
  date_time      timestamptz not null,
  capacity       int,
  location       jsonb default '{}'::jsonb, -- address, geo
  ticket_tiers   jsonb not null default '[]'::jsonb, -- [{name, price, qty}]
  description    text,
  media          jsonb not null default '[]'::jsonb,
  metadata       jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Designers
create table if not exists public.designers (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.users(id) on delete cascade,
  brand_name      text not null,
  portfolio_url   text,
  collections     jsonb not null default '[]'::jsonb,
  style_categories text[] default '{}'
);

-- Models
create table if not exists public.models (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.users(id) on delete cascade,
  agency        text,
  measurements  jsonb not null default '{}'::jsonb, -- height, bust, waist, hips, shoe
  portfolio     jsonb not null default '[]'::jsonb, -- images/videos
  hourly_rate   numeric(10,2)
);

-- Tickets
create table if not exists public.tickets (
  id         uuid primary key default uuid_generate_v4(),
  event_id   uuid not null references public.events(id) on delete cascade,
  buyer_id   uuid not null references public.users(id) on delete cascade,
  type       text not null, -- GA, VIP, Press
  price      numeric(10,2) not null,
  qr_code    text, -- data URL or token
  status     ticket_status not null default 'valid',
  created_at timestamptz not null default now()
);

-- Bookings (designer slots, model castings)
create table if not exists public.bookings (
  id           uuid primary key default uuid_generate_v4(),
  event_id     uuid not null references public.events(id) on delete cascade,
  designer_id  uuid references public.designers(id) on delete set null,
  model_ids    uuid[] not null default '{}', -- references public.models(id)
  slot_time    timestamptz not null,
  status       text not null default 'pending',
  notes        text
);

-- Timestamps
create trigger set_timestamp
before update on public.events
for each row execute procedure trigger_set_timestamp();

-- RLS
alter table public.users enable row level security;
alter table public.events enable row level security;
alter table public.designers enable row level security;
alter table public.models enable row level security;
alter table public.tickets enable row level security;
alter table public.bookings enable row level security;

-- Helpers
create or replace function public.is_admin() returns boolean language sql stable as $$
  select exists(
    select 1 from public.users u where u.clerk_id = auth.uid() and u.role = 'admin'
  );
$$;

create or replace function public.current_user_id() returns uuid language sql stable as $$
  select u.id from public.users u where u.clerk_id = auth.uid() limit 1;
$$;

-- USERS policies
create policy users_self_select on public.users
  for select using (
    is_admin() or clerk_id = auth.uid()
  );

create policy users_self_update on public.users
  for update using (clerk_id = auth.uid()) with check (clerk_id = auth.uid());

-- EVENTS policies
create policy events_public_read_published on public.events
  for select using (status = 'published'::event_status);

create policy events_owner_crud on public.events
  for all using (
    exists(
      select 1 from public.users u
      where u.id = organizer_id and u.clerk_id = auth.uid()
    ) or is_admin()
  ) with check (
    exists(
      select 1 from public.users u
      where u.id = organizer_id and u.clerk_id = auth.uid()
    ) or is_admin()
  );

-- DESIGNERS policies
create policy designers_owner_crud on public.designers
  for all using (
    exists(
      select 1 from public.users u where u.id = user_id and u.clerk_id = auth.uid()
    ) or is_admin()
  ) with check (
    exists(
      select 1 from public.users u where u.id = user_id and u.clerk_id = auth.uid()
    ) or is_admin()
  );

-- MODELS policies
create policy models_owner_crud on public.models
  for all using (
    exists(
      select 1 from public.users u where u.id = user_id and u.clerk_id = auth.uid()
    ) or is_admin()
  ) with check (
    exists(
      select 1 from public.users u where u.id = user_id and u.clerk_id = auth.uid()
    ) or is_admin()
  );

-- TICKETS policies
create policy tickets_buyer_read on public.tickets
  for select using (
    buyer_id = public.current_user_id()
    or exists (
      select 1 from public.events e
      join public.users u on u.id = e.organizer_id
      where e.id = tickets.event_id and u.clerk_id = auth.uid()
    )
    or is_admin()
  );

create policy tickets_buyer_create on public.tickets
  for insert with check (buyer_id = public.current_user_id());

create policy tickets_status_update_by_organizer on public.tickets
  for update using (
    exists (
      select 1 from public.events e
      join public.users u on u.id = e.organizer_id
      where e.id = tickets.event_id and u.clerk_id = auth.uid()
    ) or is_admin()
  );

-- BOOKINGS policies
create policy bookings_related_read on public.bookings
  for select using (
    exists (
      select 1 from public.events e
      join public.users u on u.id = e.organizer_id
      where e.id = bookings.event_id and u.clerk_id = auth.uid()
    )
    or exists (
      select 1 from public.designers d
      join public.users u on u.id = d.user_id
      where d.id = bookings.designer_id and u.clerk_id = auth.uid()
    )
    or public.current_user_id() = any(bookings.model_ids)
    or is_admin()
  );

create policy bookings_event_organizer_crud on public.bookings
  for all using (
    exists (
      select 1 from public.events e
      join public.users u on u.id = e.organizer_id
      where e.id = bookings.event_id and u.clerk_id = auth.uid()
    ) or is_admin()
  ) with check (
    exists (
      select 1 from public.events e
      join public.users u on u.id = e.organizer_id
      where e.id = bookings.event_id and u.clerk_id = auth.uid()
    ) or is_admin()
  );
```

---

## Core Features

### 1) Event Creation Wizard (3 minutes total)

Time budget by step:
- Step 1: Basic info (30s)
- Step 2: AI description generation (15s)
- Step 3: Venue selection (30s)
- Step 4: Ticket tiers (45s)
- Step 5: Designer invitations (30s)
- Step 6: Review and publish (30s)

Acceptable UX principles:
- Single-screen steps with minimal fields; keyboard‑first; mobile‑optimized.
- Pre-fill defaults; show inline validation; never block on optional fields.

Example skeleton using shadcn/ui + React Hook Form + React Query:

```tsx
// src/components/features/events/EventWizard.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const schema = z.object({
  title: z.string().min(3),
  dateTime: z.string(),
  venueId: z.string().optional(),
  ticketTiers: z.array(z.object({ name: z.string(), price: z.number(), qty: z.number() })).default([]),
  description: z.string().min(50).max(250),
});

export function EventWizard() {
  const { toast } = useToast();
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { ticketTiers: [] } });
  const createEvent = useMutation({
    mutationFn: async (payload: z.infer<typeof schema>) => fetch('/api/events', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    }).then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); }),
    onSuccess: () => toast({ title: 'Event created' }),
  });

  const onAI = async () => {
    const title = form.getValues('title');
    if (!title) return;
    const res = await fetch(`/api/ai/event-description?title=${encodeURIComponent(title)}`);
    const { description } = await res.json();
    form.setValue('description', description, { shouldValidate: true });
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="grid gap-2">
        <Input placeholder="Show title" {...form.register('title')} />
        <Input type="datetime-local" {...form.register('dateTime')} />
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onAI}>AI description</Button>
        </div>
        <Textarea rows={5} placeholder="150–200 words"
          {...form.register('description')} />
      </div>
      <div className="flex justify-between">
        <Button variant="outline" type="button">Back</Button>
        <Button onClick={form.handleSubmit((v)=>createEvent.mutate(v))} disabled={createEvent.isPending}>Publish</Button>
      </div>
    </Card>
  );
}
```

### 2) Ticketing Engine

- Multiple tiers (GA, VIP, Press) from `events.ticket_tiers`.
- Stripe checkout/session per tier; post‑purchase QR generation.
- Mobile wallet: provide `applePass`/`googlePay` links where possible.

QR code generation example:

```ts
import QRCode from 'qrcode';

export async function createTicketQR(ticketId: string) {
  const url = `${location.origin}/t/${ticketId}`;
  return await QRCode.toDataURL(url, { margin: 1, width: 256 });
}
```

### 3) Discovery & Search

- Filters: type, date, location, price, style; tabs for Grid/List/Map/Calendar.
- AI recommendation endpoint uses embeddings and event/user metadata.

React Query pattern:

```ts
const { data, isLoading, error } = useQuery({
  queryKey: ['events', params],
  queryFn: () => fetch(`/api/events?${new URLSearchParams(params)}`).then(r=>r.json())
});
```

### 4) Analytics Dashboard

- Real‑time via Supabase Realtime channels.
- Revenue, conversion funnel, attendance; post‑event reports.

```ts
import { createClient } from '@supabase/supabase-js';
const sb = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);
sb.channel('events-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, payload => {
  // update metrics store
}).subscribe();
```

---

## UI/UX Standards

- ALWAYS use shadcn/ui components as base
- NEVER build custom UI components from scratch
- ALWAYS include TypeScript types and interfaces
- ALWAYS add loading states for async operations
- ALWAYS implement error boundaries
- ALWAYS ensure mobile‑first responsive design (70% users on mobile)
- ALWAYS follow WCAG 2.1 AA accessibility standards

Loading and error patterns:

```tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ListSkeleton() {
  return <div className="space-y-2">{Array.from({length:4}).map((_,i)=>(<Skeleton key={i} className="h-8 w-full"/>))}</div>;
}

export function ErrorNotice({ title = 'Something went wrong', message }: { title?: string; message?: string; }) {
  return (
    <Alert variant="destructive" role="alert">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message ?? 'Please retry or contact support.'}</AlertDescription>
    </Alert>
  );
}
```

Error boundary wrapper:

```tsx
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary FallbackComponent={({error}) => <ErrorNotice message={error.message}/> }>
  <React.Suspense fallback={<ListSkeleton/>}>
    <EventsPage/>
  </React.Suspense>
  </ErrorBoundary>
```

Accessibility checklist:
- Labels and `aria-*` for form controls
- Color contrast ≥ 4.5:1; keyboard focus styles visible
- Semantic HTML, landmarks, skip links
- Test with screen readers and mobile VoiceOver/TalkBack

---

## Code Patterns and Best Practices

shadcn/ui with TypeScript forms:

```tsx
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type FormValues = { title: string };

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField name="title" control={form.control} render={({ field }) => (
      <FormItem>
        <FormLabel>Title</FormLabel>
        <FormControl><Input placeholder="Runway Show" {...field} /></FormControl>
        <FormMessage />
      </FormItem>
    )}/>
    <Button type="submit">Save</Button>
  </form>
  </Form>
```

API with React Query (retry, stale time):

```ts
const client = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } }
});

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => fetch(`/api/events/${id}`).then(r => r.json())
  });
}
```

Supabase query patterns:

```ts
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

export async function listPublishedEvents() {
  const { data, error } = await supabase.from('events').select('*').eq('status', 'published');
  if (error) throw error;
  return data;
}
```

Authentication checks with Clerk:

```tsx
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';

function Protected({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  );
}

function OrganizerOnly({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;
  if (role !== 'organizer' && role !== 'admin') return <div>Access denied</div>;
  return <>{children}</>;
}
```

Content sanitization (XSS prevention):

```tsx
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirtyHtml, { USE_PROFILES: { html: true } });
<div dangerouslySetInnerHTML={{ __html: clean }} />
```

---

## Performance Requirements

- Page Load: < 2 seconds (TTI on median mobile)
- API Response: < 200ms (p95 for cached reads)
- Lighthouse Score: 90+ (mobile and desktop)
- Bundle Size: < 500KB initial
- 99.9% uptime
- Zero critical bugs at launch

Key tactics:
- Code‑split routes; lazy load heavy modules
- Use React Query caching and pagination
- Optimize images via Cloudinary transforms
- Avoid blocking JS on initial route; prefetch on hover/idle
- Measure with `vite-bundle-visualizer` and Lighthouse CI

---

## Security Requirements

- RLS on all database tables (see schema)
- Input sanitization with DOMPurify
- Rate limiting on API endpoints (e.g., per IP/user)
- HTTPS everywhere; secure cookies; HSTS
- CORS strict to known origins
- File upload validation (type, size, virus scan if backend supports)
- Prevent XSS/SQLi via parameterized queries and escaping

Example Next API rate limiting (token bucket):

```ts
// pseudo-code
const ok = await rateLimiter.consume(`${userId}:${ip}`);
if (!ok) return new Response('Too Many Requests', { status: 429 });
```

---

## Testing Standards

- Unit tests for utilities
- Integration tests for API endpoints
- Component tests with React Testing Library
- E2E tests for critical flows (wizard, checkout)
- Accessibility testing (axe) and keyboard navigation
- Performance testing (Lighthouse, WebPageTest configs)

Vitest + RTL example:

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

it('renders button', () => {
  render(<Button>Publish</Button>);
  expect(screen.getByText('Publish')).toBeInTheDocument();
});
```

---

## AI Integration Details

- OpenAI GPT‑4 for content generation (event descriptions 150–200 words)
- CopilotKit for contextual help and smart suggestions
- AI‑powered search and recommendations (embeddings + filters)
- Natural language event creation

OpenAI route example (server):

```ts
// /api/ai/event-description.ts
import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { title, style } = await req.json();
  const prompt = `Write a concise 150-200 word fashion event description for "${title}" in the style of ${style ?? 'Vogue Runway'}. Emphasize attendees, vibe, and highlights.`;
  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [ { role: 'user', content: prompt } ],
    temperature: 0.7,
  });
  const description = res.choices[0]?.message?.content ?? '';
  return new Response(JSON.stringify({ description }));
}
```

---

## Automation Workflows (n8n)

1. Registration → Email confirm → QR generation → CRM update
2. Purchase → Payment → Ticket delivery → Calendar invite
3. Event creation → Designer invites → Vendor matching
4. Day before → Reminder emails → WhatsApp messages
5. Post‑event → Surveys → Analytics → Payment distribution

Implementation tips:
- Use webhook triggers from Stripe and the app
- Connect Supabase via Postgres or REST nodes
- WhatsApp Business API for reminders and confirmations

---

## File Structure

```text
/src
  /components
    /ui            # shadcn/ui components
    /features      # feature-specific components
  /pages           # route pages
  /hooks           # custom React hooks
  /services        # API services
  /utils           # helper functions
  /types           # TypeScript definitions
  /styles          # global styles
```

---

## Naming Conventions

| Concept            | Convention              | Example              |
|--------------------|------------------------|----------------------|
| Components         | PascalCase             | `EventCard`          |
| Functions          | camelCase              | `handleSubmit`       |
| Constants          | UPPER_SNAKE_CASE       | `MAX_CAPACITY`       |
| Files              | kebab-case             | `event-card.tsx`     |
| Types/Interfaces   | PascalCase with prefix | `IEvent`, `TEventType` |

---

## Daily Workflow Commands

Morning setup:

```bash
git pull --rebase
pnpm i || yarn || npm i
pnpm typecheck || npm run typecheck
pnpm lint || npm run lint
pnpm test -u || npm test
```

Before commit:

```bash
pnpm format && pnpm lint && pnpm test
```

Deploy check:

```bash
pnpm build
# inspect bundle size
pnpm dlx vite-bundle-visualizer dist/stats.html || true
# Lighthouse (requires local serve)
pnpm dlx serve dist -l 4173 &
pnpm dlx lighthouse http://localhost:4173 --preset=desktop --only-categories=performance,accessibility,best-practices,seo
```

---

## Critical Rules

- NEVER skip loading states or error handling
- NEVER use `any` type in TypeScript
- NEVER commit sensitive data
- NEVER deploy without tests
- ALWAYS prioritize 3‑minute event creation
- ALWAYS use shadcn/ui components
- ALWAYS test on mobile
- ALWAYS implement auth checks

---

## Success Metrics

Launch Week (Days 1–7):
- 10+ events created
- 100+ registered users
- 200+ tickets sold
- $2,000 transaction volume

Month 1:
- 50+ active events
- 500+ total users
- 1,000+ tickets sold
- $10,000 revenue

Month 3:
- 200+ monthly events
- 5,000+ active users
- 10,000+ monthly tickets
- $50,000 monthly revenue

---

## Common Issues and Solutions

- TypeScript errors: run `pnpm typecheck`; prefer generics and strict types; avoid `any`.
- Slow performance: audit bundle; lazy load routes; enable React Query caching and pagination; compress images via Cloudinary.
- Missing dependencies: `pnpm i`; verify versions in `package.json`; run `pnpm dedupe`.
- Database connection issues: verify `VITE_SUPABASE_URL` and key; ensure RLS policies align with Clerk `sub` claim; test with SQL snippets in Supabase SQL editor.
- Authentication problems: ensure Clerk publishable/secret keys; verify JWT template passes `sub` to Supabase; check role in `user.publicMetadata.role`.
- Payment integration issues: confirm webhook secret; handle idempotency keys; test in Stripe test mode; verify Connect account status.

---

## Codex Session Configuration

- `/init` for initialization
- `/approvals auto` for development
- `/model gpt-5 high` for complex features
- `/status` to check configuration

---

## Quick Start Actions

1. Check project health
2. Fix critical issues
3. Implement priority features
4. Optimize performance
5. Prepare for deployment

---

## Resources

- Supabase Dashboard: https://app.supabase.com/project/vuvfqjhkppmbdeqsflbn
- shadcn/ui docs: https://ui.shadcn.com
- Clerk docs: https://clerk.com/docs
- Stripe docs: https://stripe.com/docs

---

## Appendix: Stripe Checkout Flow (Sketch)

```ts
// 1) Client: request checkout session for event tier
await fetch('/api/checkout', { method: 'POST', body: JSON.stringify({ eventId, tierId }) });

// 2) Server: create Stripe session, return URL
// 3) Webhook: on checkout.session.completed → create ticket row + QR
// 4) n8n: send email with ticket + calendar invite
```

## Appendix: Map Search (Sketch)

```ts
// Use map tile provider (client) and Supabase for bounding box queries
const { data } = await supabase.rpc('events_in_bbox', { west, south, east, north });
```

Focus on speed to “publish” within 3 minutes. Default sensible values, reduce clicks, and continuously validate with real fashion workflows (runway shows, presentations, castings, fittings, backstage ops).

