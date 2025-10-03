import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CategoryCard } from "@/components/ui/category-card";

const categories = [
  {
    name: "Runway Shows",
    description: "Exclusive fashion shows",
    link: "/events?category=runway",
    imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea24f56c?w=800&auto=format&fit=crop&q=80",
    likes: 2400
  },
  {
    name: "Pop-Up Stores",
    description: "Limited edition collections",
    link: "/events?category=popup",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
    likes: 1800
  },
  {
    name: "Exhibitions",
    description: "Art meets fashion",
    link: "/events?category=exhibition",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
    likes: 3200
  },
  {
    name: "Fashion Week",
    description: "Industry's biggest events",
    link: "/events?category=fashionweek",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
    likes: 5600
  },
  {
    name: "Designer Showcases",
    description: "Meet emerging talent",
    link: "/designers",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
    likes: 1500
  }
];

export const CategoryCards = () => {
  const navigate = useNavigate();

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

        {/* Grid Layout - No Horizontal Scroll */}
        <div className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                title={category.name}
                description={category.description}
                initialLikes={category.likes}
                imageUrl={category.imageUrl}
                onClick={() => navigate(category.link)}
              />
            ))}
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={() => navigate("/events")}
            className="group font-inter text-sm text-[hsl(var(--breef-orange))] hover:text-white inline-flex items-center gap-2 transition-colors relative cursor-pointer"
          >
            <span className="relative">
              See All Categories
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
