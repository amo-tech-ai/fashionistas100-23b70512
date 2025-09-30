# FashionOS Design System Implementation Plan

## 📊 Current State Analysis

### Existing Dashboard Structure
**Current Dashboards (32 files):**
- MockDashboard (default for all /dashboard routes)
- OrganizerDashboardNew
- SponsorDashboardNew  
- VenueDashboard
- DesignerDashboard
- UserDashboardFixed
- AnalyticsDashboard
- ModelDashboard
- Multiple list/directory dashboards (Designers, Sponsors, Venues)

**Current Navigation:**
- DashboardNavbar (top bar)
- DashboardSidebar (left sidebar with collapsible groups)
- Navigation (public site)

**Current Design System:**
```css
Colors: HSL-based (bg, ink, accent, card-bg)
Typography: Inter + Playfair Display
Spacing: 4px base unit
Components: shadcn/ui
```

### Issues Identified
1. **Fragmented dashboards** - 32+ dashboard files with inconsistent patterns
2. **Routing confusion** - All /dashboard/* routes point to MockDashboard
3. **Inconsistent styling** - Mix of purple (#8B5CF6), blue (#0EA5E9), gold (#F59E0B)
4. **No unified layout** - Each dashboard reimplements structure
5. **Missing role-based routing** - No clear user role detection

---

## 🎯 Implementation Strategy

### Phase 1: Foundation (Week 1)
**Goal:** Establish core design system and refactor existing styles

#### 1.1 Color System Refinement
**File:** `src/index.css`
```css
:root {
  /* Primary - Minimal Palette */
  --primary-dark: 210 11% 6%;        /* #1E1E1E - Main dark */
  --primary-white: 0 0% 100%;        /* #FFFFFF */
  --bg-subtle: 220 14% 98%;          /* #F8F9FB - Off-white bg */
  
  /* Accents - Sparingly Used */
  --accent-action: 43 96% 56%;       /* #F59E0B - Orange CTA */
  --accent-success: 142 71% 45%;     /* #22C55E */
  --accent-warning: 0 84% 60%;       /* #EF4444 */
  --accent-info: 217 91% 60%;        /* #3B82F6 */
  
  /* Neutrals */
  --gray-text: 218 11% 42%;          /* #6B7280 */
  --gray-border: 220 13% 91%;        /* #E5E7EB */
  --gray-bg-subtle: 0 0% 96%;        /* #F5F5F5 */
}
```

**Tasks:**
- [ ] Update `src/index.css` with new minimal color palette
- [ ] Update `tailwind.config.ts` color mappings
- [ ] Remove purple/gold accent usage across components
- [ ] Standardize on action-orange for primary CTAs

#### 1.2 Typography System
**File:** `src/index.css`
```css
/* Typography Scale - Inter Only */
.text-hero { font-size: 48px; font-weight: 700; }
.text-page-title { font-size: 32px; font-weight: 600; }
.text-section { font-size: 24px; font-weight: 600; }
.text-card-title { font-size: 18px; font-weight: 600; }
.text-body { font-size: 16px; font-weight: 400; }
.text-small { font-size: 14px; font-weight: 400; }
.text-label { font-size: 12px; font-weight: 600; text-transform: uppercase; }
```

**Tasks:**
- [ ] Remove Playfair Display usage (keep Inter only)
- [ ] Create typography utility classes
- [ ] Apply consistent heading hierarchy
- [ ] Update all page titles to use new scale

#### 1.3 Component System Overhaul
**Files to Update:**
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/badge.tsx`

**Button Variants (Minimal):**
```typescript
variants: {
  variant: {
    primary: "bg-primary-dark text-white hover:bg-primary-dark/90",
    secondary: "bg-white border border-gray-border text-primary-dark",
    ghost: "bg-transparent text-gray-text hover:bg-gray-bg-subtle",
    icon: "rounded-full border border-gray-border"
  }
}
```

**Card Styles (Clean):**
```css
.card-minimal {
  background: white;
  border: 1px solid var(--gray-border);
  border-radius: 8px;
  padding: 24px;
  box-shadow: none;
}
```

**Tasks:**
- [ ] Simplify button variants (remove heavy shadows/gradients)
- [ ] Update card styling to minimal borders
- [ ] Create stat card component with icon/label/value pattern
- [ ] Update badge variants to minimal design

---

### Phase 2: Layout Architecture (Week 2)
**Goal:** Create unified dashboard layout system

#### 2.1 Base Layout Components
**New Files to Create:**
```
src/components/layouts/
├── DashboardLayout.tsx         (Main wrapper)
├── DashboardTopbar.tsx         (Minimal top navigation)
├── DashboardSidebar.tsx        (Role-based sidebar - refactor existing)
└── DashboardContent.tsx        (Content container with max-width)
```

**DashboardLayout Structure:**
```tsx
<div className="min-h-screen bg-bg-subtle">
  <DashboardTopbar />
  <div className="flex">
    <DashboardSidebar role={userRole} />
    <DashboardContent>
      {children}
    </DashboardContent>
  </div>
</div>
```

**Tasks:**
- [ ] Create `DashboardLayout` component with proper spacing
- [ ] Refactor `DashboardTopbar` to minimal design (no heavy blur/shadows)
- [ ] Update `DashboardSidebar` with role-based menu items
- [ ] Create `DashboardContent` with max-width container (1280px)
- [ ] Implement proper responsive breakpoints

#### 2.2 Role-Based Navigation
**File:** `src/components/layouts/DashboardSidebar.tsx`

**Menu Structure:**
```typescript
const menuByRole = {
  organizer: [
    { section: "Overview", items: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { label: "Events", path: "/dashboard/events", icon: Calendar }
    ]},
    { section: "Manage", items: [
      { label: "Create Event", path: "/dashboard/create-event", icon: Plus }
    ]}
  ],
  designer: [...],
  venue: [...],
  sponsor: [...],
  user: [...]
}
```

**Tasks:**
- [ ] Define complete menu structure for each role
- [ ] Create role detection hook (`useUserRole`)
- [ ] Implement dynamic menu rendering
- [ ] Add active state highlighting (minimal underline/bg)
- [ ] Implement sidebar collapse state persistence

---

### Phase 3: Dashboard Pages Consolidation (Week 3)
**Goal:** Consolidate 32 dashboards into 6 role-specific views

#### 3.1 Dashboard File Structure
**New Structure:**
```
src/pages/dashboards/
├── OrganizerDashboard.tsx
├── DesignerDashboard.tsx  
├── VenueDashboard.tsx
├── SponsorDashboard.tsx
├── UserDashboard.tsx
└── shared/
    ├── MetricCard.tsx
    ├── StatCard.tsx
    ├── ActivityFeed.tsx
    ├── RevenueChart.tsx
    └── EventsList.tsx
```

#### 3.2 Consolidation Mapping
```
ORGANIZER:
- OrganizerDashboardNew → OrganizerDashboard.tsx
- MainDashboard → Merge into OrganizerDashboard
- EventManagement → Sub-route

DESIGNER:
- DesignerDashboard (keep, refactor)
- DesignersListDashboard → Admin view only

VENUE:
- VenueDashboard (keep, refactor)
- VenueDirectoryDashboard → Admin view only

SPONSOR:
- SponsorDashboardNew → SponsorDashboard.tsx

USER:
- UserDashboardFixed → UserDashboard.tsx
- MockDashboard → Remove (replaced by role-specific)
```

**Tasks:**
- [ ] Create 5 new role-specific dashboard files
- [ ] Build shared component library
- [ ] Migrate logic from existing dashboards
- [ ] Apply minimal design system
- [ ] Remove deprecated dashboard files (15+ files)

#### 3.3 Shared Components
**MetricCard Component:**
```tsx
<Card className="card-minimal">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-label text-gray-text">TOTAL EVENTS</p>
      <p className="text-page-title text-primary-dark">24</p>
      <p className="text-small text-gray-text flex items-center gap-1">
        <TrendingUp className="w-4 h-4 text-accent-success" />
        +12% from last month
      </p>
    </div>
    <Calendar className="w-8 h-8 text-gray-text" />
  </div>
</Card>
```

**Tasks:**
- [ ] Create `MetricCard` component
- [ ] Create `StatCard` component (simplified)
- [ ] Create `ActivityFeed` component
- [ ] Create `RevenueChart` component (minimal recharts)
- [ ] Create `EventsList` component

---

### Phase 4: Routing & Role Management (Week 4)
**Goal:** Implement proper role-based routing

#### 4.1 Auth & Role Detection
**New Files:**
```
src/hooks/
├── useUserRole.ts              (Detect user role from Clerk)
└── useRoleRedirect.ts          (Auto-redirect based on role)

src/contexts/
└── RoleContext.tsx             (Global role state)
```

**useUserRole Hook:**
```typescript
export const useUserRole = () => {
  const { user } = useUser();
  const role = user?.publicMetadata?.role || 'user';
  return { role, isOrganizer, isDesigner, isVenue, isSponsor };
}
```

**Tasks:**
- [ ] Create `useUserRole` hook with Clerk integration
- [ ] Create `RoleContext` for global state
- [ ] Implement role-based redirect logic
- [ ] Add role guards to routes

#### 4.2 Routing Updates
**File:** `src/App.tsx`

**New Route Structure:**
```tsx
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<Index />} />
  <Route path="/events" element={<Events />} />
  
  {/* Protected Dashboard Routes */}
  <Route path="/dashboard" element={<ProtectedRoute />}>
    <Route index element={<RoleBasedDashboard />} />
    
    {/* Organizer */}
    <Route path="organizer" element={<OrganizerDashboard />} />
    <Route path="events" element={<EventManagement />} />
    <Route path="create-event" element={<CreateEvent />} />
    
    {/* Designer */}
    <Route path="designer" element={<DesignerDashboard />} />
    <Route path="portfolio" element={<Portfolio />} />
    
    {/* Venue */}
    <Route path="venue" element={<VenueDashboard />} />
    
    {/* Sponsor */}
    <Route path="sponsor" element={<SponsorDashboard />} />
    
    {/* User */}
    <Route path="profile" element={<UserDashboard />} />
  </Route>
</Routes>
```

**Tasks:**
- [ ] Update `App.tsx` with new route structure
- [ ] Create `RoleBasedDashboard` component (auto-redirect)
- [ ] Remove duplicate/unused routes (20+ routes)
- [ ] Add proper route guards
- [ ] Test all navigation flows

---

### Phase 5: Advanced Components (Week 5)
**Goal:** Build reusable minimal components

#### 5.1 Data Display Components
**New Files:**
```
src/components/data/
├── DataTable.tsx               (Minimal table with sorting)
├── EmptyState.tsx              (Refactor existing)
├── LoadingState.tsx            (Skeleton patterns)
└── ErrorState.tsx              (Error display)
```

**Minimal Table Design:**
```css
.data-table {
  border: 1px solid var(--gray-border);
  border-radius: 8px;
}

.data-table thead {
  background: var(--gray-bg-subtle);
  border-bottom: 1px solid var(--gray-border);
}

.data-table tr:not(:last-child) {
  border-bottom: 1px solid var(--gray-border);
}
```

**Tasks:**
- [ ] Create minimal `DataTable` component
- [ ] Update `EmptyState` with minimal design
- [ ] Create loading skeletons (no heavy animations)
- [ ] Create error state component
- [ ] Apply to all list views

#### 5.2 Form Components
**New Files:**
```
src/components/forms/
├── FormInput.tsx               (Minimal input)
├── FormSelect.tsx              (Minimal dropdown)
├── FormTextarea.tsx            (Minimal textarea)
├── FormToggle.tsx              (Clean toggle)
└── FormDatePicker.tsx          (Minimal date picker)
```

**Minimal Input Style:**
```css
.form-input {
  background: white;
  border: 1px solid var(--gray-border);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
}

.form-input:focus {
  border-color: var(--primary-dark);
  outline: none;
}
```

**Tasks:**
- [ ] Create minimal form components
- [ ] Apply consistent focus states
- [ ] Add clear validation patterns
- [ ] Update all forms to use new components

---

### Phase 6: Mobile Optimization (Week 6)
**Goal:** Perfect mobile experience

#### 6.1 Mobile-First Layouts
**Responsive Breakpoints:**
```css
/* Mobile: 375px - 768px */
.dashboard-grid {
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 16px;
}

/* Tablet: 768px - 1024px */
@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    padding: 24px;
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    padding: 32px;
  }
}
```

**Tasks:**
- [ ] Test all dashboards on mobile (375px)
- [ ] Implement mobile sidebar (slide-in drawer)
- [ ] Optimize touch targets (min 44px)
- [ ] Test forms on mobile
- [ ] Optimize table scrolling on mobile

#### 6.2 Mobile Navigation
**Mobile Sidebar Pattern:**
```tsx
<Sheet> {/* shadcn Sheet for mobile menu */}
  <SheetTrigger>
    <Button variant="icon" size="icon">
      <Menu className="w-6 h-6" />
    </Button>
  </SheetTrigger>
  <SheetContent side="left">
    <DashboardSidebar role={role} />
  </SheetContent>
</Sheet>
```

**Tasks:**
- [ ] Implement mobile Sheet menu
- [ ] Add hamburger menu to top bar
- [ ] Test navigation flow on mobile
- [ ] Optimize touch interactions

---

## 📋 Detailed Task Checklist

### Design System Foundation
- [ ] Update color palette in `index.css`
- [ ] Update Tailwind config with new colors
- [ ] Remove Playfair Display font
- [ ] Create typography utility classes
- [ ] Update button component variants
- [ ] Update card component styling
- [ ] Update badge component variants
- [ ] Create minimal shadow utilities
- [ ] Remove heavy gradients
- [ ] Test dark mode compatibility

### Layout Components
- [ ] Create `DashboardLayout` component
- [ ] Create `DashboardTopbar` component
- [ ] Refactor `DashboardSidebar` component
- [ ] Create `DashboardContent` component
- [ ] Implement role-based menu logic
- [ ] Add sidebar collapse functionality
- [ ] Test responsive layouts
- [ ] Create mobile navigation drawer

### Dashboard Consolidation
- [ ] Create `OrganizerDashboard.tsx`
- [ ] Create `DesignerDashboard.tsx`
- [ ] Create `VenueDashboard.tsx`
- [ ] Create `SponsorDashboard.tsx`
- [ ] Create `UserDashboard.tsx`
- [ ] Create shared `MetricCard` component
- [ ] Create shared `StatCard` component
- [ ] Create shared `ActivityFeed` component
- [ ] Create shared `RevenueChart` component
- [ ] Create shared `EventsList` component
- [ ] Migrate data from old dashboards
- [ ] Delete 15+ deprecated dashboard files

### Routing & Auth
- [ ] Create `useUserRole` hook
- [ ] Create `RoleContext` provider
- [ ] Create `useRoleRedirect` hook
- [ ] Create `RoleBasedDashboard` component
- [ ] Update `App.tsx` routing structure
- [ ] Add route guards
- [ ] Remove duplicate routes
- [ ] Test all navigation flows
- [ ] Test role-based redirects

### Advanced Components
- [ ] Create `DataTable` component
- [ ] Update `EmptyState` component
- [ ] Create `LoadingState` component
- [ ] Create `ErrorState` component
- [ ] Create form input components
- [ ] Create form validation patterns
- [ ] Update all list views with new components
- [ ] Update all forms with new components

### Mobile Optimization
- [ ] Test mobile layout (375px)
- [ ] Implement mobile sidebar
- [ ] Optimize touch targets
- [ ] Test forms on mobile
- [ ] Test tables on mobile
- [ ] Test navigation on mobile
- [ ] Optimize performance
- [ ] Test on real devices

### Documentation
- [ ] Update component documentation
- [ ] Create style guide documentation
- [ ] Document role-based routing
- [ ] Create component examples
- [ ] Document responsive patterns

---

## 🎯 Success Metrics

### Design System
- ✅ All colors use HSL values
- ✅ Single font family (Inter)
- ✅ Consistent spacing (4px base)
- ✅ Minimal shadows/gradients
- ✅ Clean borders (1px solid)

### Performance
- ✅ Reduce dashboard files from 32 to 6
- ✅ Reduce routes from 60+ to 30
- ✅ Faster initial load time
- ✅ Better mobile performance

### User Experience
- ✅ Role-based navigation
- ✅ Consistent layouts
- ✅ Clear visual hierarchy
- ✅ Mobile-optimized
- ✅ Accessible (WCAG 2.1 AA)

---

## 🚀 Next Steps

1. **Review & Approve Plan** - Stakeholder sign-off
2. **Start Phase 1** - Foundation (color system, typography)
3. **Iterate Weekly** - Complete one phase per week
4. **Test Continuously** - Test each component as built
5. **Deploy Incrementally** - Roll out changes gradually

---

*Last Updated: Current Date*
*Version: 1.0*
*Owner: FashionOS Design Team*
