import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Designers from "./pages/Designers";
import DesignerProfile from "./pages/DesignerProfile";
import Tickets from "./pages/Tickets";
import Sponsors from "./pages/Sponsors";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Assessment from "./pages/Assessment";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";
import LeapDashboard from "./pages/LeapDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import UserDashboard from "./pages/UserDashboard";
import SponsorDashboard from "./pages/SponsorDashboard";
import CreateEvent from "./pages/CreateEvent";
import GroupBooking from "./pages/GroupBooking";
import AddSponsor from "./pages/AddSponsor";
import ProductionPlanning from "./pages/ProductionPlanning";
import EventPlans from "./pages/EventPlans";
import EventManagement from "./pages/EventManagement";
import EventView from "./pages/EventView";

// Create QueryClient with proper configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  // Determine basename based on deployment
  const basename = window.location.hostname === 'fashionistas100-23b70512.vercel.app' 
    ? '/' 
    : '/fashionistas100-23b70512';

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            basename={basename}
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/designers" element={<Designers />} />
              <Route path="/designers/:slug" element={<DesignerProfile />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/assessment" element={<Assessment />} />
              
              {/* Auth Routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              
              {/* Leap Backend Dashboard */}
              <Route path="/admin/leap" element={<LeapDashboard />} />
              <Route path="/admin/organizer" element={<OrganizerDashboard />} />
              <Route path="/admin/user" element={<UserDashboard />} />
              <Route path="/admin/sponsor" element={<SponsorDashboard />} />
              
              {/* Event Management Pages */}
              <Route path="/admin/events" element={<EventManagement />} />
              <Route path="/admin/event-plans" element={<EventPlans />} />
              <Route path="/admin/event/:eventId" element={<EventView />} />
              <Route path="/admin/event/:eventId/edit" element={<CreateEvent />} />
              <Route path="/admin/event/:eventId/manage" element={<EventManagement />} />
              
              {/* Form Pages */}
              <Route path="/admin/create-event" element={<CreateEvent />} />
              <Route path="/admin/group-booking" element={<GroupBooking />} />
              <Route path="/admin/add-sponsor" element={<AddSponsor />} />
              <Route path="/admin/production" element={<ProductionPlanning />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
