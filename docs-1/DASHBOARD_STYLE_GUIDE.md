# Dashboard Design System & Style Guide

## Overview
This guide defines the design standards, component usage, and visual patterns specifically for the Fashionistas dashboard interfaces across all user roles.

**Target:** Internal dashboard pages (`/dashboard/**`)  
**Updated:** January 2025  
**Version:** 2.0

---

## 🎨 DESIGN PRINCIPLES

### 1. **Clarity Over Complexity**
- Information hierarchy must be immediately clear
- Use whitespace generously to separate concerns
- Single-purpose components over multi-function widgets

### 2. **Data Visualization First**
- Charts and graphs for quick insights
- Numeric KPIs prominently displayed
- Progress indicators for goals/targets

### 3. **Responsive & Mobile-Optimized**
- Mobile-first layout approach
- Collapsible sidebar on mobile
- Touch-friendly controls (44px minimum)

### 4. **Accessibility Standards**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader optimization
- Focus states on all interactive elements

---

## 🎨 COLOR SYSTEM

### Dashboard-Specific Palette

#### Surfaces & Backgrounds
```css
--surface-1: hsl(0, 0%, 100%)           /* Main content background */
--surface-2: hsl(0, 0%, 98%)            /* Secondary surface */
--surface-3: hsl(0, 0%, 95%)            /* Tertiary surface (cards) */

/* Dark mode */
--surface-1: hsl(0, 0%, 9%)             /* Main background */
--surface-2: hsl(0, 0%, 12%)            /* Secondary surface */
--surface-3: hsl(0, 0%, 15%)            /* Card backgrounds */
```

#### Text Hierarchy
```css
--text-primary: hsl(0, 0%, 9%)          /* Headings, important text */
--text-secondary: hsl(0, 0%, 40%)       /* Body text */
--text-muted: hsl(0, 0%, 60%)           /* Secondary info, labels */

/* Dark mode */
--text-primary: hsl(0, 0%, 98%)
--text-secondary: hsl(0, 0%, 70%)
--text-muted: hsl(0, 0%, 50%)
```

#### Semantic Colors
```css
--action: hsl(271, 91%, 65%)            /* Primary CTA - Purple */
--success: hsl(142, 71%, 45%)           /* Success states - Green */
--warning: hsl(38, 92%, 50%)            /* Warning states - Gold */
--danger: hsl(0, 84%, 60%)              /* Error/destructive - Red */
--info: hsl(217, 91%, 60%)              /* Informational - Blue */
```

#### Usage Rules
- **NEVER** use direct colors like `text-white`, `bg-black`, `border-gray-300`
- **ALWAYS** use semantic tokens: `text-text-primary`, `bg-surface-1`, `border-border`
- **Charts**: Use semantic colors for data visualization

---

## 📐 LAYOUT SYSTEM

### Dashboard Grid Structure
```
┌─────────────────────────────────────────────────┐
│  Navbar (fixed top, h-16)                      │
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ Sidebar  │  Main Content Area                   │
│ (fixed)  │  (scrollable, px-6 py-8)            │
│          │                                      │
│ w-64     │  ┌──────────────────────────┐        │
│          │  │  Page Header             │        │
│          │  └──────────────────────────┘        │
│          │                                      │
│          │  ┌──────────────────────────┐        │
│          │  │  Stat Cards (Grid)       │        │
│          │  └──────────────────────────┘        │
│          │                                      │
│          │  ┌──────────────────────────┐        │
│          │  │  Data Tables / Charts    │        │
│          │  └──────────────────────────┘        │
└──────────┴──────────────────────────────────────┘
```

### Responsive Breakpoints
```typescript
// Mobile: < 768px
- Sidebar collapses to overlay
- Stats stack vertically
- Tables scroll horizontally

// Tablet: 768px - 1024px
- Sidebar mini mode (icons only)
- 2-column stat grid
- Compact tables

// Desktop: > 1024px
- Full sidebar visible
- 3-4 column stat grid
- Full-width tables
```

---

## 🧩 COMPONENT LIBRARY

### 1. Page Header
Standard header for all dashboard pages.

```tsx
<div className="flex items-center justify-between mb-8">
  <div>
    <h1 className="text-3xl font-semibold text-text-primary">
      Page Title
    </h1>
    <p className="text-text-muted mt-1">
      Optional description text
    </p>
  </div>
  
  <Button variant="action" size="md">
    Primary Action
  </Button>
</div>
```

**Usage:**
- H1 for page title only
- Optional description for context
- Primary action button on the right
- Mobile: Stack vertically

---

### 2. Stat Cards
Display key metrics prominently.

```tsx
import { StandardCard } from "@/components/ui/StandardCard";
import { TrendingUp, Users, DollarSign } from "lucide-react";

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  <StandardCard>
    <StandardCardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-muted">Total Revenue</p>
          <p className="text-2xl font-semibold text-text-primary mt-1">
            $45,231
          </p>
          <p className="text-xs text-success mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            +12.5% from last month
          </p>
        </div>
        <div className="h-12 w-12 rounded-full bg-action/10 flex items-center justify-center">
          <DollarSign className="h-6 w-6 text-action" />
        </div>
      </div>
    </StandardCardContent>
  </StandardCard>
</div>
```

**Anatomy:**
- **Label**: Small, muted text
- **Value**: Large, bold, primary color
- **Trend**: Success/danger color with icon
- **Icon**: Circle background with semantic color

**Grid:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

---

### 3. Data Tables
Tabular data display with actions.

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

<StandardCard>
  <StandardCardHeader title="Recent Events" />
  <StandardCardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Tickets Sold</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Fashion Week 2025</TableCell>
          <TableCell>Jan 15, 2025</TableCell>
          <TableCell>
            <Badge variant="success">Active</Badge>
          </TableCell>
          <TableCell>234 / 500</TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm">Edit</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </StandardCardContent>
</StandardCard>
```

**Standards:**
- Use semantic `<Table>` component
- Badge for status indicators
- Right-align action buttons
- Responsive: Horizontal scroll on mobile

---

### 4. Charts & Graphs
Visual data representation using Recharts.

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

<StandardCard>
  <StandardCardHeader title="Revenue Trend" />
  <StandardCardContent>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={revenueData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="hsl(var(--action))" 
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </StandardCardContent>
</StandardCard>
```

**Chart Colors:**
- Primary: `hsl(var(--action))` - Purple
- Secondary: `hsl(var(--success))` - Green
- Tertiary: `hsl(var(--warning))` - Gold
- Danger: `hsl(var(--danger))` - Red

---

### 5. Empty States
Show when no data exists.

```tsx
import { EmptyState } from "@/components/ui/EmptyState";
import { Calendar } from "lucide-react";

<EmptyState
  icon={Calendar}
  title="No events yet"
  description="Create your first event to get started"
  action={
    <Button variant="action" onClick={handleCreate}>
      Create Event
    </Button>
  }
/>
```

**Usage:**
- Centered layout
- Relevant icon
- Clear title and description
- Optional CTA button

---

### 6. Loading States
Skeleton loaders for async data.

```tsx
import { DashboardSkeleton } from "@/components/ui/DashboardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

// Full page loading
<DashboardSkeleton />

// Inline loading
<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
</div>
```

---

## 🎯 BUTTON VARIANTS

### Dashboard-Specific Button Usage

```tsx
// Primary action (main CTA)
<Button variant="action" size="md">
  Create Event
</Button>

// Secondary action (cancel, back)
<Button variant="secondary" size="md">
  Cancel
</Button>

// Danger action (delete, destructive)
<Button variant="danger" size="md">
  Delete
</Button>

// Ghost action (in tables, cards)
<Button variant="ghost" size="sm">
  Edit
</Button>

// Icon-only
<Button variant="icon" size="icon">
  <Settings className="h-4 w-4" />
</Button>
```

**Size Guidelines:**
- `sm`: Table actions, compact spaces
- `md`: Default for most actions
- `lg`: Primary CTAs, hero buttons
- `icon`: Icon-only buttons (44x44px minimum)

---

## 📊 DASHBOARD-SPECIFIC PATTERNS

### KPI Display Pattern
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Primary KPI - Large */}
  <div className="md:col-span-2">
    <StandardCard>
      <StandardCardContent className="pt-6">
        <p className="text-sm text-text-muted">Total Revenue</p>
        <p className="text-4xl font-bold text-text-primary mt-2">
          $128,450
        </p>
        <p className="text-success mt-2 flex items-center gap-1">
          <TrendingUp className="h-4 w-4" />
          +24.5% vs last month
        </p>
      </StandardCardContent>
    </StandardCard>
  </div>
  
  {/* Secondary KPIs - Smaller */}
  <div className="space-y-4">
    <StandardCard>
      <StandardCardContent className="pt-6">
        <p className="text-sm text-text-muted">Events</p>
        <p className="text-2xl font-semibold text-text-primary mt-1">12</p>
      </StandardCardContent>
    </StandardCard>
    <StandardCard>
      <StandardCardContent className="pt-6">
        <p className="text-sm text-text-muted">Attendees</p>
        <p className="text-2xl font-semibold text-text-primary mt-1">1,243</p>
      </StandardCardContent>
    </StandardCard>
  </div>
</div>
```

### Filter Bar Pattern
```tsx
<div className="flex flex-col md:flex-row gap-4 mb-6">
  <Input 
    placeholder="Search events..." 
    className="md:w-80"
  />
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="active">Active</SelectItem>
      <SelectItem value="draft">Draft</SelectItem>
      <SelectItem value="ended">Ended</SelectItem>
    </SelectContent>
  </Select>
  <Button variant="secondary" className="md:ml-auto">
    Reset Filters
  </Button>
</div>
```

### Quick Actions Menu
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="icon" size="icon">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>
      <Edit className="mr-2 h-4 w-4" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Copy className="mr-2 h-4 w-4" />
      Duplicate
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-danger">
      <Trash className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## 🔔 NOTIFICATIONS & FEEDBACK

### Toast Messages
```tsx
import { toast } from "sonner";

// Success
toast.success("Event created successfully");

// Error
toast.error("Failed to save changes");

// Loading
toast.loading("Uploading images...");

// Promise
toast.promise(
  saveEvent(),
  {
    loading: "Saving...",
    success: "Event saved!",
    error: "Failed to save",
  }
);
```

### Alert Banners
```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your session has expired. Please sign in again.
  </AlertDescription>
</Alert>
```

---

## 📱 MOBILE DASHBOARD PATTERNS

### Mobile Header
```tsx
<div className="sticky top-0 z-10 bg-surface-1 border-b border-border px-4 py-3 flex items-center justify-between md:hidden">
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon">
        <Menu className="h-5 w-5" />
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      {/* Mobile navigation */}
    </SheetContent>
  </Sheet>
  
  <h1 className="font-semibold">Dashboard</h1>
  
  <UserButton />
</div>
```

### Mobile Stats (Horizontal Scroll)
```tsx
<div className="flex gap-4 overflow-x-auto pb-4 md:hidden">
  {stats.map((stat) => (
    <div key={stat.label} className="flex-shrink-0 w-40">
      <StandardCard>
        <StandardCardContent className="pt-4">
          <p className="text-xs text-text-muted">{stat.label}</p>
          <p className="text-xl font-semibold mt-1">{stat.value}</p>
        </StandardCardContent>
      </StandardCard>
    </div>
  ))}
</div>
```

---

## ✅ ACCESSIBILITY CHECKLIST

- [ ] All interactive elements have focus states
- [ ] Keyboard navigation works throughout
- [ ] ARIA labels on icon-only buttons
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] Form inputs have associated labels
- [ ] Error messages are announced to screen readers
- [ ] Loading states have `aria-busy` or `aria-live`
- [ ] Modals trap focus and restore on close
- [ ] Skip links for keyboard users

---

## 🎨 DARK MODE

All components automatically support dark mode via `data-theme="dark"` or `.dark` class.

### Testing Dark Mode
```typescript
// Toggle in browser console
document.documentElement.setAttribute('data-theme', 'dark');
document.documentElement.setAttribute('data-theme', 'light');
```

### Dark Mode Best Practices
- Test all components in both modes
- Ensure sufficient contrast in both themes
- Use semantic tokens (auto-adjust)
- Avoid pure white/black

---

## 🚀 PERFORMANCE GUIDELINES

### Code Splitting
```tsx
// Lazy load heavy dashboard sections
const Analytics = lazy(() => import("./Analytics"));

<Suspense fallback={<DashboardSkeleton />}>
  <Analytics />
</Suspense>
```

### Data Fetching
```tsx
// Use React Query for caching
const { data, isLoading } = useQuery({
  queryKey: ['events', filters],
  queryFn: fetchEvents,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Image Optimization
- Use `loading="lazy"` for images
- Serve WebP format when supported
- Compress images before upload
- Use appropriate sizes (don't load 4K on mobile)

---

## 📚 COMPONENT IMPORTS

### Correct Import Pattern
```tsx
// UI Components
import { Button } from "@/components/ui/button";
import { StandardCard, StandardCardHeader, StandardCardContent } from "@/components/ui/StandardCard";
import { Badge } from "@/components/ui/badge";

// Icons
import { Calendar, TrendingUp, Users } from "lucide-react";

// Hooks
import { useQuery } from "@tanstack/react-query";

// Utils
import { cn } from "@/lib/utils";
```

---

## 🔗 RELATED DOCUMENTATION

- [Complete Sitemap](./SITEMAP_COMPLETE.md)
- [Public Website Style Guide](./STYLE_GUIDE.md)
- [Component Patterns](./development/COMPONENT_PATTERNS.md)
- [Design System Colors](./design-system/COLORS.md)

---

## 📋 DASHBOARD CHECKLIST

Before shipping a dashboard page:

- [ ] Uses semantic color tokens (no direct colors)
- [ ] Responsive on mobile, tablet, desktop
- [ ] Loading states implemented
- [ ] Empty states designed
- [ ] Error handling with toast/alerts
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Dark mode tested
- [ ] Accessible (ARIA, contrast, labels)
- [ ] Performance optimized (lazy loading, caching)

---

*This style guide ensures consistency across all dashboard interfaces. Follow it strictly for all dashboard development.*
