import { Navigation } from "@/components/Navigation";
import { TicketTiers } from "@/components/TicketTiers";
import { DashboardFooter } from "@/components/DashboardFooter";
import { Badge } from "@/components/ui/badge";
import { fashionImages } from "@/lib/cloudinary";

const Tickets = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden mt-16 lg:mt-20">
        <img 
          src={fashionImages.events[0]} 
          alt="Fashion show tickets"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <Badge variant="secondary" className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30">
              Premium Events
            </Badge>
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">
              Fashion Show Tickets
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-white/90">
              Secure your spot at the most exclusive fashion events. Choose from our premium ticket packages.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-12">
        <TicketTiers />
      </main>
      
      <DashboardFooter />
    </div>
  );
};

export default Tickets;