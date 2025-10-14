import { Brain, Users, TrendingUp, Sparkles } from "lucide-react";

export const AIFeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Health Scores",
      description: "Get instant AI-powered insights on your event's readiness and optimization opportunities.",
    },
    {
      icon: Users,
      title: "Smart Model Casting",
      description: "Find the perfect models for your event with AI-powered matching and recommendations.",
    },
    {
      icon: TrendingUp,
      title: "Event Optimization",
      description: "Optimize attendance, pricing, and timing with data-driven AI suggestions.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[hsl(var(--breef-orange))]/5 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-[hsl(var(--breef-orange))]/10 text-[hsl(var(--breef-orange))] px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="font-inter text-sm font-medium">AI-Powered Platform</span>
          </div>
          <h2 className="font-inter text-3xl md:text-4xl lg:text-5xl font-light text-[hsl(var(--breef-dark))] mb-4">
            Intelligent Event Management
          </h2>
          <p className="font-inter text-lg text-[hsl(var(--breef-gray))] max-w-2xl mx-auto">
            Leverage cutting-edge AI technology to create, optimize, and manage your fashion events with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-card hover:shadow-hover transition-all duration-300 group"
            >
              <div className="bg-[hsl(var(--breef-orange))]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[hsl(var(--breef-orange))]/20 transition-colors">
                <feature.icon className="h-8 w-8 text-[hsl(var(--breef-orange))]" />
              </div>
              <h3 className="font-inter text-xl font-semibold text-[hsl(var(--breef-dark))] mb-3">
                {feature.title}
              </h3>
              <p className="font-inter text-base text-[hsl(var(--breef-gray))] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
