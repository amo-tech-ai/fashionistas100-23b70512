import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { RoleBasedRedirect } from "@/components/RoleBasedRedirect";
import { WithRoleGuard } from "@/components/WithRoleGuard";
import { RedirectHandler } from "@/components/RedirectHandler";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DASHBOARD_ACCESS } from "@/lib/roles";

// Core pages
import Index from "./pages/Index";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Services from "./pages/Services";

// Lazy load public pages
const EventDetail = lazy(() => import("./pages/EventDetail"));
const About = lazy(() => import("./pages/About"));
const FashionPhotography = lazy(() => import("./pages/services/FashionPhotography"));
const VideoProduction = lazy(() => import("./pages/services/VideoProduction"));
const Designers = lazy(() => import("./pages/Designers"));
const Tickets = lazy(() => import("./pages/Tickets"));
const Sponsors = lazy(() => import("./pages/Sponsors"));
const Contact = lazy(() => import("./pages/Contact"));
const Forbidden = lazy(() => import("./pages/Forbidden"));

// Lazy load auth pages
const SignIn = lazy(() => import("./pages/auth/SignInCorrect"));
const SignUp = lazy(() => import("./pages/auth/SignUpCorrect"));

// Lazy load dashboard pages
const OrganizerDashboard = lazy(() => import("./pages/dashboard/OrganizerDashboardNew"));
const DesignerDashboard = lazy(() => import("./pages/dashboard/DesignerDashboard"));
const VenueDashboard = lazy(() => import("./pages/dashboard/VenueDashboard"));
const SponsorDashboard = lazy(() => import("./pages/dashboard/SponsorDashboardNew"));
const UserDashboard = lazy(() => import("./pages/dashboard/UserDashboardFixed"));
const AdminDashboard = lazy(() => import("./pages/EventManagerDashboard"));
const DashboardTest = lazy(() => import("./pages/DashboardTest"));
const CalendarDashboard = lazy(() => import("./pages/CalendarDashboard"));

function App() {
  return (
    <>
      <RedirectHandler />
      <div className="App">
        <Suspense fallback={<LoadingSkeleton />}>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Events */}
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            
            {/* Services */}
            <Route path="/services" element={<Services />} />
            <Route path="/services/fashion-photography" element={<FashionPhotography />} />
            <Route path="/services/video-production" element={<VideoProduction />} />
            <Route path="/services/ai-services" element={<Services />} />
            
            {/* Discovery */}
            <Route path="/designers" element={<Designers />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/sponsors" element={<Sponsors />} />
            
            {/* AUTH ROUTES */}
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/dashboard-test" element={<DashboardTest />} />
            
            {/* DASHBOARD - Role-based redirect */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <RoleBasedRedirect />
                </ProtectedRoute>
              } 
            />
            
            {/* ORGANIZER DASHBOARD */}
            <Route 
              path="/dashboard/organizer/overview" 
              element={
                <WithRoleGuard allow={DASHBOARD_ACCESS.organizer}>
                  <OrganizerDashboard />
                </WithRoleGuard>
              } 
            />
            
            {/* DESIGNER DASHBOARD */}
            <Route 
              path="/dashboard/designer/overview" 
              element={
                <WithRoleGuard allow={DASHBOARD_ACCESS.designer}>
                  <DesignerDashboard />
                </WithRoleGuard>
              } 
            />
            
            {/* VENUE DASHBOARD */}
            <Route 
              path="/dashboard/venue/overview" 
              element={
                <WithRoleGuard allow={DASHBOARD_ACCESS.venue}>
                  <VenueDashboard />
                </WithRoleGuard>
              } 
            />
            
            {/* SPONSOR DASHBOARD */}
            <Route 
              path="/dashboard/sponsor/overview" 
              element={
                <WithRoleGuard allow={DASHBOARD_ACCESS.sponsor}>
                  <SponsorDashboard />
                </WithRoleGuard>
              } 
            />
            
            {/* USER DASHBOARD */}
            <Route 
              path="/dashboard/user/overview" 
              element={
                <WithRoleGuard allow={DASHBOARD_ACCESS.user}>
                  <UserDashboard />
                </WithRoleGuard>
              } 
            />
            
            {/* ADMIN DASHBOARD */}
            <Route 
              path="/dashboard/admin/overview" 
              element={
                <WithRoleGuard allow={DASHBOARD_ACCESS.admin}>
                  <AdminDashboard />
                </WithRoleGuard>
              } 
            />
            
            {/* CALENDAR DASHBOARD */}
            <Route 
              path="/dashboard/calendar" 
              element={
                <ProtectedRoute>
                  <CalendarDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* ERROR ROUTES */}
            <Route path="/403" element={<Forbidden />} />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        
        <Toaster />
      </div>
    </>
  );
}

export default App;