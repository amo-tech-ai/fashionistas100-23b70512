# Spacing & Layout System Documentation

## Spacing Philosophy
The Fashionistas platform uses a consistent 4px base unit spacing system that scales harmoniously across all screen sizes. This systematic approach ensures visual rhythm, alignment, and breathing room that reflects the premium, luxury aesthetic of the fashion industry.

## Base Spacing Unit
```css
/* Base unit: 4px */
--spacing-base: 0.25rem; /* 4px */
```

## Spacing Scale

### Core Spacing Values
```css
/* Tailwind spacing scale (rem values) */
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
--spacing-24: 6rem;     /* 96px */
--spacing-32: 8rem;     /* 128px */
```

### Extended Spacing (Custom)
```css
/* Custom spacing additions in tailwind.config.ts */
--spacing-18: 4.5rem;   /* 72px */
--spacing-22: 5.5rem;   /* 88px */
```

## Layout Spacing Guidelines

### 1. **Component Internal Spacing**

#### Card Components
```css
/* Card padding */
.card-padding-sm: 1rem;      /* 16px - Compact cards */
.card-padding-md: 1.5rem;    /* 24px - Standard cards */
.card-padding-lg: 2rem;      /* 32px - Feature cards */
.card-padding-xl: 3rem;      /* 48px - Hero cards */
```

#### Button Spacing
```css
/* Button internal padding */
.btn-padding-sm: 0.5rem 1rem;     /* 8px 16px */
.btn-padding-md: 0.75rem 1.5rem;  /* 12px 24px */
.btn-padding-lg: 1rem 2rem;       /* 16px 32px */
.btn-padding-xl: 1.25rem 2.5rem;  /* 20px 40px */
```

### 2. **Section Spacing**

#### Vertical Section Spacing
```css
/* Between major sections */
.section-spacing-sm: 3rem;    /* 48px - Mobile */
.section-spacing-md: 4rem;    /* 64px - Tablet */
.section-spacing-lg: 6rem;    /* 96px - Desktop */
.section-spacing-xl: 8rem;    /* 128px - Large desktop */
```

#### Content Block Spacing
```css
/* Between content blocks within sections */
.content-spacing-sm: 1.5rem;  /* 24px */
.content-spacing-md: 2rem;    /* 32px */
.content-spacing-lg: 3rem;    /* 48px */
```

### 3. **Grid & Layout Spacing**

#### Grid Gaps
```css
/* Grid system gaps */
.grid-gap-sm: 1rem;      /* 16px - Tight layouts */
.grid-gap-md: 1.5rem;    /* 24px - Standard layouts */
.grid-gap-lg: 2rem;      /* 32px - Spacious layouts */
.grid-gap-xl: 3rem;      /* 48px - Feature layouts */
```

#### Container Spacing
```css
/* Container horizontal padding */
.container-padding-mobile: 1rem;    /* 16px */
.container-padding-tablet: 2rem;    /* 32px */
.container-padding-desktop: 3rem;   /* 48px */
```

## Responsive Spacing Strategy

### Mobile-First Approach
```css
/* Base mobile spacing */
.section { 
  padding: 3rem 1rem;     /* 48px vertical, 16px horizontal */
}

/* Tablet and up */
@media screen and (min-width: 768px) {
  .section { 
    padding: 4rem 2rem;   /* 64px vertical, 32px horizontal */
  }
}

/* Desktop and up */
@media screen and (min-width: 1024px) {
  .section { 
    padding: 6rem 3rem;   /* 96px vertical, 48px horizontal */
  }
}
```

### Tailwind Responsive Classes
```html
<!-- Section spacing -->
<section class="py-12 px-4 md:py-16 md:px-8 lg:py-24 lg:px-12">

<!-- Grid spacing -->
<div class="grid gap-4 md:gap-6 lg:gap-8">

<!-- Component spacing -->
<div class="p-4 md:p-6 lg:p-8">
```

## Common Spacing Patterns

### 1. **Typography Spacing**
```css
/* Heading margins */
h1, h2, h3 { margin-bottom: 1.5rem; }  /* 24px */
h4, h5, h6 { margin-bottom: 1rem; }    /* 16px */

/* Paragraph spacing */
p { margin-bottom: 1rem; }              /* 16px */
p:last-child { margin-bottom: 0; }

/* List spacing */
ul, ol { margin-bottom: 1.5rem; }       /* 24px */
li { margin-bottom: 0.5rem; }           /* 8px */
```

### 2. **Form Element Spacing**
```css
/* Form group spacing */
.form-group { margin-bottom: 1.5rem; }  /* 24px */

/* Input spacing */
input, textarea, select {
  padding: 0.75rem 1rem;                /* 12px 16px */
  margin-bottom: 0.5rem;                /* 8px */
}

/* Label spacing */
label { margin-bottom: 0.5rem; }        /* 8px */
```

### 3. **Navigation Spacing**
```css
/* Navigation items */
.nav-item { 
  padding: 0.75rem 1rem;                /* 12px 16px */
  margin-right: 0.5rem;                 /* 8px */
}

/* Mobile menu spacing */
.mobile-nav-item { 
  padding: 1rem 1.5rem;                 /* 16px 24px */
  margin-bottom: 0.25rem;               /* 4px */
}
```

## Layout Patterns

### 1. **Card Layouts**
```html
<!-- Event Card -->
<div class="bg-card rounded-lg p-6 space-y-4">
  <div class="aspect-video rounded-lg overflow-hidden mb-4">
    <img class="w-full h-full object-cover" />
  </div>
  <div class="space-y-2">
    <h3 class="text-xl font-semibold">Event Title</h3>
    <p class="text-muted-foreground text-sm">Event details</p>
  </div>
  <div class="pt-4 border-t">
    <button class="w-full py-3">Get Tickets</button>
  </div>
</div>
```

### 2. **Hero Sections**
```html
<!-- Hero Layout -->
<section class="py-20 md:py-32 lg:py-40 px-4 md:px-8">
  <div class="max-w-4xl mx-auto text-center space-y-8">
    <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold">
      Hero Title
    </h1>
    <p class="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
      Hero description
    </p>
    <div class="pt-8">
      <button class="px-8 py-4 text-lg">Call to Action</button>
    </div>
  </div>
</section>
```

### 3. **Dashboard Layouts**
```html
<!-- Dashboard Grid -->
<div class="p-6 space-y-8">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div class="bg-card p-6 rounded-lg space-y-4">
      <h3 class="text-lg font-semibold">Metric Title</h3>
      <div class="space-y-2">
        <div class="text-3xl font-bold">Value</div>
        <div class="text-sm text-muted-foreground">Description</div>
      </div>
    </div>
  </div>
</div>
```

## Whitespace Hierarchy

### 1. **Micro Spacing** (4px - 12px)
- **Usage**: Icon padding, small gaps between related elements
- **Classes**: `space-x-1`, `space-y-1`, `gap-1`, `p-1`, `m-1`

### 2. **Minor Spacing** (16px - 24px)
- **Usage**: Component internal spacing, form elements
- **Classes**: `space-x-4`, `space-y-4`, `gap-4`, `p-4`, `m-4`

### 3. **Moderate Spacing** (32px - 48px)
- **Usage**: Between component groups, card spacing
- **Classes**: `space-x-8`, `space-y-8`, `gap-8`, `p-8`, `m-8`

### 4. **Major Spacing** (64px - 96px)
- **Usage**: Section separation, page layout
- **Classes**: `space-x-16`, `space-y-16`, `gap-16`, `p-16`, `m-16`

### 5. **Dramatic Spacing** (128px+)
- **Usage**: Hero sections, major layout separation
- **Classes**: `space-x-32`, `space-y-32`, `gap-32`, `p-32`, `m-32`

## Accessibility Considerations

### Touch Targets
```css
/* Minimum touch target size: 44px */
.touch-target {
  min-height: 2.75rem;    /* 44px */
  min-width: 2.75rem;     /* 44px */
  padding: 0.75rem;       /* 12px minimum */
}
```

### Focus Spacing
```css
/* Focus ring spacing */
.focus-ring {
  outline-offset: 0.125rem;  /* 2px */
  outline-width: 0.125rem;   /* 2px */
}
```

## Performance Optimization

### CSS Space Utilities
```css
/* Utility classes for common spacing patterns */
.space-y-content > * + * { margin-top: 1rem; }      /* 16px */
.space-y-section > * + * { margin-top: 3rem; }      /* 48px */
.space-y-page > * + * { margin-top: 6rem; }         /* 96px */
```

### Consistent Spacing Variables
```css
/* CSS custom properties for consistency */
:root {
  --space-component: 1rem;     /* 16px */
  --space-section: 3rem;       /* 48px */
  --space-page: 6rem;          /* 96px */
  --space-micro: 0.25rem;      /* 4px */
  --space-minor: 1rem;         /* 16px */
  --space-moderate: 2rem;      /* 32px */
  --space-major: 4rem;         /* 64px */
}
```

## Colombian Market Considerations

### Mobile-Optimized Spacing
- **Reduced spacing on mobile** for content density
- **Larger touch targets** for easier interaction
- **Simplified layouts** with clear spacing hierarchy

### Loading Performance
- **Consistent spacing classes** reduce CSS size
- **Systematic approach** enables better compression
- **Reusable patterns** improve caching

---
*Spacing system designed for Colombian mobile-first market and accessibility compliance*