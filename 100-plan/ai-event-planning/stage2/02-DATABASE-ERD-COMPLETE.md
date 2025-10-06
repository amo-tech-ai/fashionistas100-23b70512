# Complete Database Entity Relationship Diagram
**Document ID:** 02
**Version:** 1.0
**Last Updated:** January 7, 2025
**Owner:** Database Team
**Status:** 🟢 Approved

---

## 🎯 Purpose
Complete Entity Relationship Diagram (ERD) showing all 32 tables, foreign key relationships, RLS policies, and data flow from Event Wizard to database.

---

## 📊 Overview

The Fashionistas database is built on **Supabase PostgreSQL** with:
- **32 tables** organized into 6 functional domains
- **Row-Level Security (RLS)** on all tables
- **Foreign key constraints** ensuring referential integrity
- **Audit logging** for critical tables (payments, events, bookings)
- **AI-specific tables** for machine learning features

This document provides the complete database schema with visual ERDs for each domain and a master ERD showing all relationships.

---

## 🏗️ Database Architecture Overview

### 1.1 Functional Domains

```mermaid
graph TB
    subgraph "👤 Identity & Auth"
        P[profiles]
        U[users]
        UR[user_roles]
        O[organizations]
    end
    
    subgraph "🎭 Events & Ticketing"
        E[events]
        ET[event_tickets]
        T[tickets]
        B[bookings]
        BT[booking_tickets]
        EB[event_bookings]
    end
    
    subgraph "💳 Payments"
        PAY[payments]
        SC[stripe_customers]
        SS[stripe_subscriptions]
        PAL[payment_audit_log]
        WE[webhook_events]
    end
    
    subgraph "🤖 AI Features"
        EHS[event_health_scores]
        MC[model_castings]
        RS[runway_schedules]
        VR[vendor_recommendations]
        AIR[ai_recommendations]
        AAL[ai_agent_logs]
        AAR[ai_analysis_results]
    end
    
    subgraph "📍 Venues & Assets"
        V[venues]
        A[assets]
        VB[venue_bookings]
    end
    
    subgraph "📊 Analytics & Marketing"
        DM[dashboard_metrics_realtime]
        RA[revenue_analytics]
        EPA[event_performance_analytics]
        EC[email_campaigns]
        EM[email_messages]
        N[notifications]
    end
    
    style P fill:#3b82f6
    style E fill:#10b981
    style PAY fill:#f59e0b
    style EHS fill:#8b5cf6
    style V fill:#06b6d4
    style DM fill:#ec4899
```

---

## 🗂️ Master ERD (All Tables)

### 2.1 Complete Schema Diagram

```mermaid
erDiagram
    profiles ||--o{ events : organizes
    profiles ||--o{ bookings : creates
    profiles ||--o{ event_bookings : creates
    profiles ||--o{ stripe_customers : has
    profiles ||--o{ stripe_subscriptions : subscribes
    profiles ||--o{ notifications : receives
    profiles ||--o{ user_roles : has
    profiles }o--|| organizations : belongs_to
    
    organizations ||--o{ events : hosts
    organizations ||--o{ designers : employs
    organizations ||--o{ event_tickets : sells
    
    events ||--o{ event_tickets : has
    events ||--o{ tickets : generates
    events ||--o{ bookings : receives
    events ||--o{ event_bookings : receives
    events ||--o{ event_health_scores : analyzed_by
    events ||--o{ model_castings : requires
    events ||--o{ runway_schedules : schedules
    events ||--o{ vendor_recommendations : needs
    events }o--|| venues : hosted_at
    
    event_tickets ||--o{ booking_tickets : sold_as
    
    bookings ||--o{ booking_tickets : contains
    bookings ||--o{ payments : requires
    bookings }o--|| profiles : made_by
    
    payments ||--o{ payment_audit_log : tracked_in
    payments }o--|| bookings : for
    
    stripe_customers ||--o{ stripe_subscriptions : has
    
    designers ||--o{ designer_profiles : has
    designers ||--o{ ai_analysis_results : analyzed
    designers ||--o{ tavily_scraping_results : scraped
    
    profiles {
        uuid id PK
        text clerk_id UK
        text user_id UK
        text email
        text first_name
        text last_name
        uuid organization_id FK
        user_role role
        timestamp created_at
    }
    
    events {
        uuid id PK
        uuid organizer_id FK
        uuid organization_id FK
        uuid venue_id FK
        text title
        text description
        event_status status
        timestamp start_datetime
        timestamp end_datetime
        integer capacity
        text slug UK
        timestamp created_at
    }
    
    bookings {
        uuid id PK
        uuid event_id FK
        uuid profile_id FK
        integer total_amount
        text status
        timestamp created_at
    }
    
    payments {
        uuid id PK
        uuid booking_id FK
        integer amount_cents
        text currency
        text payment_method
        text stripe_payment_intent_id
        text idempotency_key UK
        text status
        timestamp created_at
    }
    
    event_health_scores {
        uuid id PK
        uuid event_id FK
        uuid organization_id FK
        integer overall_score
        integer ticket_sales_score
        integer timeline_score
        integer vendor_readiness_score
        integer model_casting_score
        jsonb recommendations
        jsonb risk_factors
        text ai_model
        timestamp created_at
    }
```

---

## 👤 Identity & Auth Domain

### 3.1 User Authentication & Profiles

```mermaid
erDiagram
    profiles ||--o{ user_roles : has
    profiles }o--|| organizations : belongs_to
    profiles ||--o{ notifications : receives
    
    profiles {
        uuid id PK
        text clerk_id UK "Clerk authentication ID"
        text user_id UK "Legacy user ID"
        text email "Email address"
        text first_name
        text last_name
        text avatar_url
        text bio
        text phone
        uuid organization_id FK
        user_role role "attendee|organizer|admin|model|designer|vendor"
        timestamp created_at
        timestamp updated_at
    }
    
    organizations {
        uuid id PK
        text name
        text slug UK
        text description
        text logo_url
        text website_url
        subscription_status subscription_status
        integer max_events
        integer max_users
        timestamp created_at
    }
    
    user_roles {
        uuid id PK
        uuid profile_id FK
        app_role role "admin|organizer|attendee"
        timestamp created_at
    }
    
    notifications {
        uuid id PK
        uuid profile_id FK
        text type
        text title
        text message
        jsonb data
        timestamp read_at
        timestamp created_at
    }
```

### 3.2 RLS Policies (Identity Domain)

| Table | Policy Name | Operation | Logic |
|-------|------------|-----------|-------|
| `profiles` | `profiles_select_owner_or_admin` | SELECT | `clerk_id = auth.jwt()->>'sub' OR has_role('admin')` |
| `profiles` | `profiles_insert_own` | INSERT | `clerk_id = auth.jwt()->>'sub'` |
| `profiles` | `profiles_update_own` | UPDATE | `clerk_id = auth.jwt()->>'sub'` |
| `user_roles` | `user_roles_select_own` | SELECT | `profile_id = current_profile_id()` |
| `user_roles` | `user_roles_insert_admin` | INSERT | `has_role('admin')` |
| `organizations` | `organizations_public_read` | SELECT | `true` (public) |
| `notifications` | `notifications_select_own` | SELECT | `profile_id = user_profile_id()` |

---

## 🎭 Events & Ticketing Domain

### 4.1 Event Management Schema

```mermaid
erDiagram
    events ||--o{ event_tickets : has
    events ||--o{ bookings : receives
    events ||--o{ event_bookings : receives
    events }o--|| venues : hosted_at
    events }o--|| profiles : organized_by
    
    event_tickets ||--o{ booking_tickets : sold_as
    bookings ||--o{ booking_tickets : contains
    
    events {
        uuid id PK
        uuid organizer_id FK
        uuid organization_id FK
        uuid venue_id FK
        text title
        text description
        text slug UK
        event_status status "draft|published|cancelled|completed"
        timestamp start_datetime
        timestamp end_datetime
        integer capacity
        bigint ticket_price
        text currency "COP|USD"
        array tags
        array images
        jsonb metadata
        boolean is_featured
        timestamp created_at
    }
    
    event_tickets {
        uuid id PK
        uuid event_id FK
        uuid organization_id FK
        text name "VIP|General|Student"
        text description
        integer price
        integer quantity
        integer quantity_sold
        event_ticket_status status "active|sold_out|inactive"
        timestamp created_at
    }
    
    bookings {
        uuid id PK
        uuid event_id FK
        uuid profile_id FK
        integer total_amount
        text status "pending|confirmed|cancelled|failed"
        timestamp created_at
        timestamp updated_at
    }
    
    booking_tickets {
        uuid id PK
        uuid booking_id FK
        uuid event_ticket_id FK
        integer quantity
        integer unit_price
        timestamp created_at
    }
    
    tickets {
        uuid id PK
        uuid event_id FK
        uuid booking_ticket_id FK
        text qr_code
        text status "active|used|cancelled"
        integer sold_count
        integer quota
        timestamp used_at
        timestamp created_at
    }
```

### 4.2 Event Lifecycle Flow

```mermaid
stateDiagram-v2
    [*] --> draft: Wizard creates event
    draft --> published: Organizer publishes
    published --> completed: Event ends
    published --> cancelled: Organizer cancels
    completed --> [*]
    cancelled --> [*]
    
    note right of draft
        - Visible only to organizer
        - Can edit all fields
        - No bookings allowed
    end note
    
    note right of published
        - Public on event list
        - Bookings enabled
        - Limited edits (no date change)
    end note
    
    note right of completed
        - Event date passed
        - No new bookings
        - Analytics available
    end note
```

### 4.3 RLS Policies (Events Domain)

| Table | Policy Name | Operation | Logic |
|-------|------------|-----------|-------|
| `events` | `events_public_read` | SELECT | `true` (all events visible) |
| `event_tickets` | `Anyone view tickets` | SELECT | `true` (public ticket info) |
| `bookings` | `bookings_select_owner_admin_organizer` | SELECT | `profile_id = current_profile_id() OR has_role('admin') OR event_id IN (SELECT id FROM events WHERE organizer_id = current_profile_id())` |
| `bookings` | `bookings_insert_own` | INSERT | `profile_id = current_profile_id()` |
| `booking_tickets` | `booking_tickets_select_owner_admin` | SELECT | `booking_id IN (SELECT id FROM bookings WHERE profile_id = current_profile_id()) OR has_role('admin')` |

---

## 💳 Payments Domain

### 5.1 Payment Processing Schema

```mermaid
erDiagram
    payments }o--|| bookings : for
    payments ||--o{ payment_audit_log : tracked_in
    stripe_customers ||--o{ stripe_subscriptions : has
    stripe_customers }o--|| profiles : belongs_to
    
    payments {
        uuid id PK
        uuid booking_id FK
        integer amount_cents
        integer amount_received
        text currency "cop|usd"
        text payment_method "card|pse|nequi"
        text stripe_payment_intent_id
        text stripe_session_id
        text stripe_customer_id
        text customer_email
        text idempotency_key UK
        text status "pending|succeeded|failed|refunded"
        text failure_reason
        timestamp created_at
        timestamp updated_at
    }
    
    payment_audit_log {
        uuid id PK
        uuid payment_id FK
        varchar action "created|status_changed"
        varchar old_status
        varchar new_status
        integer amount_cents
        varchar stripe_payment_intent_id
        varchar idempotency_key
        jsonb metadata
        uuid created_by FK
        timestamp created_at
    }
    
    stripe_customers {
        uuid id PK
        text stripe_customer_id UK
        uuid profile_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    stripe_subscriptions {
        uuid id PK
        text stripe_subscription_id UK
        text stripe_customer_id FK
        uuid profile_id FK
        text status
        timestamp current_period_end
        timestamp created_at
    }
    
    webhook_events {
        uuid id PK
        text stripe_event_id UK
        text event_type
        jsonb raw_payload
        boolean processed
        timestamp processed_at
        text processing_error
        timestamp created_at
    }
```

### 5.2 Payment State Machine

```mermaid
stateDiagram-v2
    [*] --> pending: Payment intent created
    pending --> succeeded: Payment captured
    pending --> failed: Card declined / Error
    succeeded --> refunded: Refund issued
    failed --> pending: User retries
    
    note right of pending
        - Stripe PaymentIntent created
        - Booking status: pending
        - User can retry
    end note
    
    note right of succeeded
        - Payment confirmed
        - Booking status: confirmed
        - Ticket generated with QR code
    end note
    
    note right of failed
        - Log failure_reason
        - Booking status: failed
        - Notify user + organizer
    end note
```

### 5.3 RLS Policies (Payments Domain)

| Table | Policy Name | Operation | Logic |
|-------|------------|-----------|-------|
| `payments` | `payments_select_admin_or_owner` | SELECT | `has_role('admin') OR booking_id IN (SELECT id FROM bookings WHERE profile_id = current_profile_id())` |
| `payments` | `payments_no_insert` | INSERT | `false` (only service role) |
| `payments` | `payments_service_insert` | INSERT | `true` (service role) |
| `stripe_customers` | `stripe_customers_select_own` | SELECT | `profile_id = user_profile_id()` |
| `payment_audit_log` | `audit_log_select_own` | SELECT | `payment_id IN (SELECT id FROM payments WHERE booking_id IN (SELECT id FROM bookings WHERE profile_id = user_profile_id()))` |

---

## 🤖 AI Features Domain

### 6.1 AI Agent Schema

```mermaid
erDiagram
    events ||--o{ event_health_scores : analyzed_by
    events ||--o{ model_castings : requires
    events ||--o{ runway_schedules : schedules
    events ||--o{ vendor_recommendations : needs
    designers ||--o{ ai_analysis_results : analyzed
    profiles ||--o{ ai_recommendations : receives
    
    event_health_scores {
        uuid id PK
        uuid event_id FK
        uuid organization_id FK
        integer overall_score "0-100"
        integer ticket_sales_score
        integer timeline_score
        integer vendor_readiness_score
        integer model_casting_score
        jsonb recommendations
        jsonb risk_factors
        text ai_reasoning
        text ai_model "google/gemini-2.5-flash"
        numeric confidence_score
        text health_status "healthy|at_risk|critical"
        timestamp created_at
    }
    
    model_castings {
        uuid id PK
        uuid event_id FK
        text model_name
        text email
        text phone
        text agency
        text status "invited|confirmed|rejected|cancelled"
        integer ai_match_score "0-100"
        text ai_reasoning
        timestamp responded_at
        timestamp created_at
    }
    
    runway_schedules {
        uuid id PK
        uuid event_id FK
        text schedule_name
        text status "draft|published|finalized"
        integer total_duration_minutes
        jsonb designers
        jsonb transitions
        jsonb backstage_calls
        integer ai_optimization_score
        text ai_reasoning
        timestamp created_at
    }
    
    vendor_recommendations {
        uuid id PK
        uuid event_id FK
        text vendor_name
        text vendor_type "catering|lighting|av|security"
        text contact_name
        text email
        text phone
        text website
        integer estimated_cost_min
        integer estimated_cost_max
        integer ai_match_score
        text ai_reasoning
        jsonb services_offered
        text status "recommended|contacted|quote_received|booked"
        timestamp created_at
    }
    
    ai_agent_logs {
        uuid id PK
        uuid event_id FK
        text agent_type "health_scorer|model_caster|runway_optimizer|vendor_coordinator"
        text model "google/gemini-2.5-flash"
        text operation "analyze|suggest|optimize"
        jsonb input_data
        jsonb output_data
        boolean success
        text error_message
        integer latency_ms
        integer tokens_used
        timestamp created_at
    }
```

### 6.2 AI Agent Trigger Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as Dashboard
    participant Edge as Edge Function
    participant AI as Lovable AI Gateway
    participant DB as Supabase DB

    User->>UI: Views event dashboard
    UI->>Edge: POST /health-score {event_id}
    Edge->>DB: SELECT event + bookings + models
    DB-->>Edge: Event data
    Edge->>AI: Analyze with Gemini 2.5 Flash
    AI-->>Edge: Health score + recommendations
    Edge->>DB: INSERT event_health_scores
    Edge->>DB: INSERT ai_agent_logs
    Edge-->>UI: Return score + UI
    UI->>User: Show health card with 🟢🟡🔴
```

### 6.3 RLS Policies (AI Domain)

| Table | Policy Name | Operation | Logic |
|-------|------------|-----------|-------|
| `event_health_scores` | `event_health_scores_select_organizer` | SELECT | `event_id IN (SELECT id FROM events WHERE organizer_id = current_profile_id())` |
| `event_health_scores` | `event_health_scores_select_admin` | SELECT | `has_role('admin')` |
| `model_castings` | `model_castings_select_organizer` | SELECT | `event_id IN (SELECT id FROM events WHERE organizer_id = current_profile_id())` |
| `runway_schedules` | `runway_schedules_insert_organizer` | INSERT | `event_id IN (SELECT id FROM events WHERE organizer_id = current_profile_id())` |
| `ai_agent_logs` | `ai_agent_logs_service_only` | ALL | `false` (service role only) |

---

## 📍 Venues & Assets Domain

### 7.1 Venue Management Schema

```mermaid
erDiagram
    venues ||--o{ events : hosts
    venues ||--o{ venue_bookings : has
    profiles ||--o{ assets : uploads
    
    venues {
        uuid id PK
        uuid organization_id FK
        text name
        text address
        text city
        text country
        integer capacity
        numeric hourly_rate
        jsonb amenities
        array images
        boolean is_active
        timestamp created_at
    }
    
    venue_bookings {
        uuid id PK
        uuid venue_id FK
        uuid event_id FK
        timestamp start_time
        timestamp end_time
        booking_status status
        integer total_cost
        timestamp created_at
    }
    
    assets {
        uuid id PK
        uuid profile_id FK
        text url "Cloudinary URL"
        text type "image|video|document"
        jsonb metadata
        timestamp created_at
    }
```

---

## 📊 Analytics & Marketing Domain

### 8.1 Dashboard Analytics Schema

```mermaid
erDiagram
    dashboard_metrics_realtime {
        uuid organization_id PK
        timestamp day PK
        bigint events_published
        bigint events_upcoming
        bigint events_completed
        integer tickets_sold
    }
    
    revenue_analytics {
        uuid organization_id PK
        uuid event_id PK
        timestamp day PK
        bigint gross_revenue_cents
        bigint payments_count
    }
    
    event_performance_analytics {
        uuid organization_id PK
        uuid event_id PK
        text title
        event_status status
        timestamp start_datetime
        integer tickets_sold
        integer tickets_quota
        numeric sell_through_rate_pct
    }
```

### 8.2 Email Campaign Schema

```mermaid
erDiagram
    email_campaigns ||--o{ email_messages : sends
    email_campaigns }o--|| organizations : belongs_to
    
    email_campaigns {
        uuid id PK
        uuid organization_id FK
        text name
        text subject
        text content
        text status "draft|scheduled|sent"
        timestamp sent_at
        timestamp created_at
    }
    
    email_messages {
        uuid id PK
        uuid campaign_id FK
        text recipient_email
        text status "pending|sent|opened|clicked|failed"
        timestamp sent_at
        timestamp opened_at
        timestamp clicked_at
        timestamp created_at
    }
```

---

## 🔒 Security & Audit

### 9.1 Audit Logging

```mermaid
erDiagram
    audit_logs {
        uuid id PK
        text table_name
        text operation "INSERT|UPDATE|DELETE"
        uuid record_id
        jsonb old_data
        jsonb new_data
        text user_id
        uuid organization_id
        inet ip_address
        text user_agent
        timestamp created_at
    }
```

### 9.2 Audit Triggers

| Table | Trigger Name | When Fires | What It Logs |
|-------|-------------|------------|--------------|
| `events` | `audit_trigger_function()` | INSERT, UPDATE, DELETE | Full old/new row data |
| `bookings` | `audit_trigger_function()` | INSERT, UPDATE, DELETE | Full old/new row data |
| `payments` | `trigger_payment_audit()` | INSERT, UPDATE (status change) | Status transitions, amounts |

---

## ✅ Data Integrity Checks

### 10.1 Foreign Key Constraints

| Child Table | Column | Parent Table | On Delete |
|------------|--------|--------------|-----------|
| `events` | `organizer_id` | `profiles.id` | CASCADE |
| `events` | `organization_id` | `organizations.id` | CASCADE |
| `bookings` | `event_id` | `events.id` | CASCADE |
| `bookings` | `profile_id` | `profiles.id` | CASCADE |
| `payments` | `booking_id` | `bookings.id` | CASCADE |
| `event_health_scores` | `event_id` | `events.id` | CASCADE |
| `model_castings` | `event_id` | `events.id` | CASCADE |

### 10.2 Unique Constraints

| Table | Columns | Purpose |
|-------|---------|---------|
| `profiles` | `clerk_id` | One profile per Clerk user |
| `profiles` | `user_id` | Legacy user ID uniqueness |
| `events` | `slug` | URL-friendly event identifier |
| `organizations` | `slug` | URL-friendly org identifier |
| `payments` | `idempotency_key` | Prevent duplicate payments |
| `stripe_customers` | `stripe_customer_id` | One Stripe customer per user |

---

## 🔗 Related Code Files

### Migration Files
- `supabase/migrations/` (all migration files)

### Database Types
- `src/integrations/supabase/types.ts` (auto-generated from schema)

### Edge Functions (Database Interactions)
- `supabase/functions/event-publish/index.ts` (🔴 To be created)
- `supabase/functions/health-score/index.ts` (🟢 Working)
- `supabase/functions/stripe-webhook/index.ts` (🟢 Working)

---

## 📝 Schema Evolution Notes

### Recent Changes
- ✅ Added `event_health_scores` table (Dec 2024)
- ✅ Added `ai_agent_logs` table (Dec 2024)
- ✅ Migrated from `auth.users` to `profiles` table (Nov 2024)
- ✅ Added `idempotency_key` to payments (Nov 2024)

### Pending Changes
- 🔴 Add `wizard_sessions` table for resume functionality
- 🔴 Add `event_collaborators` for multi-organizer support
- 🟡 Add `discount_codes` for promotional campaigns

---

**Document Complete** ✅
**Next Document**: `03-USER-JOURNEY-MARIA-ORGANIZER.md`
