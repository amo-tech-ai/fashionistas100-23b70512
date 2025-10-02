# Mobile-First Component Patterns Guide

## Philosophy

Build for mobile first, then enhance for larger screens. This ensures the best experience for the majority of users and creates a solid foundation for all screen sizes.

## Core Principles

### 1. **Mobile-First CSS**
Always start with mobile styles and use `min-width` media queries for larger screens.

```css
/* ❌ WRONG - Desktop first */
.component {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {
  .component {
    grid-template-columns: 1fr;
  }
}

/* ✅ CORRECT - Mobile first */
.component {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .component {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 2. **Touch-First Interactions**
Design for touch, enhance with hover.

```tsx
// ✅ Touch-friendly component
<Button 
  className="min-touch" // 44px minimum
  onClick={handleClick}
  onTouchStart={handleTouch}
>
  Action
</Button>

// ✅ Progressive enhancement
<Card className="hover:shadow-lg focus-within:ring-2">
  Content
</Card>
```

### 3. **Content-First Layout**
Prioritize content visibility and readability on small screens.

```tsx
// ✅ Content stacks naturally on mobile
<div className="space-y-4 md:flex md:space-y-0 md:space-x-4">
  <main className="flex-1">Primary content</main>
  <aside className="md:w-64">Secondary content</aside>
</div>
```

## Component Patterns

### Responsive Tables

Always use `ResponsiveTable` for tabular data:

```tsx
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';

// Desktop: traditional table
// Mobile: card layout
<ResponsiveTable
  headers={['Name', 'Email', 'Status']}
  data={users}
  renderRow={(user) => (
    <>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.status}</td>
    </>
  )}
  renderMobileCard={(user) => (
    <div className="space-y-2">
      <h3 className="ds-h6">{user.name}</h3>
      <p className="ds-text-sm">{user.email}</p>
      <Badge>{user.status}</Badge>
    </div>
  )}
  onRowClick={(user) => navigate(`/users/${user.id}`)}
/>
```

### Responsive Charts

Always wrap charts in `ChartResponsive`:

```tsx
import { ChartResponsive } from '@/components/ui/ChartResponsive';

<ChartResponsive>
  <LineChart data={data}>
    <Line dataKey="value" stroke="var(--primary)" />
    <XAxis dataKey="name" />
    <YAxis />
  </LineChart>
</ChartResponsive>
```

### Mobile Forms

Use `MobileForm` components for better mobile UX:

```tsx
import { MobileForm, MobileFormField, MobileInput } from '@/components/ui/MobileForm';

<MobileForm onSubmit={handleSubmit}>
  <MobileFormField label="Email" required>
    <MobileInput 
      type="email"
      placeholder="you@example.com"
      autoComplete="email"
    />
  </MobileFormField>
  
  <Button type="submit" className="min-touch w-full">
    Submit
  </Button>
</MobileForm>
```

### Navigation Patterns

#### Mobile Menu
```tsx
const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {/* Mobile toggle */}
      <button
        className="min-touch md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <Menu />
      </button>
      
      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <nav className="absolute right-0 top-0 h-full w-64 bg-background p-4">
            {/* Navigation items */}
          </nav>
        </div>
      )}
      
      {/* Desktop nav */}
      <nav className="hidden md:flex md:space-x-4">
        {/* Navigation items */}
      </nav>
    </>
  );
};
```

### Touch Gestures

#### Swipe to Delete
```tsx
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

const SwipeableCard = ({ item, onDelete }) => {
  const bind = useSwipeGesture({
    onSwipeLeft: () => onDelete(item.id),
    threshold: 100,
  });
  
  return (
    <div {...bind()} className="touch-pan-y">
      {/* Card content */}
    </div>
  );
};
```

#### Pull to Refresh
```tsx
import { PullToRefresh } from '@/components/PullToRefresh';

const Dashboard = () => {
  const handleRefresh = async () => {
    await refetchData();
  };
  
  return (
    <PullToRefresh onRefresh={handleRefresh}>
      {/* Dashboard content */}
    </PullToRefresh>
  );
};
```

## Design System Tokens

### Touch Targets
```css
/* Always use these classes for interactive elements */
.min-touch    /* 44x44px minimum */
.min-touch-lg /* 48x48px for primary actions */
```

### Typography Scale
```css
/* Mobile-first, scales up */
.ds-h1 /* 28px -> 48px */
.ds-h2 /* 24px -> 36px */
.ds-h3 /* 20px -> 30px */
.ds-h4 /* 18px -> 24px */
.ds-h5 /* 16px -> 20px */
.ds-h6 /* 14px -> 18px */
```

### Spacing
```css
/* Mobile optimized spacing */
.mobile-section   /* padding: 1rem -> 2rem */
.mobile-container /* max-width: 100% -> 1200px */
.mobile-gap       /* gap: 0.75rem -> 1.5rem */
```

## Responsive Patterns

### Container Queries (Future)
```tsx
// When browser support improves
<div className="@container">
  <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3">
    {/* Cards */}
  </div>
</div>
```

### Adaptive Loading
```tsx
const Image = ({ src, alt }) => {
  const isMobile = useIsMobile();
  
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      width={isMobile ? 375 : 1200}
      height={isMobile ? 250 : 600}
    />
  );
};
```

## Testing Checklist

Before shipping any component:

- [ ] Test on iPhone SE (320px width minimum)
- [ ] Test on iPad Pro (1024px width maximum tablet)
- [ ] All touch targets ≥ 44px
- [ ] No horizontal scroll at any breakpoint
- [ ] Text readable without zoom (16px minimum)
- [ ] Forms don't trigger iOS zoom (16px inputs)
- [ ] Hover states have touch equivalents
- [ ] Works with keyboard navigation
- [ ] Screen reader accessible

## Common Mistakes to Avoid

### ❌ Fixed Widths
```tsx
// BAD
<div style={{ width: 600 }}>Content</div>

// GOOD
<div className="w-full max-w-2xl">Content</div>
```

### ❌ Small Touch Targets
```tsx
// BAD
<button className="p-1 text-xs">Delete</button>

// GOOD
<button className="min-touch">Delete</button>
```

### ❌ Viewport Units Without Fallback
```tsx
// BAD
<div className="h-screen">Content</div>

// GOOD (accounts for mobile address bar)
<div className="min-h-screen">Content</div>
```

### ❌ Hover-Only Interactions
```tsx
// BAD
<div className="group">
  <div className="hidden group-hover:block">Actions</div>
</div>

// GOOD
<div className="group">
  <div className="md:hidden md:group-hover:block">Actions</div>
  <button className="md:hidden">Show Actions</button>
</div>
```

## Performance Best Practices

### Image Optimization
```tsx
// ✅ Responsive images
<picture>
  <source 
    media="(max-width: 768px)" 
    srcSet="/image-mobile.webp" 
  />
  <source 
    media="(min-width: 769px)" 
    srcSet="/image-desktop.webp" 
  />
  <img src="/image-fallback.jpg" alt="Description" loading="lazy" />
</picture>
```

### Code Splitting
```tsx
// ✅ Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));

<Suspense fallback={<Skeleton />}>
  <HeavyChart data={data} />
</Suspense>
```

### Critical CSS
```tsx
// ✅ Inline critical styles
<head>
  <style>{criticalCSS}</style>
  <link rel="stylesheet" href="/main.css" media="print" onload="this.media='all'" />
</head>
```

## Resources

- [WCAG 2.1 Touch Target Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [Mobile-First CSS](https://web.dev/responsive-web-design-basics/)
- [Touch-Friendly Design](https://www.lukew.com/ff/entry.asp?1085)
- [Core Web Vitals](https://web.dev/vitals/)
