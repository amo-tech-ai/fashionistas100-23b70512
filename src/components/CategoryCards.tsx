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
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-light text-white mb-4">
            Explore by category
          </h2>
          <p className="font-inter text-lg text-white/70">
            Discover your next fashion experience
          </p>
        </div>

        {/* Desktop & Tablet Grid - Mobile Scrollable */}
        <div className="mb-12">
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link key={category.name} to={category.link} className="group">
                <Card className="relative overflow-hidden bg-white border border-gray-200 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[hsl(var(--breef-orange))] cursor-pointer h-full">
                  <div className="p-8 flex flex-col justify-center text-center space-y-3 h-full min-h-[180px]">
                    <h3 className="font-playfair text-xl font-semibold text-[hsl(var(--breef-dark))] group-hover:text-[hsl(var(--breef-orange))] transition-colors">
                      {category.name}
                    </h3>
                    <p className="font-inter text-sm text-gray-600 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-4 pb-4">
              {categories.map((category) => (
                <Link key={category.name} to={category.link} className="group flex-shrink-0 w-[280px]">
                  <Card className="relative overflow-hidden bg-white border border-gray-200 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[hsl(var(--breef-orange))] cursor-pointer h-full">
                    <div className="p-8 flex flex-col justify-center text-center space-y-3 h-full min-h-[180px]">
                      <h3 className="font-playfair text-xl font-semibold text-[hsl(var(--breef-dark))] group-hover:text-[hsl(var(--breef-orange))] transition-colors">
                        {category.name}
                      </h3>
                      <p className="font-inter text-sm text-gray-600 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="text-right">
          <Link 
            to="/events" 
            className="group font-inter text-sm text-[hsl(var(--breef-orange))] hover:text-white inline-flex items-center gap-2 transition-colors relative"
          >
            <span className="relative">
              See All Categories
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
