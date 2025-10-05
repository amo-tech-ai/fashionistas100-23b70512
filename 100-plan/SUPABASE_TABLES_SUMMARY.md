# Supabase Tables Summary

## Overview
This document provides a comprehensive summary of all 41 tables in the Fashionistas platform database.

---

## Table Categories

### 🔐 Authentication & Authorization (3 tables)
- **profiles** - User profiles linked to Clerk authentication
- **user_roles** - Role assignments (admin, moderator, organizer, attendee)
- **users** - Legacy/view table (Unrestricted)

### 🎫 Events & Ticketing (6 tables)
- **events** - Core event information (public read)
- **event_tickets** - Ticket tiers and availability
- **event_bookings** - Event attendance bookings
- **booking_tickets** - Individual ticket instances
- **bookings** - General booking records
- **tickets** - Ticket QR codes and usage tracking

### 🏢 Organizations (1 table)
- **organizations** - Multi-tenant organization data

### 💰 Payments & Revenue (5 tables)
- **payments** - Payment records (service role only for write)
- **payment_audit_log** - Immutable payment audit trail
- **stripe_customers** - Stripe customer mapping
- **stripe_subscriptions** - Subscription status
- **webhook_events** - Stripe webhook processing log

### 📍 Venues (2 tables)
- **venues** - Venue information and availability
- **venue_bookings** - Venue reservation records

### 👤 User Features (8 tables)
- **models** - Fashion model profiles
- **designers** - Designer profiles and portfolios
- **designer_profiles** - Extended designer information
- **notifications** - User notifications
- **whatsapp_contacts** - WhatsApp integration contacts
- **whatsapp_messages** - WhatsApp message logs
- **assets** - User-uploaded assets
- **public_profiles** - Public-facing profile view (Unrestricted)

### 📧 Marketing & Communication (2 tables)
- **email_campaigns** - Email marketing campaigns
- **email_messages** - Individual email delivery tracking

### 🤖 AI & Analytics (3 tables)
- **ai_analysis_results** - AI processing results for designers
- **ai_recommendations** - AI-generated recommendations
- **tavily_scraping_results** - Web scraping results for designer onboarding

### 🧙 Wizard System (3 tables)
- **wizard_sessions** - Event creation wizard state
- **wizard_actions** - Wizard action audit log
- **wizard_interactions** - Wizard AI interaction history

### 📊 Analytics & Reporting (4 tables)
- **dashboard_analytics** - Materialized view for dashboard metrics (Unrestricted, SECURITY DEFINER function access)
- **dashboard_metrics_realtime** - Real-time dashboard data view
- **event_performance_analytics** - Event performance metrics view
- **revenue_analytics** - Revenue tracking view
- **rls_performance** - RLS policy performance monitoring

### 🔍 Audit & Logging (1 table)
- **audit_logs** - System-wide audit trail

---

## Security Model

### Unrestricted Tables (3)
These tables have public read access:
- **dashboard_analytics** - Protected by SECURITY DEFINER function
- **public_profiles** - Public profile information only
- **users** - Legacy view table

### Service Role Tables (3)
Write operations restricted to service role:
- **payments** - Payment processing only via edge functions
- **audit_logs** - System audit logging
- **webhook_events** - Webhook processing

### User-Scoped Tables (35)
Majority of tables use RLS policies with:
- **Own data access** - Users can CRUD their own records
- **Organization scoping** - Organization members can access shared data
- **Role-based access** - Admin/organizer elevated privileges

---

## Key Design Patterns

### 1. **Multi-Tenant Architecture**
- All core tables include `organization_id`
- RLS policies enforce organization boundaries
- Enables SaaS multi-org deployment

### 2. **Role-Based Access Control (RBAC)**
- Separate `user_roles` table (prevents privilege escalation)
- `has_role()` SECURITY DEFINER function
- Roles: admin, moderator, organizer, attendee

### 3. **Audit Trail**
- Immutable audit tables: `audit_logs`, `payment_audit_log`, `wizard_actions`
- No UPDATE/DELETE policies on audit tables
- Comprehensive tracking of sensitive operations

### 4. **Idempotency**
- `payments.idempotency_key` prevents duplicate charges
- `webhook_events.stripe_event_id` prevents duplicate processing
- Edge function idempotency keys for wizard actions

### 5. **Soft Deletes & Status Tracking**
- Status enums: `event_status`, `booking_status`, `event_ticket_status`
- `is_active`, `is_available` flags instead of hard deletes
- Maintains referential integrity

---

## Common Columns

### Standard Timestamps
- `created_at` (default: `now()`)
- `updated_at` (auto-updated via trigger)

### Standard Identifiers
- `id` (UUID, `gen_random_uuid()`)
- `organization_id` (UUID, for multi-tenancy)
- `profile_id` / `user_id` (for user ownership)

### Common JSONB Fields
- `metadata` - Flexible additional data
- `data` - Structured data storage
- Various `*_data` fields for wizard stages

---

## Foreign Key Relationships

### User Identity Chain
```
auth.users (Supabase managed)
  └─> profiles.user_id (Clerk integration)
      ├─> user_roles.profile_id
      ├─> bookings.profile_id
      ├─> assets.profile_id
      └─> [many other tables]
```

### Event Flow
```
organizations
  └─> events.organization_id
      ├─> event_tickets.event_id
      │   └─> booking_tickets.event_ticket_id
      └─> event_bookings.event_id
          └─> payments.booking_id
```

### Venue Booking Flow
```
venues
  └─> venue_bookings.venue_id
      └─> events.venue_id
```

---

## Performance Optimizations

### Materialized Views
- `dashboard_analytics` - Pre-aggregated metrics (refresh required)

### Indexes
- All foreign keys indexed
- `events.slug`, `organizations.slug` for SEO-friendly URLs
- `payments.idempotency_key`, `payments.stripe_payment_intent_id`
- `profiles.clerk_id` for authentication lookups

### JSONB Queries
- Efficient nested data storage
- Wizard session data partitioned by stage
- Event metadata for flexible attributes

---

## Colombian Market Specifics

### Currency Support
- Default currency: `COP` (Colombian Peso)
- `events.currency` field supports multi-currency
- `payments.amount_cents` stores integer values

### Communication Integrations
- WhatsApp tables for preferred local communication
- Email campaigns for marketing
- Phone number validation with international format

---

## Migration Status

### Recent Fixes (Plan 100)
✅ All 8 production readiness stages completed:
1. Database structure verified
2. RLS policies audited and fixed
3. Permission escalation vulnerabilities resolved
4. Admin check implementations secured
5. Function security reviewed
6. Payment system hardened
7. Materialized view secured with SECURITY DEFINER function
8. Security invoker enabled on all views

### Outstanding Items
- Test data population for development
- Performance benchmarking under load
- Backup/restore procedures documentation

---

## Security Considerations

### ✅ Implemented
- Row Level Security enabled on all user-facing tables
- Service role restrictions on sensitive operations
- SECURITY DEFINER functions for safe privilege checks
- Audit logging on critical tables
- Idempotency keys for payment operations
- Separate user_roles table prevents privilege escalation

### ⚠️ Monitor
- Webhook event processing failures
- Payment reconciliation mismatches
- RLS policy performance on large datasets
- Materialized view refresh frequency

---

## Database Functions Inventory

### Security & Auth
- `has_role(_role)` - Role checking
- `current_profile_id()` - Get current user profile
- `safe_user_org_id()` - Safe organization ID retrieval
- `jwt_sub()`, `clerk_user_id()` - JWT claim extraction

### Event Management
- `get_event_stats(event_uuid)` - Event statistics
- `get_available_venues(...)` - Available venue search
- `generate_event_slug()` - Auto slug generation

### Payment Processing
- `handle_payment_intent_succeeded(payload)`
- `handle_payment_intent_failed(payload)`
- `handle_checkout_session_completed(payload)`
- `process_stripe_webhook(...)` - Webhook orchestration
- `log_payment_audit(...)` - Payment audit logging
- `process_payment_idempotent(...)` - Safe payment processing

### Analytics
- `get_dashboard_metrics(org_id)` - Organization metrics
- `get_dashboard_analytics()` - Secure analytics access
- `refresh_dashboard_analytics()` - Materialized view refresh

### Wizard System
- `calculate_wizard_completion(session_id)` - Progress tracking

### Designer AI Features
- `process_designer_onboarding_ai(...)` - AI-powered onboarding
- `generate_designer_content_ai(...)` - AI content generation
- `scrape_designer_sources_tavily(...)` - Web scraping

---

## Next Steps

1. **Data Seeding**: Create seed scripts for development/staging
2. **Performance Testing**: Load test event booking flow
3. **Backup Strategy**: Implement automated backups
4. **Monitoring**: Set up alerting for failed webhooks and payment issues
5. **Documentation**: API documentation for edge function integrations

---

*Last Updated: 2025-10-05*  
*Database Version: PostgreSQL 15 (Supabase)*  
*Total Tables: 41*
