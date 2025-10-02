# Fashionistas Platform - Complete Sitemap

## Overview
This document defines the complete site structure for the Fashionistas platform, including public website pages and role-based dashboard routes.

**Last Updated:** January 2025  
**Version:** 2.0

---

## 🌐 PUBLIC WEBSITE

### Homepage & Core Pages
```
/                           Homepage (Index)
├── Hero section with CTA
├── Featured events carousel
├── Designer spotlight
├── Ticket tiers showcase
└── Newsletter signup

/about                      About Fashionistas
├── Platform story
├── Mission & values
├── Team showcase
└── Colombian fashion focus

/contact                    Contact page
├── Contact form
├── Office locations
├── WhatsApp integration
└── Social media links
```

### Events Section
```
/events                     Events listing
├── Filters (date, type, location)
├── Search functionality
├── Event cards grid
└── Pagination

/events/:slug-:id          Event detail (canonical)
├── Event hero & gallery
├── Description & details
├── Ticket selector
├── Related events
└── Share functionality

/events/:slug-:id/tickets  Ticket purchase
├── Ticket tier selection
├── Quantity selector
├── Checkout integration
└── Payment processing
```

### Designers Section
```
/designers                  Designers listing
├── Designer cards grid
├── Search & filters
├── Featured designers
└── Portfolio previews

/designers/:slug-:id       Designer profile
├── Portfolio gallery
├── Bio & expertise
├── Past events
├── Contact/booking CTA
└── Social media links
```

### Services Section
```
/services                   Services overview
├── Service categories
├── Pricing information
└── CTA for inquiries

/services/fashion-photography  Fashion Photography
├── Service details
├── Portfolio samples
├── Pricing packages
└── Booking form

/services/video-production     Video Production
├── Service details
├── Sample videos
├── Pricing packages
└── Booking form

/services/ai-services          AI Services
├── AI-powered features
├── Use cases
└── Request access
```

### Discovery Pages
```
/sponsors                   Sponsors showcase
├── Sponsor logos
├── Partnership tiers
├── Benefits overview
└── Become a sponsor CTA

/sponsors/:slug-:id        Sponsor profile
├── Brand information
├── Sponsored events
├── Partnership details
└── Contact information

/tickets                    Ticket marketplace
├── Available tickets
├── Filter by event
├── Quick purchase
└── User dashboard link
```

### Authentication
```
/sign-in                    Sign in page
├── Email/password login
├── Google OAuth
├── Forgot password link
└── Sign up redirect

/sign-up                    Sign up page
├── Registration form
├── Role selection
├── Email verification
└── Terms acceptance

/forgot-password           Password recovery
└── Email reset flow
```

---

## 🎛️ DASHBOARD (Protected Routes)

### Base Dashboard Route
```
/dashboard                  Auto-redirect by role
└── Redirects to /dashboard/{role}/overview
```

---

### 👔 ORGANIZER DASHBOARD
**Role:** Event organizers and producers

```
/dashboard/organizer/overview
├── Event statistics
├── Revenue summary
├── Upcoming events
├── Recent bookings
└── Quick actions

/dashboard/organizer/events
├── All events list
├── Create new event
├── Filter & search
└── Status indicators

/dashboard/organizer/events/create
├── Event creation form
├── Date/time picker
├── Venue selection
├── Ticket configuration
└── Publishing options

/dashboard/organizer/events/:id
├── Event overview
├── Attendee management
├── Ticket sales
├── Analytics
└── Edit/delete options

/dashboard/organizer/contacts
├── Contact list
├── Import/export
├── Email campaigns
└── Segmentation

/dashboard/organizer/revenue
├── Revenue dashboard
├── Payment history
├── Payout schedule
└── Financial reports

/dashboard/organizer/analytics
├── Event performance
├── Ticket sales trends
├── Audience insights
└── Export reports

/dashboard/organizer/billing
├── Payment methods
├── Invoices
├── Subscription status
└── Transaction history

/dashboard/organizer/settings
├── Profile settings
├── Notification preferences
├── Team management
└── Integration settings
```

---

### 🎨 DESIGNER DASHBOARD
**Role:** Fashion designers and brands

```
/dashboard/designer/overview
├── Booking requests
├── Upcoming shows
├── Earnings summary
├── Portfolio stats
└── Quick actions

/dashboard/designer/portfolio
├── Gallery management
├── Collections
├── Upload new work
└── Edit/organize

/dashboard/designer/portfolio/upload
├── Bulk upload
├── Image editor
├── Metadata tagging
└── Collection assignment

/dashboard/designer/portfolio/collections
├── Create collections
├── Organize work
├── Season management
└── Featured selection

/dashboard/designer/bookings
├── Booking calendar
├── Request management
├── Availability settings
└── Event confirmations

/dashboard/designer/earnings
├── Revenue tracking
├── Payment history
├── Payout schedule
└── Financial reports

/dashboard/designer/billing
├── Payment methods
├── Invoices
└── Transaction history

/dashboard/designer/settings
├── Profile settings
├── Portfolio preferences
├── Notification settings
└── Privacy controls
```

---

### 🏛️ VENUE DASHBOARD
**Role:** Venue owners and managers

```
/dashboard/venue/overview
├── Booking overview
├── Revenue summary
├── Upcoming events
├── Space availability
└── Quick actions

/dashboard/venue/bookings
├── Booking calendar
├── Request management
├── Availability editor
└── Event confirmations

/dashboard/venue/spaces
├── Space management
├── Add/edit spaces
├── Capacity settings
├── Pricing configuration
└── Amenities list

/dashboard/venue/photos
├── Photo gallery
├── Upload images
├── Virtual tours
└── Space documentation

/dashboard/venue/analytics
├── Booking trends
├── Revenue analytics
├── Popular spaces
└── Utilization rates

/dashboard/venue/billing
├── Payment methods
├── Invoices
└── Transaction history

/dashboard/venue/settings
├── Venue profile
├── Contact information
├── Operating hours
└── Notification settings
```

---

### 💼 SPONSOR DASHBOARD
**Role:** Brand sponsors and partners

```
/dashboard/sponsor/overview
├── Campaign overview
├── Active sponsorships
├── ROI metrics
├── Upcoming events
└── Quick actions

/dashboard/sponsor/campaigns
├── Campaign list
├── Create campaign
├── Status tracking
└── Performance metrics

/dashboard/sponsor/campaigns/create
├── Campaign setup
├── Budget allocation
├── Target events
├── Brand assets
└── Activation plan

/dashboard/sponsor/campaigns/:id
├── Campaign details
├── Performance analytics
├── Asset management
├── ROI tracking
└── Edit/pause options

/dashboard/sponsor/partnerships
├── Active partnerships
├── Event collaborations
├── Contract management
└── Communication hub

/dashboard/sponsor/analytics
├── Global analytics
├── Brand exposure
├── Engagement metrics
├── ROI dashboard
└── Export reports

/dashboard/sponsor/brand-assets
├── Logo library
├── Brand guidelines
├── Marketing materials
└── Asset downloads

/dashboard/sponsor/billing
├── Payment methods
├── Invoices
├── Subscription plans
└── Transaction history

/dashboard/sponsor/settings
├── Company profile
├── Brand preferences
├── Team management
└── Notification settings
```

---

### 👤 USER DASHBOARD
**Role:** Event attendees and ticket buyers

```
/dashboard/user/overview
├── Upcoming events
├── Recent purchases
├── Saved events
└── Recommendations

/dashboard/user/tickets
├── All tickets
├── QR codes
├── Transfer options
└── Download tickets

/dashboard/user/tickets/upcoming
├── Upcoming events
├── Event details
├── Directions/maps
└── Add to calendar

/dashboard/user/tickets/past
├── Past events
├── Review & rate
├── Photo memories
└── Receipt downloads

/dashboard/user/preferences
├── Event interests
├── Notification settings
├── Email preferences
└── Location settings

/dashboard/user/account
├── Profile information
├── Password change
├── Payment methods
└── Privacy settings
```

---

### 🛡️ ADMIN DASHBOARD
**Role:** Platform administrators

```
/dashboard/admin/overview
├── Platform statistics
├── User growth
├── Revenue metrics
├── System health
└── Recent activity

/dashboard/admin/users
├── User management
├── Role assignment
├── Account status
├── User analytics
└── Support tickets

/dashboard/admin/content
├── Content moderation
├── Event approval
├── Designer verification
└── Featured content

/dashboard/admin/analytics
├── Platform analytics
├── Revenue reports
├── User behavior
├── Growth metrics
└── Export data

/dashboard/admin/settings
├── Platform configuration
├── Feature flags
├── Integrations
└── System maintenance
```

---

## 🚨 ERROR PAGES

```
/403                        Forbidden
├── Access denied message
├── Role requirements
└── Sign in redirect

/404                        Not Found
├── Page not found message
├── Search suggestions
└── Navigation links

/500                        Server Error
├── Error message
├── Support contact
└── Homepage redirect
```

---

## 🔄 REDIRECTS & DEPRECATED ROUTES

### Automatic Redirects (301 Permanent)
```
OLD ROUTE                           → NEW ROUTE
/dashboard-demo                     → /dashboard
/dashboard/organizer                → /dashboard/organizer/overview
/dashboard/designer                 → /dashboard/designer/overview
/dashboard/venue                    → /dashboard/venue/overview
/dashboard/sponsor                  → /dashboard/sponsor/overview
/dashboard/user                     → /dashboard/user/overview
/organizer-dashboard                → /dashboard/organizer/overview
/designer-dashboard                 → /dashboard/designer/overview
/venue-dashboard                    → /dashboard/venue/overview
/sponsor-dashboard                  → /dashboard/sponsor/overview
/user-dashboard                     → /dashboard/user/overview
```

See `deprecations.json` for complete redirect mapping.

---

## 🔐 ROUTE PROTECTION RULES

### Public Routes
- Accessible to all users
- No authentication required
- SEO optimized

### Auth Routes
- Redirect to dashboard if already signed in
- Form validation
- Session management

### Dashboard Routes
- **ALL** dashboard routes require authentication
- Role-based access control (RBAC)
- Unauthorized users → `/403`
- Unauthenticated users → `/sign-in`

### Access Control Matrix

| Route Pattern                | Public | User | Designer | Venue | Organizer | Sponsor | Admin |
|------------------------------|--------|------|----------|-------|-----------|---------|-------|
| `/`                          | ✅     | ✅   | ✅       | ✅    | ✅        | ✅      | ✅    |
| `/events/*`                  | ✅     | ✅   | ✅       | ✅    | ✅        | ✅      | ✅    |
| `/sign-in`                   | ✅     | ➡️   | ➡️       | ➡️    | ➡️        | ➡️      | ➡️    |
| `/dashboard/user/*`          | ❌     | ✅   | ❌       | ❌    | ❌        | ❌      | ✅    |
| `/dashboard/designer/*`      | ❌     | ❌   | ✅       | ❌    | ❌        | ❌      | ✅    |
| `/dashboard/venue/*`         | ❌     | ❌   | ❌       | ✅    | ❌        | ❌      | ✅    |
| `/dashboard/organizer/*`     | ❌     | ❌   | ❌       | ❌    | ✅        | ❌      | ✅    |
| `/dashboard/sponsor/*`       | ❌     | ❌   | ❌       | ❌    | ❌        | ✅      | ✅    |
| `/dashboard/admin/*`         | ❌     | ❌   | ❌       | ❌    | ❌        | ❌      | ✅    |

**Legend:**
- ✅ Allowed access
- ❌ Denied (403)
- ➡️ Redirect to dashboard

---

## 📱 MOBILE NAVIGATION

### Public Site Mobile Menu
```
☰ Menu
├── Home
├── Events
├── Designers
├── Services
├── Sponsors
├── About
├── Contact
└── Sign In / Dashboard
```

### Dashboard Mobile Menu
```
☰ Menu
├── Overview
├── [Role-specific sections]
├── Settings
└── Sign Out
```

---

## 🔗 URL PATTERNS & SEO

### Slug Format
```
/:resource/:slug-:id
Example: /events/colombia-fashion-week-2025-abc123
```

### Canonical URLs
- Primary: `/events/:slug-:id`
- Redirect: `/events/:id` → `/events/:slug-:id` (301)

### Meta Tags
- All public pages: Title, description, OG tags
- Dashboard pages: noindex, nofollow
- Event pages: JSON-LD structured data

---

## 🎯 IMPLEMENTATION STATUS

### ✅ Completed
- Core public routes
- Auth flow
- Role-based dashboard routing
- Error pages
- Redirect handling

### 🚧 In Progress
- Sub-routes for all dashboard roles
- Advanced analytics pages
- Admin content moderation

### 📋 Planned
- Multi-language support (/es/, /en/)
- API documentation routes
- Help center pages

---

## 📚 RELATED DOCUMENTATION

- [Routing Implementation](./ROUTING_IMPLEMENTATION_COMPLETE.md)
- [Style Guide](./STYLE_GUIDE.md)
- [Design System](./design-system/)
- [Component Patterns](./development/COMPONENT_PATTERNS.md)

---

*This sitemap is the source of truth for all platform routing and navigation decisions.*
