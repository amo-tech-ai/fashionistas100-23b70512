import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Runway Shows",
    description: "Exclusive fashion shows",
    link: "/events?category=runway"
  },
  {
    name: "Pop-Up Stores",
    description: "Limited edition collections",
    link: "/events?category=popup"
  },
  {
    name: "Exhibitions",
    description: "Art meets fashion",
    link: "/events?category=exhibition"
  },
  {
    name: "Fashion Week",
    description: "Industry's biggest events",
    link: "/events?category=fashionweek"
  },
  {
    name: "Designer Showcases",
    description: "Meet emerging talent",
    link: "/designers"
  }
];

export const CategoryCards = () => {
  return (
    <section className="py-20 px-4 bg-[hsl(var(--breef-dark))]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-inter text-3xl md:text-5xl font-light text-white mb-4">
            Explore by category
          </h2>
          <p className="font-inter text-lg text-white/70">
            Discover your next fashion experience
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {categories.map((category) => (
            <Link key={category.name} to={category.link}>
              <Card className="relative group overflow-hidden bg-white border-[hsl(var(--border))] hover:border-[hsl(var(--breef-orange))] transition-all duration-300 hover:shadow-hover cursor-pointer h-full">
                <div className="p-6 flex flex-col justify-center text-center space-y-2 h-full min-h-[140px]">
                  <h3 className="font-inter text-lg font-medium text-[hsl(var(--breef-dark))]">
                    {category.name}
                  </h3>
                  <p className="font-inter text-xs text-[hsl(var(--breef-gray))]">
                    {category.description}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/events" 
            className="font-inter text-sm text-[hsl(var(--breef-orange))] hover:text-white inline-flex items-center gap-2 transition-colors"
          >
            See All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
