# Component Development Patterns

## Architecture Philosophy
The Fashionistas platform follows a component-driven architecture built on React 18, TypeScript, and modern development patterns. Each component is designed for reusability, maintainability, and performance while adhering to the luxury fashion aesthetic.

## Core Development Principles

### 1. **Component Composition over Inheritance**
- Build complex UIs from simple, reusable components
- Use composition patterns for flexibility
- Avoid deep component hierarchies

### 2. **Type Safety First**
- Full TypeScript implementation
- Strict type checking enabled
- Comprehensive interface definitions

### 3. **Performance by Design**
- React.memo for expensive components
- Lazy loading for route-based code splitting
- Optimized re-rendering patterns

### 4. **Accessibility Built-in**
- WCAG 2.1 AA compliance by default
- Semantic HTML structure
- Keyboard navigation support

## Component Structure Template

### Basic Component Pattern
```typescript
// ComponentName.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentNameProps {
  className?: string;
  children?: React.ReactNode;
  // Specific props with clear types
  title: string;
  description?: string;
  variant?: 'default' | 'featured' | 'compact';
  onAction?: (data: ActionData) => void;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  className,
  children,
  title,
  description,
  variant = 'default',
  onAction,
}) => {
  // Local state management
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Event handlers
  const handleAction = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await performAction();
      onAction?.(result);
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onAction]);

  // Render component
  return (
    <div className={cn(
      "base-component-classes",
      {
        "variant-classes": variant === 'featured',
        "loading-classes": isLoading,
      },
      className
    )}>
      <h3 className="font-playfair text-xl font-medium">
        {title}
      </h3>
      {description && (
        <p className="font-inter text-muted-foreground">
          {description}
        </p>
      )}
      {children}
    </div>
  );
};

export default ComponentName;
```

### Compound Component Pattern
```typescript
// EventListing.tsx - Main component
interface EventListingProps {
  children: React.ReactNode;
  className?: string;
}

export const EventListing: React.FC<EventListingProps> & {
  Header: typeof EventListingHeader;
  Grid: typeof EventListingGrid;
  Filter: typeof EventListingFilter;
} = ({ children, className }) => {
  return (
    <div className={cn("space-y-8", className)}>
      {children}
    </div>
  );
};

// EventListingHeader sub-component
interface EventListingHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const EventListingHeader: React.FC<EventListingHeaderProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {children}
    </div>
  );
};

// EventListingGrid sub-component
interface EventListingGridProps {
  children: React.ReactNode;
  columns?: 'auto' | 1 | 2 | 3 | 4;
  className?: string;
}

const EventListingGrid: React.FC<EventListingGridProps> = ({ 
  children, 
  columns = 'auto',
  className 
}) => {
  const gridClasses = {
    auto: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={cn(
      "grid gap-6",
      gridClasses[columns],
      className
    )}>
      {children}
    </div>
  );
};

// Attach sub-components
EventListing.Header = EventListingHeader;
EventListing.Grid = EventListingGrid;
EventListing.Filter = EventListingFilter;

// Usage
<EventListing>
  <EventListing.Header>
    <h2 className="font-playfair text-3xl font-semibold">Upcoming Events</h2>
    <Button variant="default">Create Event</Button>
  </EventListing.Header>
  <EventListing.Grid columns={3}>
    {events.map(event => (
      <EventCard key={event.id} event={event} />
    ))}
  </EventListing.Grid>
</EventListing>
```

## Custom Hook Patterns

### Data Fetching Hook
```typescript
// useEventData.ts
interface UseEventDataOptions {
  category?: string;
  limit?: number;
  sortBy?: 'date' | 'popularity' | 'price';
}

interface UseEventDataReturn {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export const useEventData = (
  options: UseEventDataOptions = {}
): UseEventDataReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchEvents = useCallback(async (reset = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const currentPage = reset ? 1 : page;
      const response = await eventService.getEvents({
        ...options,
        page: currentPage,
        limit: options.limit || 10,
      });

      if (reset) {
        setEvents(response.data);
        setPage(2);
      } else {
        setEvents(prev => [...prev, ...response.data]);
        setPage(prev => prev + 1);
      }

      setHasMore(response.data.length === (options.limit || 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  }, [options, page]);

  const refetch = useCallback(() => fetchEvents(true), [fetchEvents]);
  const loadMore = useCallback(() => fetchEvents(false), [fetchEvents]);

  useEffect(() => {
    fetchEvents(true);
  }, [options.category, options.sortBy]);

  return {
    events,
    isLoading,
    error,
    refetch,
    hasMore,
    loadMore,
  };
};
```

### Form Management Hook
```typescript
// useFormManager.ts
interface UseFormManagerOptions<T> {
  initialValues: T;
  validationSchema?: z.ZodSchema<T>;
  onSubmit: (values: T) => Promise<void> | void;
  onSuccess?: (values: T) => void;
  onError?: (error: Error) => void;
}

export const useFormManager = <T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  onSuccess,
  onError,
}: UseFormManagerOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // Clear field error when value changes
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    if (!validationSchema) return true;

    try {
      validationSchema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof T, string>> = {};
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as keyof T] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  }, [values, validationSchema]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      onSuccess?.(values);
      setIsDirty(false);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Submission failed');
      onError?.(err);
      setErrors(prev => ({ ...prev, _form: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit, onSuccess, onError]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsDirty(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    isDirty,
    setValue,
    handleSubmit,
    validateForm,
    reset,
  };
};
```

## Service Layer Patterns

### API Service Pattern
```typescript
// eventService.ts
interface EventFilters {
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'price' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

interface ApiResponse<T> {
  data: T;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class EventService {
  private readonly baseUrl = '/api/events';

  async getEvents(filters: EventFilters = {}): Promise<ApiResponse<Event[]>> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseUrl}?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('EventService.getEvents:', error);
      throw error;
    }
  }

  async getEvent(id: string): Promise<Event> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Event not found');
        }
        throw new Error(`Failed to fetch event: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('EventService.getEvent:', error);
      throw error;
    }
  }

  async createEvent(eventData: CreateEventData): Promise<Event> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create event');
      }

      return await response.json();
    } catch (error) {
      console.error('EventService.createEvent:', error);
      throw error;
    }
  }

  async updateEvent(id: string, eventData: UpdateEventData): Promise<Event> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      return await response.json();
    } catch (error) {
      console.error('EventService.updateEvent:', error);
      throw error;
    }
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
    } catch (error) {
      console.error('EventService.deleteEvent:', error);
      throw error;
    }
  }
}

export const eventService = new EventService();
```

## Error Handling Patterns

### Error Boundary Component
```typescript
// ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service
    this.props.onError?.(error, errorInfo);
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent 
          error={this.state.error!} 
          reset={this.handleReset} 
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback component
const DefaultErrorFallback: React.FC<{ error: Error; reset: () => void }> = ({
  error,
  reset,
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
          <AlertTriangleIcon className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="font-playfair text-xl font-semibold">
            Something went wrong
          </h3>
          <p className="font-inter text-muted-foreground">
            {error.message || 'An unexpected error occurred'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="default" onClick={reset}>
            Try Again
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
};
```

## Performance Optimization Patterns

### Memoization Strategies
```typescript
// Expensive calculation memoization
const ExpensiveComponent: React.FC<{ data: ComplexData[] }> = ({ data }) => {
  const processedData = useMemo(() => {
    return data
      .filter(item => item.isActive)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [data]);

  return (
    <div>
      {processedData.map(item => (
        <ExpensiveItem key={item.id} item={item} />
      ))}
    </div>
  );
};

// Component memoization with custom comparison
const OptimizedEventCard = React.memo<EventCardProps>(({ event, onAction }) => {
  return (
    <Card>
      {/* Component implementation */}
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison logic
  return (
    prevProps.event.id === nextProps.event.id &&
    prevProps.event.updatedAt === nextProps.event.updatedAt
  );
});
```

### Lazy Loading Patterns
```typescript
// Route-based lazy loading
const EventDetail = lazy(() => import('@/pages/EventDetail'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const CreateEvent = lazy(() => import('@/pages/CreateEvent'));

// Component-based lazy loading with retry
const LazyComponent = lazy(() => 
  import('./HeavyComponent').catch(() => 
    import('./FallbackComponent')
  )
);

// Image lazy loading
const LazyImage: React.FC<{ src: string; alt: string; className?: string }> = ({
  src,
  alt,
  className,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && imgRef.current) {
          const img = imgRef.current;
          img.src = src;
          img.onload = () => setIsLoaded(true);
          img.onerror = () => setIsError(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        ref={imgRef}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />
      {isError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};
```

## Testing Patterns

### Component Testing
```typescript
// EventCard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EventCard } from './EventCard';
import { mockEvent } from '@/test/mocks';

describe('EventCard', () => {
  it('renders event information correctly', () => {
    render(<EventCard event={mockEvent} />);
    
    expect(screen.getByText(mockEvent.title)).toBeInTheDocument();
    expect(screen.getByText(mockEvent.location)).toBeInTheDocument();
    expect(screen.getByText(`$${mockEvent.price}`)).toBeInTheDocument();
  });

  it('calls onTicketPurchase when Get Tickets button is clicked', async () => {
    const mockOnTicketPurchase = jest.fn();
    
    render(
      <EventCard 
        event={mockEvent} 
        onTicketPurchase={mockOnTicketPurchase} 
      />
    );
    
    const ticketButton = screen.getByRole('button', { name: /get tickets/i });
    fireEvent.click(ticketButton);
    
    await waitFor(() => {
      expect(mockOnTicketPurchase).toHaveBeenCalledWith(mockEvent.id);
    });
  });

  it('displays loading state correctly', () => {
    render(<EventCard event={mockEvent} isLoading={true} />);
    
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });
});
```

### Hook Testing
```typescript
// useEventData.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useEventData } from './useEventData';
import { eventService } from '@/services/eventService';

jest.mock('@/services/eventService');

describe('useEventData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches events on mount', async () => {
    const mockEvents = [mockEvent1, mockEvent2];
    (eventService.getEvents as jest.Mock).mockResolvedValue({
      data: mockEvents,
      meta: { total: 2, page: 1, limit: 10, totalPages: 1 }
    });

    const { result } = renderHook(() => useEventData());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.events).toEqual(mockEvents);
    expect(eventService.getEvents).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
    });
  });
});
```

---
*Development patterns optimized for Colombian fashion platform requirements*