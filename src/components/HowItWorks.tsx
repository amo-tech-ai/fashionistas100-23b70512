import { Card } from "@/components/ui/card";
import { Search, Ticket, PartyPopper } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Find Your Event",
    description: "Browse exclusive fashion shows, pop-ups, and designer showcases across Colombia and beyond.",
    icon: Search,
    color: "from-purple-500 to-pink-500"
  },
  {
    number: "02",
    title: "Book Your Ticket",
    description: "Choose from General, VIP, or Sponsor tiers. Secure payment with instant confirmation.",
    icon: Ticket,
    color: "from-orange-500 to-red-500"
  },
  {
    number: "03",
    title: "Attend & Connect",
    description: "Experience world-class fashion events and network with industry professionals.",
    icon: PartyPopper,
    color: "from-blue-500 to-cyan-500"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-inter text-3xl md:text-5xl font-light text-[hsl(var(--breef-dark))] mb-4">
            How it works
          </h2>
          <p className="font-inter text-lg text-[hsl(var(--breef-gray))] max-w-2xl mx-auto">
            Your journey to unforgettable fashion experiences in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection lines (desktop only) */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-orange-500 to-blue-500 opacity-20" 
               style={{ width: 'calc(100% - 120px)', left: '60px' }} 
          />

          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={index} className="relative bg-white border-[hsl(var(--border))] hover:border-[hsl(var(--breef-orange))] transition-all duration-300 hover:shadow-hover rounded-2xl overflow-hidden">
                <div className="p-8 space-y-6">
                  {/* Step number with gradient */}
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} opacity-10 absolute`} />
                    <div className="relative w-16 h-16 rounded-full bg-white border-2 border-[hsl(var(--border))] flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-[hsl(var(--breef-orange))]" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className={`font-inter text-5xl font-light bg-gradient-to-br ${step.color} bg-clip-text text-transparent`}>
                        {step.number}
                      </span>
                      <h3 className="font-inter text-xl font-medium text-[hsl(var(--breef-dark))]">
                        {step.title}
                      </h3>
                    </div>
                    <p className="font-inter text-[hsl(var(--breef-gray))] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
