import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from '@/components/ui/sonner';
import { Toaster as Sonner } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { StripeProvider } from '@/components/payments/StripeProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

// Pages - Direct imports for core pages
import Home from '@/pages/Home';
import Services from '@/pages/Services';
import Photography from '@/pages/services/Photography';
import Events from '@/pages/Events';
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import Index from '@/pages/Index';

// Import dashboards directly to avoid lazy loading issues
import OrganizerDashboardDemo from "./pages/OrganizerDashboardDemo";
import OrganizerDashboardNew from "./pages/OrganizerDashboardNew";
import UserDashboardNew from "./pages/UserDashboardNew";
import SponsorDashboardNew from "./pages/SponsorDashboardNew";
import DesignerDashboard from "./pages/DesignerDashboard";
import ModelDashboard from "./pages/ModelDashboard";
import VenueDashboard from "./pages/VenueDashboard";
import Venues from "./pages/Venues";
import MainDashboard from "./pages/MainDashboard";

const PublicDashboard = lazy(() => import("./pages/PublicDashboard"));
// Lazy load all other pages
const EventDetail = lazy(() => import("./pages/EventDetail"));
const Designers = lazy(() => import("./pages/Designers"));
const DesignerProfile = lazy(() => import("./pages/DesignerProfile"));
const Tickets = lazy(() => import("./pages/Tickets"));
const Sponsors = lazy(() => import("./pages/Sponsors"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

// Lazy load dashboards (admin only)
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const DashboardDev = lazy(() => import("./pages/admin/DashboardDev"));
const LeapDashboard = lazy(() => import("./pages/LeapDashboard").then(m => ({ default: m.LeapDashboard })));
const EnhancedDashboard = lazy(() => import("./pages/EnhancedDashboard").then(m => ({ default: m.EnhancedDashboard })));

// Lazy load admin pages
const CreateEvent = lazy(() => import("./pages/admin/CreateEvent"));
const AddSponsor = lazy(() => import("./pages/admin/AddSponsor"));
const Production = lazy(() => import("./pages/admin/Production"));
const GroupBooking = lazy(() => import("./pages/admin/GroupBooking"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const EventPlans = lazy(() => import("./pages/admin/EventPlans"));
const PortfolioUpload = lazy(() => import("./pages/admin/PortfolioUpload"));
const CollectionManager = lazy(() => import("./pages/admin/CollectionManager"));
const VenuePhotos = lazy(() => import("./pages/admin/VenuePhotos"));
const VenueAvailability = lazy(() => import("./pages/admin/VenueAvailability"));
const Gallery = lazy(() => import("./pages/admin/Gallery"));

// Lazy load test pages
const TestAuth = lazy(() => import("./pages/TestAuth"));
const CompleteIntegrationTest = lazy(() => import("./pages/CompleteIntegrationTest"));
const TestDirectAuth = lazy(() => import("./pages/TestDirectAuth"));
const StripeTestPage = lazy(() => import("./pages/StripeTestPage"));
const BookingSuccess = lazy(() => import("./pages/BookingSuccess"));

// Create QueryClient with proper configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Get Clerk publishable key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

const App = () => {
  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={clerkPubKey}>
        <StripeProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public routes - Core pages loaded immediately */}
                    <Route path="/" element={<Index />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/photography" element={<Photography />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/sign-in" element={<SignInPage />} />
                    <Route path="/sign-up" element={<SignUpPage />} />
                    
                    {/* Lazy loaded public routes */}
                    <Route path="/public-dashboard" element={<PublicDashboard />} />
                    <Route path="/events/:id" element={<EventDetail />} />
                    <Route path="/designers" element={<Designers />} />
                    <Route path="/designers/:id" element={<DesignerProfile />} />
                    <Route path="/tickets" element={<Tickets />} />
                    <Route path="/sponsors" element={<Sponsors />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/venues" element={<Venues />} />
                    <Route path="/booking-success" element={<BookingSuccess />} />
                    
                    {/* Dashboard Routes */}
                    <Route path="/dashboard" element={<MainDashboard />} />
                    
                    {/* Admin routes - Protected and lazy loaded */}
                    <Route path="/admin" element={<Dashboard />} />
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route path="/admin/dashboard-dev" element={<DashboardDev />} />
                    <Route path="/admin/create-event" element={<CreateEvent />} />
                    <Route path="/admin/add-sponsor" element={<AddSponsor />} />
                    <Route path="/admin/production" element={<Production />} />
                    <Route path="/admin/group-booking" element={<GroupBooking />} />
                    <Route path="/admin/analytics" element={<Analytics />} />
                    
                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </StripeProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
};
export default App;
