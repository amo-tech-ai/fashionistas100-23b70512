import { Card } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Find Your Event",
    description: "Browse exclusive fashion shows, pop-ups, and designer showcases across Colombia and beyond."
  },
  {
    number: "02",
    title: "Book Your Ticket",
    description: "Choose from General, VIP, or Sponsor tiers. Secure payment with instant confirmation."
  },
  {
    number: "03",
    title: "Attend & Connect",
    description: "Experience world-class fashion events and network with industry professionals."
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

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="bg-white border-[hsl(var(--border))] hover:border-[hsl(var(--breef-orange))] transition-all duration-300 hover:shadow-hover rounded-2xl overflow-hidden h-full">
                <div className="p-8 space-y-6">
                  {/* Large number only */}
                  <div className="font-inter text-7xl font-light text-[hsl(var(--breef-orange))]/20">
                    {step.number}
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="font-inter text-2xl font-medium text-[hsl(var(--breef-dark))]">
                      {step.title}
                    </h3>
                    <p className="font-inter text-[hsl(var(--breef-gray))] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Card>
              {/* Vertical divider (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-px bg-[hsl(var(--border))]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
