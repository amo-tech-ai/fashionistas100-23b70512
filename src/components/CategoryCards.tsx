import { Card } from "@/components/ui/card";
import { Sparkles, ShoppingBag, Palette, Shirt, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Runway",
    icon: Sparkles,
    description: "Exclusive fashion shows",
    link: "/events?category=runway",
    gradient: "from-purple-500/10 to-pink-500/10"
  },
  {
    name: "Pop-Ups",
    icon: ShoppingBag,
    description: "Limited edition collections",
    link: "/events?category=popup",
    gradient: "from-orange-500/10 to-red-500/10"
  },
  {
    name: "Exhibitions",
    icon: Palette,
    description: "Art meets fashion",
    link: "/events?category=exhibition",
    gradient: "from-blue-500/10 to-cyan-500/10"
  },
  {
    name: "Fashion Week",
    icon: Shirt,
    description: "Industry's biggest events",
    link: "/events?category=fashionweek",
    gradient: "from-green-500/10 to-emerald-500/10"
  },
  {
    name: "Designer Spotlight",
    icon: Star,
    description: "Meet emerging talent",
    link: "/designers",
    gradient: "from-yellow-500/10 to-amber-500/10"
  }
];

export const CategoryCards = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-inter text-3xl md:text-5xl font-light text-[hsl(var(--breef-dark))] mb-4">
            Explore by category
          </h2>
          <p className="font-inter text-lg text-[hsl(var(--breef-gray))]">
            Discover your next fashion experience
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.name} to={category.link}>
                <Card className={`relative group overflow-hidden bg-gradient-to-br ${category.gradient} border-[hsl(var(--border))] hover:border-[hsl(var(--breef-orange))] transition-all duration-300 hover:shadow-hover cursor-pointer h-full`}>
                  <div className="p-6 flex flex-col items-center text-center space-y-3 h-full justify-center">
                    <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-7 h-7 text-[hsl(var(--breef-orange))]" />
                    </div>
                    <div>
                      <h3 className="font-inter font-medium text-[hsl(var(--breef-dark))] mb-1">
                        {category.name}
                      </h3>
                      <p className="font-inter text-xs text-[hsl(var(--breef-gray))]">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link 
            to="/events" 
            className="font-inter text-sm text-[hsl(var(--breef-orange))] hover:underline inline-flex items-center gap-2"
          >
            See All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
