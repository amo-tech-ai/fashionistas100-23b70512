# Typography System Documentation

## Typography Philosophy
The Fashionistas platform uses a dual-font system combining the elegance of Playfair Display for headers with the readability of Inter for body text. This pairing creates a sophisticated hierarchy that reflects the fashion industry's blend of artistry and functionality.

## Font Families

### Primary Fonts
```css
/* Headers & Display Text */
font-family: 'Playfair Display', serif;

/* Body Text & UI Elements */
font-family: 'Inter', sans-serif;
```

### Font Loading
```html
<!-- Google Fonts Implementation -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Typography Scale

### Tailwind Configuration
```css
/* tailwind.config.ts */
fontFamily: {
  'inter': ['Inter', 'sans-serif'],
  'playfair': ['Playfair Display', 'serif'],
}
```

### Font Size Scale
```css
/* Base sizes (Mobile-first) */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */
--text-7xl: 4.5rem;    /* 72px */
```

## Typography Hierarchy

### 1. Display Headings (H1)
```css
/* Hero Titles, Page Headers */
font-family: 'Playfair Display', serif;
font-size: 3rem;        /* 48px mobile, 4.5rem/72px desktop */
font-weight: 600;
line-height: 1.1;
letter-spacing: -0.02em;
color: hsl(var(--foreground));
```

**Usage**: Hero sections, main page titles, major section headers
**Classes**: `font-playfair text-5xl md:text-7xl font-semibold`

### 2. Section Headings (H2)
```css
/* Section Titles, Content Headers */
font-family: 'Playfair Display', serif;
font-size: 2.25rem;     /* 36px mobile, 3rem/48px desktop */
font-weight: 500;
line-height: 1.2;
letter-spacing: -0.01em;
color: hsl(var(--foreground));
```

**Usage**: Section headers, card titles, modal headers
**Classes**: `font-playfair text-4xl md:text-5xl font-medium`

### 3. Subsection Headings (H3)
```css
/* Card Titles, Component Headers */
font-family: 'Playfair Display', serif;
font-size: 1.5rem;      /* 24px mobile, 1.875rem/30px desktop */
font-weight: 500;
line-height: 1.3;
letter-spacing: normal;
color: hsl(var(--foreground));
```

**Usage**: Event titles, designer names, component headers
**Classes**: `font-playfair text-2xl md:text-3xl font-medium`

### 4. Content Headings (H4-H6)
```css
/* Small Headers, Labels */
font-family: 'Inter', sans-serif;
font-size: 1.125rem;    /* 18px mobile, 1.25rem/20px desktop */
font-weight: 600;
line-height: 1.4;
letter-spacing: normal;
color: hsl(var(--foreground));
```

**Usage**: Form labels, small section headers, navigation items
**Classes**: `font-inter text-lg md:text-xl font-semibold`

### 5. Body Text
```css
/* Main Content Text */
font-family: 'Inter', sans-serif;
font-size: 1rem;        /* 16px base */
font-weight: 400;
line-height: 1.6;
letter-spacing: normal;
color: hsl(var(--foreground));
```

**Usage**: Paragraphs, descriptions, general content
**Classes**: `font-inter text-base leading-relaxed`

### 6. Secondary Text
```css
/* Meta Information, Captions */
font-family: 'Inter', sans-serif;
font-size: 0.875rem;    /* 14px */
font-weight: 400;
line-height: 1.5;
letter-spacing: 0.01em;
color: hsl(var(--muted-foreground));
```

**Usage**: Dates, locations, meta information, captions
**Classes**: `font-inter text-sm text-muted-foreground`

### 7. Small Text
```css
/* Legal Text, Fine Print */
font-family: 'Inter', sans-serif;
font-size: 0.75rem;     /* 12px */
font-weight: 400;
line-height: 1.4;
letter-spacing: 0.02em;
color: hsl(var(--muted-foreground));
```

**Usage**: Copyright, legal text, fine print
**Classes**: `font-inter text-xs text-muted-foreground`

## Font Weight Guidelines

### Playfair Display Usage
- **400 (Regular)**: Standard display text
- **500 (Medium)**: Section headers, emphasized content
- **600 (Semi-bold)**: Main headings, hero titles
- **700 (Bold)**: Special emphasis (use sparingly)

### Inter Usage
- **400 (Regular)**: Body text, descriptions
- **500 (Medium)**: Slightly emphasized text
- **600 (Semi-bold)**: UI labels, navigation, buttons
- **700 (Bold)**: Strong emphasis, warnings

## Responsive Typography

### Mobile-First Approach
```css
/* Mobile base sizes */
.hero-title {
  font-size: 2.25rem;    /* 36px */
  line-height: 1.1;
}

/* Tablet and up */
@media screen and (min-width: 768px) {
  .hero-title {
    font-size: 3.75rem;   /* 60px */
  }
}

/* Desktop and up */
@media screen and (min-width: 1024px) {
  .hero-title {
    font-size: 4.5rem;    /* 72px */
  }
}
```

### Tailwind Responsive Classes
```html
<!-- Hero Title -->
<h1 class="font-playfair text-4xl md:text-6xl lg:text-7xl font-semibold">

<!-- Section Header -->
<h2 class="font-playfair text-3xl md:text-4xl lg:text-5xl font-medium">

<!-- Body Text -->
<p class="font-inter text-base md:text-lg leading-relaxed">
```

## Spanish Language Considerations

### Character Support
Both fonts support full Spanish character set including:
- Accented characters: á, é, í, ó, ú, ü, ñ
- Special punctuation: ¿, ¡
- Proper line breaking for Spanish text

### Readability Optimizations
```css
/* Enhanced readability for Spanish text */
font-feature-settings: "kern" 1, "liga" 1;
text-rendering: optimizeLegibility;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

## Accessibility Standards

### Contrast Requirements
- **Large Text** (18px+): Minimum 3:1 contrast ratio
- **Normal Text** (under 18px): Minimum 4.5:1 contrast ratio
- **UI Text**: Follow component-specific contrast requirements

### Readability Guidelines
- **Line Height**: Minimum 1.5 for body text
- **Letter Spacing**: Slight positive values for small text
- **Word Spacing**: Default browser spacing
- **Paragraph Spacing**: 1.5x line height minimum

## Implementation Examples

### Component Headers
```tsx
// Event Card Title
<h3 className="font-playfair text-2xl font-medium text-foreground mb-2">
  {eventTitle}
</h3>

// Event Details
<p className="font-inter text-sm text-muted-foreground">
  {eventDate} • {eventLocation}
</p>
```

### Form Elements
```tsx
// Form Label
<label className="font-inter text-sm font-semibold text-foreground">
  Event Name
</label>

// Form Input
<input className="font-inter text-base placeholder:text-muted-foreground" />
```

### Navigation
```tsx
// Navigation Item
<a className="font-inter text-base font-medium hover:text-accent transition-colors">
  Eventos
</a>
```

## Performance Considerations

### Font Loading Strategy
```css
/* Font display optimization */
@font-face {
  font-family: 'Inter';
  font-display: swap;
  /* Ensures text remains visible during font load */
}

@font-face {
  font-family: 'Playfair Display';
  font-display: swap;
}
```

### Fallback Fonts
```css
font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

---
*Typography tested for Spanish language support and WCAG 2.1 AA compliance*