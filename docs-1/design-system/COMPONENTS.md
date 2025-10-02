# Component Library Documentation

## Component Architecture Philosophy
The Fashionistas platform uses a systematic component architecture built on shadcn/ui with custom variants and styling. Each component follows consistent patterns for theming, accessibility, and responsive behavior while maintaining the luxury fashion aesthetic.

## Core Component Categories

### 1. **Foundation Components**
Base UI components that form the building blocks of the interface.

### 2. **Layout Components**
Components that handle page structure, navigation, and content organization.

### 3. **Content Components**
Components that display fashion-specific content like events, designers, and tickets.

### 4. **Interactive Components**
Components that handle user interaction, forms, and dynamic behavior.

### 5. **Feedback Components**
Components for loading states, errors, success messages, and user feedback.

## Foundation Components

### Button Component
**File**: `src/components/ui/button.tsx`

#### Variants
```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-inter",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-card hover:shadow-hover",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-card hover:shadow-hover",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-card hover:shadow-hover",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-card hover:shadow-hover",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-brand text-brand-foreground hover:opacity-90 shadow-subtle hover:shadow-moderate transform hover:scale-105 transition-smooth",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-card hover:shadow-hover",
      },
      size: {
        default: "h-12 px-6 py-3 text-sm",
        sm: "h-10 rounded-lg px-4 text-sm",
        lg: "h-14 rounded-lg px-8 text-base",
        xl: "h-16 rounded-xl px-10 text-lg",
        icon: "h-12 w-12",
      },
    }
  }
)
```

#### Usage Examples
```tsx
// Primary CTA button
<Button variant="default" size="lg">
  Get Tickets
</Button>

// Hero section button
<Button variant="hero" size="xl">
  Explore Events
</Button>

// Secondary action
<Button variant="outline" size="default">
  Learn More
</Button>

// Icon button
<Button variant="ghost" size="icon">
  <HeartIcon />
</Button>
```

### Card Component
**File**: `src/components/ui/card.tsx`

#### Structure
```tsx
<Card className="overflow-hidden shadow-moderate">
  <CardHeader className="pb-4">
    <CardTitle>Event Title</CardTitle>
    <CardDescription>Event description</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Main content */}
  </CardContent>
  <CardFooter className="pt-4 border-t">
    {/* Action buttons */}
  </CardFooter>
</Card>
```

#### Styling Patterns
```css
/* Standard card styling */
.card-default {
  @apply rounded-lg border bg-card text-card-foreground shadow-sm;
}

/* Feature card styling */
.card-feature {
  @apply rounded-xl border-2 bg-gradient-card shadow-moderate hover:shadow-prominent;
}

/* Interactive card styling */
.card-interactive {
  @apply transition-smooth hover:scale-105 cursor-pointer;
}
```

### Badge Component
**File**: `src/components/ui/badge.tsx`

#### Variants
```typescript
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-inter",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        hero: "border-transparent bg-gradient-accent text-white shadow-elegant",
        accent: "border-transparent bg-accent text-accent-foreground hover:bg-accent/80",
      },
    }
  }
)
```

## Layout Components

### DashboardLayout Component
**File**: `src/components/DashboardLayout.tsx`

#### Structure
```tsx
<DashboardLayout showSidebar={true}>
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Button variant="default">Create Event</Button>
    </div>
    {/* Dashboard content */}
  </div>
</DashboardLayout>
```

#### Features
- Responsive navigation bar
- Collapsible sidebar
- Footer integration
- Consistent spacing and typography

### Navigation Components
**Files**: 
- `src/components/Navigation.tsx` - Main site navigation
- `src/components/DashboardNavbar.tsx` - Dashboard navigation
- `src/components/DashboardSidebar.tsx` - Dashboard sidebar

#### Navigation Patterns
```tsx
// Desktop navigation
<nav className="hidden md:flex items-center space-x-8">
  <NavLink 
    to="/events" 
    className={({ isActive }) => 
      cn("font-inter font-medium transition-colors hover:text-accent",
         isActive ? "text-accent" : "text-foreground"
      )
    }
  >
    Eventos
  </NavLink>
</nav>

// Mobile navigation
<div className="md:hidden">
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon">
        <MenuIcon />
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      {/* Mobile navigation content */}
    </SheetContent>
  </Sheet>
</div>
```

## Content Components

### EventCard Component
**File**: `src/components/EventCard.tsx`

#### Structure
```tsx
<Card className="overflow-hidden hover:shadow-moderate transition-smooth group">
  <div className="aspect-video overflow-hidden">
    <img 
      src={event.image_url} 
      alt={event.title}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  </div>
  <CardContent className="p-6 space-y-4">
    <div className="space-y-2">
      <h3 className="font-playfair text-xl font-semibold line-clamp-2">
        {event.title}
      </h3>
      <div className="flex items-center text-sm text-muted-foreground">
        <CalendarIcon className="w-4 h-4 mr-2" />
        {formatDate(event.event_date)}
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <MapPinIcon className="w-4 h-4 mr-2" />
        {event.location}
      </div>
    </div>
    <div className="flex items-center justify-between pt-4">
      <div className="text-lg font-semibold">
        ${event.price}
      </div>
      <Button variant="accent" size="sm">
        Get Tickets
      </Button>
    </div>
  </CardContent>
</Card>
```

### DesignerCard Component
**File**: `src/components/DesignerCard.tsx`

#### Features
- Profile image with hover effects
- Designer name and specialty
- Social media links
- Portfolio preview
- Contact information

### Hero Component
**File**: `src/components/Hero.tsx`

#### Responsive Design
```tsx
<section className="relative min-h-screen flex items-center justify-center bg-gradient-hero text-white">
  <div className="absolute inset-0 bg-black/40" />
  <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
    <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
      Fashion Events
    </h1>
    <p className="font-inter text-lg md:text-xl lg:text-2xl mb-8 text-white/90">
      Discover exclusive fashion experiences
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button variant="hero" size="xl">
        Browse Events
      </Button>
      <Button variant="outline" size="xl">
        Learn More
      </Button>
    </div>
  </div>
</section>
```

## Interactive Components

### Form Components
**Files**: Various form-related components

#### Form Field Pattern
```tsx
<div className="space-y-2">
  <Label 
    htmlFor="eventName" 
    className="font-inter text-sm font-semibold text-foreground"
  >
    Event Name
  </Label>
  <Input
    id="eventName"
    type="text"
    placeholder="Enter event name"
    className="font-inter"
    {...register("eventName")}
  />
  {errors.eventName && (
    <p className="text-sm text-destructive">
      {errors.eventName.message}
    </p>
  )}
</div>
```

#### Form Validation Patterns
```tsx
const eventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.date().min(new Date(), "Date must be in the future"),
  location: z.string().min(1, "Location is required"),
  price: z.number().min(0, "Price cannot be negative"),
});
```

### Dialog/Modal Components
**Files**: Using shadcn/ui Dialog component

#### Modal Pattern
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button variant="default">Open Modal</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="font-playfair text-2xl">
        Modal Title
      </DialogTitle>
      <DialogDescription className="font-inter text-muted-foreground">
        Modal description
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4">
      {/* Modal content */}
    </div>
    <DialogFooter className="gap-2">
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="default">
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Feedback Components

### Loading States
**File**: `src/components/LoadingSkeleton.tsx`

#### Skeleton Patterns
```tsx
// Card skeleton
<div className="animate-pulse">
  <div className="aspect-video bg-muted rounded-lg mb-4" />
  <div className="space-y-2">
    <div className="h-6 bg-muted rounded w-3/4" />
    <div className="h-4 bg-muted rounded w-1/2" />
    <div className="h-4 bg-muted rounded w-2/3" />
  </div>
</div>

// Text skeleton
<div className="animate-pulse space-y-2">
  <div className="h-4 bg-muted rounded w-full" />
  <div className="h-4 bg-muted rounded w-5/6" />
  <div className="h-4 bg-muted rounded w-4/5" />
</div>
```

### Error States
**File**: `src/components/ErrorBoundary.tsx`

#### Error Display Pattern
```tsx
<div className="text-center py-12 px-4">
  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
    <AlertTriangleIcon className="w-8 h-8 text-destructive" />
  </div>
  <h3 className="font-playfair text-xl font-semibold mb-2">
    Something went wrong
  </h3>
  <p className="font-inter text-muted-foreground mb-6">
    We encountered an error while loading this content.
  </p>
  <Button variant="default" onClick={onRetry}>
    Try Again
  </Button>
</div>
```

### Empty States
**File**: `src/components/ui/EmptyState.tsx`

#### Empty State Pattern
```tsx
<div className="text-center py-16 px-4">
  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
    <SearchIcon className="w-10 h-10 text-muted-foreground" />
  </div>
  <h3 className="font-playfair text-2xl font-semibold mb-3">
    No events found
  </h3>
  <p className="font-inter text-muted-foreground mb-8 max-w-md mx-auto">
    We couldn't find any events matching your criteria. Try adjusting your filters or check back later.
  </p>
  <Button variant="default">
    Browse All Events
  </Button>
</div>
```

## Component Composition Patterns

### Higher-Order Component Pattern
```tsx
// HOC for loading states
const withLoading = <P extends object>(Component: React.ComponentType<P>) => {
  return ({ isLoading, ...props }: P & { isLoading: boolean }) => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }
    return <Component {...(props as P)} />;
  };
};

// Usage
const EventCardWithLoading = withLoading(EventCard);
```

### Compound Component Pattern
```tsx
// Event listing with compound components
<EventListing>
  <EventListing.Header>
    <EventListing.Title>Upcoming Events</EventListing.Title>
    <EventListing.Actions>
      <Button variant="default">Create Event</Button>
    </EventListing.Actions>
  </EventListing.Header>
  <EventListing.Filters>
    <EventListing.Filter type="category" />
    <EventListing.Filter type="date" />
  </EventListing.Filters>
  <EventListing.Grid>
    {events.map(event => (
      <EventCard key={event.id} event={event} />
    ))}
  </EventListing.Grid>
</EventListing>
```

## Accessibility Standards

### ARIA Patterns
```tsx
// Button with ARIA
<Button
  variant="default"
  aria-label="Get tickets for Fashion Week 2024"
  aria-describedby="event-description"
>
  Get Tickets
</Button>

// Modal with ARIA
<Dialog
  role="dialog"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <DialogTitle id="modal-title">Event Details</DialogTitle>
  <DialogDescription id="modal-description">
    View and edit event information
  </DialogDescription>
</Dialog>
```

### Keyboard Navigation
```tsx
// Keyboard-accessible card
<Card
  tabIndex={0}
  className="focus:ring-2 focus:ring-accent focus:outline-none cursor-pointer"
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  {/* Card content */}
</Card>
```

## Performance Optimization

### Component Memoization
```tsx
// Memoized event card
const EventCard = React.memo(({ event }: { event: Event }) => {
  return (
    <Card>
      {/* Component content */}
    </Card>
  );
});

// Memoized list with custom comparison
const EventList = React.memo(({ events }: { events: Event[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.events.length === nextProps.events.length;
});
```

### Lazy Loading
```tsx
// Lazy-loaded components
const EventDetail = React.lazy(() => import('./EventDetail'));
const Dashboard = React.lazy(() => import('./Dashboard'));

// Usage with Suspense
<Suspense fallback={<LoadingSkeleton />}>
  <EventDetail eventId={eventId} />
</Suspense>
```

---
*Component library built for Colombian fashion market with accessibility and performance standards*