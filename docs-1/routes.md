# FashionOS Route Structure

## PUBLIC
```
/                       Home
/about                  About
/contact                Contact
/events                 Events listing
/events/:slug-:id       Event detail (canonical)
/events/:slug-:id/tickets  Ticket purchase
/designers              Designers listing
/designers/:slug-:id    Designer profile
/venues                 Venues listing
/venues/:slug-:id       Venue detail
/sponsors               Sponsors listing
/sponsors/:slug-:id     Sponsor detail
```

## AUTH
```
/sign-in                Sign in
/sign-up                Sign up
/forgot-password        Password recovery
```

## DASHBOARD (auto-redirect by role)
```
/dashboard → /dashboard/{role}/overview
```

### /dashboard/organizer
```
/overview               Dashboard home
/events                 Events list
/events/create          Create event
/events/:id             Event detail
/events/:id/edit        Edit event
/events/:id/attendees   Manage attendees
/events/:id/tickets     Ticket management
/events/:id/analytics   Event analytics
/contacts               Contact management
/revenue                Revenue tracking
/billing                Billing & payments
/settings               Settings
```

### /dashboard/designer
```
/overview               Dashboard home
/portfolio              Portfolio management
/portfolio/upload       Upload work
/portfolio/collections  Collections
/bookings               Booking calendar
/earnings               Earnings tracking
/billing                Billing & payments
/settings               Settings
```

### /dashboard/venue
```
/overview               Dashboard home
/bookings               Booking calendar
/spaces                 Space management
/photos                 Photo gallery
/billing                Billing & payments
/settings               Settings
```

### /dashboard/sponsor
```
/overview               Dashboard home
/campaigns              Campaigns list
/campaigns/create       Create campaign
/campaigns/:id          Campaign detail
/campaigns/:id/analytics Campaign analytics
/partnerships           Partnership management
/analytics              Global analytics
/brand-assets           Brand assets
/billing                Billing & payments
/settings               Settings
```

### /dashboard/user
```
/overview               Dashboard home
/tickets                My tickets
/tickets/upcoming       Upcoming tickets
/tickets/past           Past tickets
/preferences            Preferences
/account                Account settings
```

### /dashboard/admin
```
/overview               Admin dashboard
/users                  User management
/content                Content management
/analytics              Platform analytics
/settings               Platform settings
```

## Rules

* **Canonical public detail:** `:slug-:id` format (redirect slug-only → slug-id)
* **All `/dashboard/**` routes:** require authentication + role validation
* **Error codes:** 403 (unauthorized), 404 (not found), 301 (moved)
* **Server-side RBAC:** All dashboard routes validated on both client and server
