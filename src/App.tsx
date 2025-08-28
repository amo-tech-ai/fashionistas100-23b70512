import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
