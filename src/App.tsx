import { lazy, Suspense } from 'react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/clerk-react'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-gray-600 animate-pulse">Loading...</p>
    </div>
  </div>
);

// Core pages (loaded immediately)
import Index from "./pages/Index";
import Events from "./pages/Events";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";

// Lazy load all other pages
const EventDetail = lazy(() => import("./pages/EventDetail"));
const Designers = lazy(() => import("./pages/Designers"));
const DesignerProfile = lazy(() => import("./pages/DesignerProfile"));
const Tickets = lazy(() => import("./pages/Tickets"));
const Sponsors = lazy(() => import("./pages/Sponsors"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

// Lazy load dashboards
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const DashboardDev = lazy(() => import("./pages/admin/DashboardDev"));
const LeapDashboard = lazy(() => import("./pages/LeapDashboard").then(m => ({ default: m.LeapDashboard })));
const OrganizerDashboard = lazy(() => import("./pages/OrganizerDashboard"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const SponsorDashboard = lazy(() => import("./pages/SponsorDashboard"));
const DesignerDashboard = lazy(() => import("./pages/DesignerDashboard"));
const ModelDashboard = lazy(() => import("./pages/ModelDashboard"));
const VenueDashboard = lazy(() => import("./pages/VenueDashboard"));
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

// Lazy load test pages
const TestAuth = lazy(() => import("./pages/TestAuth"));
const CompleteIntegrationTest = lazy(() => import("./pages/CompleteIntegrationTest"));
const TestDirectAuth = lazy(() => import("./pages/TestDirectAuth"));

// Additional lazy loads for other dashboard variations
const OrganizerDashboardNew = lazy(() => import("./pages/OrganizerDashboardNew"));
const UserDashboardNew = lazy(() => import("./pages/UserDashboardNew"));
const SponsorDashboardNew = lazy(() => import("./pages/SponsorDashboardNew"));

// Create QueryClient with proper configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes - Core pages loaded immediately */}
                <Route path="/" element={<Index />} />
                <Route path="/events" element={<Events />} />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                
                {/* Lazy loaded public routes */}
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/designers" element={<Designers />} />
                <Route path="/designers/:id" element={<DesignerProfile />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/sponsors" element={<Sponsors />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Admin routes - Protected and lazy loaded */}
                <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/admin/dashboard-dev" element={<ProtectedRoute><DashboardDev /></ProtectedRoute>} />
                <Route path="/admin/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
                <Route path="/admin/add-sponsor" element={<ProtectedRoute><AddSponsor /></ProtectedRoute>} />
                <Route path="/admin/production" element={<ProtectedRoute><Production /></ProtectedRoute>} />
                <Route path="/admin/group-booking" element={<ProtectedRoute><GroupBooking /></ProtectedRoute>} />
                <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/admin/event-plans" element={<ProtectedRoute><EventPlans /></ProtectedRoute>} />
                <Route path="/admin/portfolio-upload" element={<ProtectedRoute><PortfolioUpload /></ProtectedRoute>} />
                <Route path="/admin/collection-manager" element={<ProtectedRoute><CollectionManager /></ProtectedRoute>} />
                <Route path="/admin/venue-photos" element={<ProtectedRoute><VenuePhotos /></ProtectedRoute>} />
                <Route path="/admin/venue-availability" element={<ProtectedRoute><VenueAvailability /></ProtectedRoute>} />
                
                {/* Dashboard routes - Protected and lazy loaded */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/dashboard/enhanced" element={<ProtectedRoute><EnhancedDashboard /></ProtectedRoute>} />
                <Route path="/leap-dashboard" element={<ProtectedRoute><LeapDashboard /></ProtectedRoute>} />
                
                {/* Role-specific dashboards - Protected and lazy loaded */}
                <Route path="/organizer-dashboard" element={<ProtectedRoute><OrganizerDashboard /></ProtectedRoute>} />
                <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                <Route path="/sponsor-dashboard" element={<ProtectedRoute><SponsorDashboard /></ProtectedRoute>} />
                <Route path="/designer-dashboard" element={<ProtectedRoute><DesignerDashboard /></ProtectedRoute>} />
                <Route path="/model-dashboard" element={<ProtectedRoute><ModelDashboard /></ProtectedRoute>} />
                <Route path="/venue-dashboard" element={<ProtectedRoute><VenueDashboard /></ProtectedRoute>} />
                
                {/* Production dashboard routes */}
                <Route path="/admin/organizer" element={<ProtectedRoute><OrganizerDashboardNew /></ProtectedRoute>} />
                <Route path="/admin/user" element={<ProtectedRoute><UserDashboardNew /></ProtectedRoute>} />
                <Route path="/admin/sponsor" element={<ProtectedRoute><SponsorDashboardNew /></ProtectedRoute>} />
                <Route path="/admin/designer" element={<ProtectedRoute><DesignerDashboard /></ProtectedRoute>} />
                <Route path="/admin/model" element={<ProtectedRoute><ModelDashboard /></ProtectedRoute>} />
                <Route path="/admin/venue" element={<ProtectedRoute><VenueDashboard /></ProtectedRoute>} />
                
                {/* Preview routes for development */}
                <Route path="/preview/organizer" element={<OrganizerDashboardNew />} />
                <Route path="/preview/user" element={<UserDashboardNew />} />
                <Route path="/preview/sponsor" element={<SponsorDashboardNew />} />
                <Route path="/preview/designer" element={<DesignerDashboard />} />
                <Route path="/preview/model" element={<ModelDashboard />} />
                <Route path="/preview/venue" element={<VenueDashboard />} />
                <Route path="/preview/analytics" element={<Analytics />} />
                
                {/* Test routes - Lazy loaded */}
                <Route path="/test-auth" element={<TestAuth />} />
                <Route path="/test-integration" element={<CompleteIntegrationTest />} />
                <Route path="/test-direct-auth" element={<TestDirectAuth />} />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
