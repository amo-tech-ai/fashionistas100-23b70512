import { Navigation } from "@/components/Navigation";
import { TicketTiers } from "@/components/TicketTiers";

const Tickets = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16 lg:pt-20 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-foreground mb-4">
            Fashion Show Tickets
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Secure your spot at the most exclusive fashion events. Choose from our premium ticket packages.
          </p>
        </div>
        <TicketTiers />
      </main>
    </div>
  );
};

export default Tickets;