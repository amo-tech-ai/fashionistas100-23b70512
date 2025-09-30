# FashionOS Platform Sitemap

## 🗺️ Site Architecture Overview

This document outlines the complete sitemap for the FashionOS platform, including public pages, role-specific dashboards, and authentication flows.

---

## 📍 Current Sitemap (Before Refactor)

```
fashionos.co/
│
├── PUBLIC SITE
│   ├── / (Index/Home)
│   ├── /home
│   ├── /about
│   ├── /contact
│   ├── /events
│   │   └── /events/:id
│   ├── /services
│   │   ├── /services/fashion-photography
│   │   ├── /services/video-production
│   │   └── /services/ai-services
│   ├── /designers
│   ├── /tickets
│   └── /sponsors
│
├── DASHBOARD (Currently all route to MockDashboard)
│   ├── /dashboard (MockDashboard)
│   ├── /dashboard/overview (MockDashboard)
│   ├── /dashboard/organizer (MockDashboard)
│   ├── /dashboard/sponsor (MockDashboard)
│   ├── /dashboard/venue (MockDashboard)
│   ├── /dashboard/analytics (MockDashboard)
│   ├── /dashboard/designers (MockDashboard)
│   ├── /dashboard/attendees (MockDashboard)
│   ├── /dashboard/sponsors (MockDashboard)
│   ├── /dashboard/venues (MockDashboard)
│   ├── /dashboard/create-event (MockDashboard)
│   ├── /dashboard/event-brief (MockDashboard)
│   ├── /dashboard/gallery (MockDashboard)
│   ├── /dashboard/portfolio-upload (MockDashboard)
│   ├── /dashboard/payments (MockDashboard)
│   └── /dashboard/contact-forms (MockDashboard)
│
└── ADMIN
    └── /admin/dashboard

**ISSUES:**
- 16 dashboard routes all point to same component
- No role-based routing
- Inconsistent navigation structure
- 32 separate dashboard component files
- Duplicate/unused pages
```

---

## 🎯 Proposed Sitemap (After Refactor)

### Public Website Structure

```
fashionos.co/
│
├── HOME & INFO
│   ├── / (Hero + Featured Events + Services)
│   ├── /about (Company Story, Team, Mission)
│   └── /contact (Contact Form, Support)
│
├── DISCOVER
│   ├── /events (Event Listing with Filters)
│   │   ├── /events/:slug (Event Detail Page)
│   │   └── /events/:slug/tickets (Ticket Purchase)
│   │
│   ├── /designers (Designer Directory)
│   │   └── /designers/:slug (Designer Profile)
│   │
│   ├── /venues (Venue Directory)
│   │   └── /venues/:slug (Venue Profile)
│   │
│   └── /sponsors (Sponsor Directory)
│       └── /sponsors/:slug (Sponsor Profile)
│
├── SERVICES
│   ├── /services (Services Overview)
│   ├── /services/fashion-photography (Photography Services)
│   ├── /services/video-production (Video Services)
│   ├── /services/ai-services (AI-Powered Services)
│   └── /services/production (Event Production)
│
└── AUTH
    ├── /sign-in (Clerk Sign In)
    ├── /sign-up (Clerk Sign Up)
    └── /forgot-password (Password Recovery)
```

### Dashboard Structure (Role-Based)

```
fashionos.co/dashboard/
│
├── AUTO-REDIRECT (/dashboard)
│   └── Redirects based on user role:
│       - Organizer → /dashboard/organizer
│       - Designer → /dashboard/designer
│       - Venue → /dashboard/venue
│       - Sponsor → /dashboard/sponsor
│       - User → /dashboard/profile
│       - Admin → /dashboard/admin
│
├── ORGANIZER DASHBOARD (/dashboard/organizer)
│   ├── Overview
│   │   ├── Dashboard Home
│   │   ├── Analytics
│   │   └── Quick Actions
│   │
│   ├── Events Management
│   │   ├── /dashboard/events (All Events List)
│   │   ├── /dashboard/events/create (Create Event)
│   │   ├── /dashboard/events/:id (Event Detail)
│   │   ├── /dashboard/events/:id/edit (Edit Event)
│   │   ├── /dashboard/events/:id/attendees (Attendee List)
│   │   ├── /dashboard/events/:id/tickets (Ticket Management)
│   │   └── /dashboard/events/:id/analytics (Event Analytics)
│   │
│   ├── Contacts & Bookings
│   │   ├── /dashboard/designers (Designer Contacts)
│   │   ├── /dashboard/venues (Venue Bookings)
│   │   ├── /dashboard/sponsors (Sponsor Management)
│   │   └── /dashboard/attendees (Attendee Management)
│   │
│   ├── Financial
│   │   ├── /dashboard/revenue (Revenue Dashboard)
│   │   ├── /dashboard/payments (Payment History)
│   │   └── /dashboard/invoices (Invoice Management)
│   │
│   └── Settings
│       ├── /dashboard/profile (Organizer Profile)
│       ├── /dashboard/team (Team Management)
│       └── /dashboard/settings (Settings)
│
├── DESIGNER DASHBOARD (/dashboard/designer)
│   ├── Overview
│   │   ├── Dashboard Home
│   │   ├── Portfolio Stats
│   │   └── Recent Activity
│   │
│   ├── Portfolio
│   │   ├── /dashboard/portfolio (Portfolio View)
│   │   ├── /dashboard/portfolio/upload (Upload Work)
│   │   └── /dashboard/portfolio/collections (Collections)
│   │
│   ├── Bookings
│   │   ├── /dashboard/bookings (Booking Calendar)
│   │   ├── /dashboard/bookings/requests (Booking Requests)
│   │   └── /dashboard/bookings/history (Past Bookings)
│   │
│   ├── Earnings
│   │   ├── /dashboard/earnings (Earnings Overview)
│   │   └── /dashboard/payments (Payment History)
│   │
│   └── Settings
│       ├── /dashboard/profile (Designer Profile)
│       ├── /dashboard/availability (Availability Calendar)
│       └── /dashboard/settings (Settings)
│
├── VENUE DASHBOARD (/dashboard/venue)
│   ├── Overview
│   │   ├── Dashboard Home
│   │   ├── Booking Stats
│   │   └── Revenue Overview
│   │
│   ├── Bookings
│   │   ├── /dashboard/bookings (Booking Calendar)
│   │   ├── /dashboard/bookings/requests (Booking Requests)
│   │   ├── /dashboard/bookings/confirmed (Confirmed Bookings)
│   │   └── /dashboard/bookings/history (Past Events)
│   │
│   ├── Venue Management
│   │   ├── /dashboard/spaces (Space Management)
│   │   ├── /dashboard/capacity (Capacity Settings)
│   │   ├── /dashboard/amenities (Amenities List)
│   │   └── /dashboard/photos (Photo Gallery)
│   │
│   ├── Financial
│   │   ├── /dashboard/revenue (Revenue Dashboard)
│   │   └── /dashboard/payments (Payment History)
│   │
│   └── Settings
│       ├── /dashboard/profile (Venue Profile)
│       ├── /dashboard/availability (Availability Calendar)
│       └── /dashboard/settings (Settings)
│
├── SPONSOR DASHBOARD (/dashboard/sponsor)
│   ├── Overview
│   │   ├── Dashboard Home
│   │   ├── Campaign Performance
│   │   └── ROI Metrics
│   │
│   ├── Campaigns
│   │   ├── /dashboard/campaigns (All Campaigns)
│   │   ├── /dashboard/campaigns/create (Create Campaign)
│   │   ├── /dashboard/campaigns/:id (Campaign Detail)
│   │   └── /dashboard/campaigns/:id/analytics (Campaign Analytics)
│   │
│   ├── Partnerships
│   │   ├── /dashboard/partnerships (Active Partnerships)
│   │   ├── /dashboard/partnerships/opportunities (New Opportunities)
│   │   └── /dashboard/partnerships/history (Past Partnerships)
│   │
│   ├── Brand Assets
│   │   ├── /dashboard/brand-assets (Asset Library)
│   │   ├── /dashboard/brand-assets/upload (Upload Assets)
│   │   └── /dashboard/press-kit (Press Kit)
│   │
│   ├── Analytics
│   │   ├── /dashboard/analytics (Overview)
│   │   ├── /dashboard/analytics/roi (ROI Analysis)
│   │   └── /dashboard/analytics/engagement (Engagement Metrics)
│   │
│   └── Settings
│       ├── /dashboard/profile (Sponsor Profile)
│       └── /dashboard/settings (Settings)
│
├── USER DASHBOARD (/dashboard/profile)
│   ├── Overview
│   │   ├── Dashboard Home
│   │   ├── My Tickets
│   │   └── Event History
│   │
│   ├── Tickets
│   │   ├── /dashboard/tickets (All Tickets)
│   │   ├── /dashboard/tickets/upcoming (Upcoming Events)
│   │   └── /dashboard/tickets/past (Past Events)
│   │
│   ├── Preferences
│   │   ├── /dashboard/interests (Event Interests)
│   │   └── /dashboard/notifications (Notification Settings)
│   │
│   └── Account
│       ├── /dashboard/profile (Profile Settings)
│       ├── /dashboard/payment-methods (Payment Methods)
│       └── /dashboard/settings (Account Settings)
│
└── ADMIN DASHBOARD (/dashboard/admin)
    ├── Overview
    │   ├── Dashboard Home
    │   ├── Platform Analytics
    │   └── System Health
    │
    ├── User Management
    │   ├── /dashboard/admin/users (All Users)
    │   ├── /dashboard/admin/organizers (Organizers)
    │   ├── /dashboard/admin/designers (Designers)
    │   ├── /dashboard/admin/venues (Venues)
    │   └── /dashboard/admin/sponsors (Sponsors)
    │
    ├── Content Management
    │   ├── /dashboard/admin/events (Event Moderation)
    │   ├── /dashboard/admin/portfolios (Portfolio Moderation)
    │   └── /dashboard/admin/reports (User Reports)
    │
    ├── Platform Settings
    │   ├── /dashboard/admin/settings (Global Settings)
    │   ├── /dashboard/admin/integrations (Integrations)
    │   └── /dashboard/admin/payments (Payment Settings)
    │
    └── Analytics
        ├── /dashboard/admin/analytics (Platform Analytics)
        ├── /dashboard/admin/revenue (Revenue Reports)
        └── /dashboard/admin/growth (Growth Metrics)
```

---

## 🎨 Navigation Structure

### Public Site Navigation

```
┌─────────────────────────────────────────────────────────┐
│  FashionOS Logo    Events  Services  Designers  About   │
│                                      Sign In  Sign Up    │
└─────────────────────────────────────────────────────────┘
```

**Desktop Navigation:**
- Logo (left)
- Main Links: Events, Services, Designers, Venues, Sponsors, About
- Auth Buttons: Sign In, Sign Up (right)
- User Menu (when signed in): Profile, Dashboard, Sign Out

**Mobile Navigation:**
- Hamburger Menu
- Slide-in drawer with all links
- Bottom: Auth buttons or user menu

### Dashboard Navigation

```
┌───────────┬──────────────────────────────────────────────┐
│           │  Dashboard    🔔 Notifications   👤 Profile  │
├───────────┼──────────────────────────────────────────────┤
│ OVERVIEW  │                                              │
│ Dashboard │                                              │
│ Analytics │         MAIN CONTENT AREA                    │
│           │                                              │
│ EVENTS    │                                              │
│ All       │                                              │
│ Create    │                                              │
│           │                                              │
│ MANAGE    │                                              │
│ Designers │                                              │
│ Venues    │                                              │
└───────────┴──────────────────────────────────────────────┘
```

**Desktop Dashboard:**
- Collapsible sidebar (left) - role-specific menu
- Top bar: breadcrumbs, search, notifications, profile
- Content area: max-width 1280px, centered
- Footer: minimal

**Mobile Dashboard:**
- Top bar with hamburger menu
- Slide-in drawer for navigation
- Full-width content
- Bottom tab bar (optional)

---

## 🔐 Role-Based Access Matrix

| Route                       | Public | User | Designer | Venue | Sponsor | Organizer | Admin |
|-----------------------------|--------|------|----------|-------|---------|-----------|-------|
| `/`                         | ✅     | ✅   | ✅       | ✅    | ✅      | ✅        | ✅    |
| `/events`                   | ✅     | ✅   | ✅       | ✅    | ✅      | ✅        | ✅    |
| `/events/:id/tickets`       | ✅     | ✅   | ✅       | ✅    | ✅      | ✅        | ✅    |
| `/dashboard`                | ❌     | ✅   | ✅       | ✅    | ✅      | ✅        | ✅    |
| `/dashboard/organizer`      | ❌     | ❌   | ❌       | ❌    | ❌      | ✅        | ✅    |
| `/dashboard/designer`       | ❌     | ❌   | ✅       | ❌    | ❌      | ❌        | ✅    |
| `/dashboard/venue`          | ❌     | ❌   | ❌       | ✅    | ❌      | ❌        | ✅    |
| `/dashboard/sponsor`        | ❌     | ❌   | ❌       | ❌    | ✅      | ❌        | ✅    |
| `/dashboard/admin`          | ❌     | ❌   | ❌       | ❌    | ❌      | ❌        | ✅    |

---

## 📱 Mobile Navigation Patterns

### Public Site Mobile

```
┌─────────────────────────┐
│ ☰  FashionOS      [👤]  │ ← Top bar (sticky)
├─────────────────────────┤
│                         │
│   HERO / CONTENT        │
│                         │
└─────────────────────────┘
│ 🏠  📅  🎨  👤         │ ← Bottom tab bar (optional)
└─────────────────────────┘
```

### Dashboard Mobile

```
┌─────────────────────────┐
│ ☰  Dashboard      [🔔]  │ ← Top bar (sticky)
├─────────────────────────┤
│                         │
│   DASHBOARD CONTENT     │
│                         │
└─────────────────────────┘
```

**Sidebar Drawer (when ☰ tapped):**
```
┌────────────────┐
│ Overview       │
│ Dashboard      │
│ Analytics      │
│                │
│ Events         │
│ All Events     │
│ Create Event   │
│                │
│ Settings       │
│ Profile        │
│ Sign Out       │
└────────────────┘
```

---

## 🗂️ File Structure Mapping

### Current Dashboard Files (To Consolidate)

```
src/pages/
├── Dashboard.tsx                      → DELETE (merge to role dashboards)
├── MockDashboard.tsx                  → DELETE (replaced by role dashboards)
├── MainDashboard.tsx                  → DELETE (merge to OrganizerDashboard)
├── EnhancedDashboard.tsx              → DELETE (merge to role dashboards)
├── LeapDashboard.tsx                  → DELETE (unused)
├── OrganizerDashboard.tsx             → REFACTOR → dashboards/OrganizerDashboard.tsx
├── OrganizerDashboardNew.tsx          → SOURCE for new OrganizerDashboard
├── OrganizerDashboardDemo.tsx         → DELETE
├── OrganizerDashboardPreview.tsx      → DELETE
├── OrganizerDashboardStandalone.tsx   → DELETE
├── DesignerDashboard.tsx              → REFACTOR → dashboards/DesignerDashboard.tsx
├── VenueDashboard.tsx                 → REFACTOR → dashboards/VenueDashboard.tsx
├── SponsorDashboard.tsx               → REFACTOR → dashboards/SponsorDashboard.tsx
├── SponsorDashboardNew.tsx            → SOURCE for new SponsorDashboard
├── UserDashboard.tsx                  → REFACTOR → dashboards/UserDashboard.tsx
├── UserDashboardFixed.tsx             → SOURCE for new UserDashboard
└── UserDashboardDemo.tsx              → DELETE
```

### Proposed Dashboard Files (Clean Structure)

```
src/pages/dashboards/
├── RoleBasedDashboard.tsx           ← Auto-redirect component
├── OrganizerDashboard.tsx           ← Consolidated organizer view
├── DesignerDashboard.tsx            ← Consolidated designer view
├── VenueDashboard.tsx               ← Consolidated venue view
├── SponsorDashboard.tsx             ← Consolidated sponsor view
├── UserDashboard.tsx                ← Consolidated user view
├── AdminDashboard.tsx               ← Admin-only view
│
├── events/
│   ├── EventsList.tsx
│   ├── EventDetail.tsx
│   ├── CreateEvent.tsx
│   └── EventAnalytics.tsx
│
├── shared/
│   ├── MetricCard.tsx
│   ├── StatCard.tsx
│   ├── ActivityFeed.tsx
│   ├── RevenueChart.tsx
│   ├── EventsList.tsx
│   └── QuickActions.tsx
│
└── components/
    ├── DashboardHeader.tsx
    ├── DashboardStats.tsx
    └── DashboardFilters.tsx
```

---

## 🎯 Implementation Priority

### Phase 1: Core Routes (Week 1)
1. ✅ Public site routes (already working)
2. ⚠️ Dashboard base route with role detection
3. ⚠️ Auto-redirect logic

### Phase 2: Role Dashboards (Week 2-3)
1. Organizer Dashboard + Events routes
2. Designer Dashboard + Portfolio routes
3. Venue Dashboard + Booking routes
4. Sponsor Dashboard + Campaign routes
5. User Dashboard + Tickets routes

### Phase 3: Sub-Routes (Week 4)
1. Event management routes
2. Financial routes
3. Settings routes
4. Analytics routes

### Phase 4: Admin (Week 5)
1. Admin dashboard
2. User management
3. Content moderation
4. Platform analytics

---

## 📊 Route Analytics

### Current State
- **Total Routes:** 67
- **Actual Components:** 32 dashboards + 15 pages = 47
- **Duplicate Routes:** 16 dashboard routes → 1 component
- **Unused Components:** ~10-15

### Target State
- **Total Routes:** 35
- **Dashboard Components:** 6 role-specific + 8 shared
- **Duplicate Routes:** 0
- **Unused Components:** 0

**Reduction:**
- 48% fewer routes
- 70% fewer dashboard files
- 100% role-based routing
- Cleaner, maintainable structure

---

*Last Updated: Current Date*
*Version: 1.0*
*Status: Proposed (Pending Implementation)*
