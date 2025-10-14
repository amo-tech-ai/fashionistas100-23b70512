export const StatsBar = () => {
  const stats = [
    { value: "500+", label: "Fashion Events" },
    { value: "200+", label: "Designers" },
    { value: "50+", label: "Cities" },
    { value: "10k+", label: "Attendees" },
  ];

  return (
    <section className="py-8 bg-[hsl(var(--breef-cream))]">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-card p-8 md:p-12">
          <p className="font-inter text-xs md:text-sm text-[hsl(var(--breef-gray))] uppercase tracking-wider text-center mb-8 md:mb-12">
            Trusted by the Fashion Community
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="font-inter text-4xl md:text-5xl lg:text-6xl font-light text-[hsl(var(--breef-dark))]">
                  {stat.value}
                </div>
                <div className="font-inter text-sm md:text-base text-[hsl(var(--breef-gray))]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
