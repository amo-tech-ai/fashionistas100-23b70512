import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

// Core pages
import Index from "./pages/Index";
import Home from "./pages/Home";
import Events from "./pages/Events";
import MockDashboard from "./pages/MockDashboard";
import Services from "./pages/Services";

// Lazy load other pages
const EventDetail = lazy(() => import("./pages/EventDetail"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const About = lazy(() => import("./pages/About"));
const FashionPhotography = lazy(() => import("./pages/services/FashionPhotography"));
const VideoProduction = lazy(() => import("./pages/services/VideoProduction"));

function App() {
  return (
    <Router>
      <div className="App">
        <Suspense fallback={<LoadingSkeleton />}>
          <Routes>
            {/* Main routes */}
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/fashion-photography" element={<FashionPhotography />} />
            <Route path="/services/video-production" element={<VideoProduction />} />
            <Route path="/about" element={<About />} />
            
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<MockDashboard />} />
            <Route path="/dashboard/overview" element={<MockDashboard />} />
            <Route path="/dashboard/organizer" element={<MockDashboard />} />
            <Route path="/dashboard/sponsor" element={<MockDashboard />} />
            <Route path="/dashboard/venue" element={<MockDashboard />} />
            <Route path="/dashboard/analytics" element={<MockDashboard />} />
            <Route path="/dashboard/designers" element={<MockDashboard />} />
            <Route path="/dashboard/attendees" element={<MockDashboard />} />
            <Route path="/dashboard/sponsors" element={<MockDashboard />} />
            <Route path="/dashboard/venues" element={<MockDashboard />} />
            <Route path="/dashboard/create-event" element={<MockDashboard />} />
            <Route path="/dashboard/event-brief" element={<MockDashboard />} />
            <Route path="/dashboard/gallery" element={<MockDashboard />} />
            <Route path="/dashboard/portfolio-upload" element={<MockDashboard />} />
            <Route path="/dashboard/payments" element={<MockDashboard />} />
            <Route path="/dashboard/contact-forms" element={<MockDashboard />} />
            
            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        
        <Toaster />
      </div>
    </Router>
  );
}

export default App;