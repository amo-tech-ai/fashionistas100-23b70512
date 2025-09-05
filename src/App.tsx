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
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Designers from "./pages/Designers";
import DesignerProfile from "./pages/DesignerProfile";
import Tickets from "./pages/Tickets";
import Sponsors from "./pages/Sponsors";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignInPage from "./pages/auth/SignIn";
import SignUpPage from "./pages/auth/SignUp";
import Dashboard from "./pages/admin/Dashboard";
import DashboardDev from "./pages/admin/DashboardDev";
import { LeapDashboard } from "./pages/LeapDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import UserDashboard from "./pages/UserDashboard";
import SponsorDashboard from "./pages/SponsorDashboard";
import CreateEvent from "./pages/admin/CreateEvent";
import AddSponsor from "./pages/admin/AddSponsor";
import Production from "./pages/admin/Production";
import GroupBooking from "./pages/admin/GroupBooking";
import Analytics from "./pages/admin/Analytics";
import EventPlans from "./pages/admin/EventPlans";

// Create QueryClient with proper configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
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
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/designers" element={<Designers />} />
              <Route path="/designers/:slug" element={<DesignerProfile />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Protected Admin Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <DashboardDev />
                </ProtectedRoute>
              } />
              <Route path="/admin/leap" element={
                <ProtectedRoute>
                  <LeapDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/organizer" element={
                <ProtectedRoute>
                  <OrganizerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/user" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/sponsor" element={
                <ProtectedRoute>
                  <SponsorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/create-event" element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              } />
              <Route path="/admin/add-sponsor" element={
                <ProtectedRoute>
                  <AddSponsor />
                </ProtectedRoute>
              } />
              <Route path="/admin/production" element={
                <ProtectedRoute>
                  <Production />
                </ProtectedRoute>
              } />
              <Route path="/admin/group-booking" element={
                <ProtectedRoute>
                  <GroupBooking />
                </ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="/admin/event-plans" element={
                <ProtectedRoute>
                  <EventPlans />
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}