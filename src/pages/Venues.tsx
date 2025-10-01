import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Filter, Building2, MapPin, Users, Star, SortAsc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";

const Venues = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL-controlled filters
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category");
  const location = searchParams.get("location");
  const capacity = searchParams.get("capacity");
  const sortBy = searchParams.get("sortBy") || 'newest';
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 12;

  // Extended mock venue data
  const allVenues = [
    {
      id: "1",
      name: "Grand Palais",
      location: "Paris, France",
      city: "Paris",
      country: "France",
      category: "Couture Runway",
      capacity: 2000,
      price: 15000,
      priceUnit: "day",
      rating: 4.8,
      image: "/src/assets/venue-setup.jpg",
      tags: ["Runway Hall", "Luxury", "Historic"],
      description: "Iconic Parisian venue perfect for haute couture presentations",
      features: ["Catering", "Professional Lighting", "Backstage Rooms", "VIP Lounge"]
    },
    {
      id: "2",
      name: "Vogue Hall",
      location: "New York, USA",
      city: "New York",
      country: "USA",
      category: "Fashion Week Venue",
      capacity: 1200,
      price: 12500,
      priceUnit: "day",
      rating: 4.6,
      image: "/src/assets/venue-setup.jpg",
      tags: ["Fashion Week", "Premium", "Iconic"],
      description: "Premier New York Fashion Week venue in the heart of Manhattan",
      features: ["VIP Areas", "Media Center", "Dressing Rooms", "Parking"]
    },
    {
      id: "3",
      name: "Plaza Mayor",
      location: "Medellín, Colombia",
      city: "Medellín",
      country: "Colombia",
      category: "Outdoor Showcase",
      capacity: 800,
      price: 6000,
      priceUnit: "day",
      rating: 4.4,
      image: "/src/assets/venue-setup.jpg",
      tags: ["Outdoor", "Cultural", "Plaza"],
      description: "Beautiful outdoor venue in Colombia's fashion capital",
      features: ["Open Air", "Stage", "Sound System", "Security"]
    },
    {
      id: "4",
      name: "Shibuya Arena",
      location: "Tokyo, Japan",
      city: "Tokyo",
      country: "Japan",
      category: "Expo Center",
      capacity: 3500,
      price: 18000,
      priceUnit: "day",
      rating: 4.7,
      image: "/src/assets/venue-setup.jpg",
      tags: ["Expo", "Large Scale", "Tech-Enabled"],
      description: "Massive expo center with state-of-the-art technology",
      features: ["LED Screens", "Multiple Halls", "Catering", "Translation Services"]
    },
    {
      id: "5",
      name: "Dubai Luxury Pavilion",
      location: "Dubai, UAE",
      city: "Dubai",
      country: "UAE",
      category: "Ultra-Premium Waterfront",
      capacity: 2500,
      price: 22000,
      priceUnit: "day",
      rating: 4.9,
      image: "/src/assets/venue-setup.jpg",
      tags: ["Luxury", "Waterfront", "Premium"],
      description: "Ultra-luxury waterfront venue with stunning views",
      features: ["Waterfront Views", "Luxury Catering", "VIP Suites", "Valet Parking"]
    },
    {
      id: "6",
      name: "Milano Fashion Center",
      location: "Milan, Italy",
      city: "Milan",
      country: "Italy",
      category: "Runway Hall",
      capacity: 1500,
      price: 14000,
      priceUnit: "day",
      rating: 4.7,
      image: "/src/assets/venue-setup.jpg",
      tags: ["Runway", "Fashion District", "Premium"],
      description: "Classic Milan fashion venue in the style capital",
      features: ["Professional Runway", "Backstage", "Media Room", "Catering"]
    },
    {
      id: "7",
      name: "Convention Center Bogotá",
      location: "Bogotá, Colombia",
      city: "Bogotá",
      country: "Colombia",
      category: "Expo Center",
      capacity: 5000,
      price: 10000,
      priceUnit: "day",
      rating: 4.5,
      image: "/src/assets/venue-setup.jpg",
      tags: ["Large Scale", "Modern", "Convention"],
      description: "Modern convention center with expansive exhibition spaces",
      features: ["Multiple Halls", "AV Equipment", "Food Court", "Parking"]
    },
    {
      id: "8",
      name: "London Fashion Hub",
      location: "London, UK",
      city: "London",
      country: "UK",
      category: "Runway Hall",
      capacity: 1800,
      price: 16000,
      priceUnit: "day",
      rating: 4.8,
      image: "/src/assets/venue-setup.jpg",
      tags: ["Historic", "Prestigious", "Central"],
      description: "Historic venue in the heart of London's fashion district",
      features: ["Traditional Architecture", "Modern Tech", "Green Room", "Bar"]
    },
    {
      id: "9",
      name: "Cartagena Beach Pavilion",
      location: "Cartagena, Colombia",
      city: "Cartagena",
      country: "Colombia",
      category: "Outdoor Showcase",
      capacity: 600,
      price: 8000,
      priceUnit: "day",
      rating: 4.6,
      image: "/src/assets/venue-setup.jpg",
      tags: ["Beach", "Outdoor", "Tropical"],
      description: "Stunning beachfront venue with Caribbean views",
      features: ["Beach Access", "Sunset Views", "Open Air", "Catering"]
    },
    {
      id: "10",
      name: "Shanghai Fashion Week Hall",
      location: "Shanghai, China",
      city: "Shanghai",
      country: "China",
      category: "Fashion Week Venue",
      capacity: 2200,
      price: 13000,
      priceUnit: "day",
      rating: 4.7,
      image: "/src/assets/venue-setup.jpg",
      tags: ["Modern", "Fashion Week", "Upscale"],
      description: "Contemporary venue hosting Shanghai Fashion Week events",
      features: ["Modern Design", "Tech Integration", "VIP Lounge", "Press Room"]
    },
    {
      id: "11",
      name: "Berlin Industrial Loft",
      location: "Berlin, Germany",
      city: "Berlin",
      country: "Germany",
      category: "Ballroom",
      capacity: 900,
      price: 7500,
      priceUnit: "day",
      rating: 4.4,
      image: "/src/assets/venue-setup.jpg",
      tags: ["Industrial", "Unique", "Urban"],
      description: "Trendy industrial space perfect for avant-garde shows",
      features: ["High Ceilings", "Natural Light", "Urban Feel", "Flexible Space"]
    },
    {
      id: "12",
      name: "Museo Botero Cali",
      location: "Cali, Colombia",
      city: "Cali",
      country: "Colombia",
      category: "Ballroom",
      capacity: 400,
      price: 4500,
      priceUnit: "day",
      rating: 4.3,
      image: "/src/assets/venue-setup.jpg",
      tags: ["Cultural", "Artistic", "Intimate"],
      description: "Art museum venue for intimate, artistic fashion presentations",
      features: ["Art Gallery", "Intimate Setting", "Cultural", "Unique"]
    }
  ];

  // Apply filters
  let filteredVenues = allVenues;
  
  if (search) {
    filteredVenues = filteredVenues.filter(v => 
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (category && category !== "all") {
    filteredVenues = filteredVenues.filter(v => v.category === category);
  }
  
  if (location && location !== "all") {
    filteredVenues = filteredVenues.filter(v => v.city.toLowerCase() === location.toLowerCase());
  }
  
  if (capacity && capacity !== "all") {
    if (capacity === "small") filteredVenues = filteredVenues.filter(v => v.capacity < 500);
    if (capacity === "medium") filteredVenues = filteredVenues.filter(v => v.capacity >= 500 && v.capacity < 2000);
    if (capacity === "large") filteredVenues = filteredVenues.filter(v => v.capacity >= 2000);
  }

  // Apply sorting
  if (sortBy === "price-low") {
    filteredVenues = [...filteredVenues].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredVenues = [...filteredVenues].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredVenues = [...filteredVenues].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "capacity") {
    filteredVenues = [...filteredVenues].sort((a, b) => b.capacity - a.capacity);
  }

  const total = filteredVenues.length;
  const totalPages = Math.ceil(total / limit);
  const paginatedVenues = filteredVenues.slice((page - 1) * limit, page * limit);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value === "all" || !value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    
    if (key !== "page") {
      newParams.set("page", "1");
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden bg-black mt-16 lg:mt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-pink-900/40" />
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="space-y-4 px-4">
            <Badge variant="hero" className="text-sm font-inter px-4 py-2 bg-white/20 backdrop-blur-sm text-white border-white/30">
              World-Class Venues
            </Badge>
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white">
              Fashion Venues
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover world-class venues curated for runway shows, exhibitions, and fashion experiences
            </p>
            <div className="flex justify-center gap-8 pt-4">
              <div className="text-white/80">
                <span className="text-3xl font-bold">100+</span>
                <span className="ml-2">Venues</span>
              </div>
              <div className="text-white/80">
                <span className="text-3xl font-bold">50+</span>
                <span className="ml-2">Cities</span>
              </div>
              <div className="text-white/80">
                <span className="text-3xl font-bold">10+</span>
                <span className="ml-2">Categories</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>Browse our curated selection of fashion event venues</span>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search venues..."
                  value={search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={category || undefined} onValueChange={(value) => updateFilter("category", value)}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Runway Hall">Runway Hall</SelectItem>
                  <SelectItem value="Ballroom">Ballroom</SelectItem>
                  <SelectItem value="Outdoor Showcase">Outdoor</SelectItem>
                  <SelectItem value="Expo Center">Expo Center</SelectItem>
                  <SelectItem value="Fashion Week Venue">Fashion Week</SelectItem>
                </SelectContent>
              </Select>

              <Select value={location || undefined} onValueChange={(value) => updateFilter("location", value)}>
                <SelectTrigger className="w-full sm:w-40">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="paris">Paris</SelectItem>
                  <SelectItem value="new york">New York</SelectItem>
                  <SelectItem value="medellín">Medellín</SelectItem>
                  <SelectItem value="tokyo">Tokyo</SelectItem>
                  <SelectItem value="dubai">Dubai</SelectItem>
                  <SelectItem value="milan">Milan</SelectItem>
                  <SelectItem value="bogotá">Bogotá</SelectItem>
                  <SelectItem value="london">London</SelectItem>
                  <SelectItem value="cartagena">Cartagena</SelectItem>
                  <SelectItem value="shanghai">Shanghai</SelectItem>
                  <SelectItem value="berlin">Berlin</SelectItem>
                  <SelectItem value="cali">Cali</SelectItem>
                </SelectContent>
              </Select>

              <Select value={capacity || undefined} onValueChange={(value) => updateFilter("capacity", value)}>
                <SelectTrigger className="w-full sm:w-40">
                  <Users className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Capacities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Capacities</SelectItem>
                  <SelectItem value="small">0-500</SelectItem>
                  <SelectItem value="medium">500-2000</SelectItem>
                  <SelectItem value="large">2000+</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
                <SelectTrigger className="w-full sm:w-40">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="capacity">Largest Capacity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(search || category || location || capacity || sortBy !== 'newest') && (
              <Button variant="outline" onClick={clearFilters} className="w-full sm:w-auto">
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results */}
        {paginatedVenues.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No venues found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing {paginatedVenues.length} of {total} venue{total !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedVenues.map((venue) => (
                <Card key={venue.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  {/* Venue Image */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">{venue.rating}</span>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="group-hover:text-primary transition-colors text-xl mb-2">
                          <Link to={`/venues/${venue.id}`}>
                            {venue.name}
                          </Link>
                        </CardTitle>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>{venue.location}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {venue.tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <CardDescription className="line-clamp-2">
                      {venue.description}
                    </CardDescription>

                    {/* Capacity & Price */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{venue.capacity.toLocaleString()} capacity</span>
                      </div>
                      <div className="font-semibold text-lg">
                        ${venue.price.toLocaleString()}<span className="text-sm text-muted-foreground">/{venue.priceUnit}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {venue.features.slice(0, 3).map((feature, idx) => (
                        <span key={idx}>• {feature}</span>
                      ))}
                    </div>

                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/venues/${venue.id}`}>
                        View Profile
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => updateFilter("page", String(page - 1))}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateFilter("page", String(pageNum))}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  {totalPages > 5 && (
                    <>
                      {totalPages > 6 && <span className="px-2">...</span>}
                      <Button
                        variant={totalPages === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateFilter("page", String(totalPages))}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => updateFilter("page", String(page + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Venues;
