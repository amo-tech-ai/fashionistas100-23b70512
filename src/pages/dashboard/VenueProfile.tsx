import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import {
  MapPin,
  Users,
  DollarSign,
  Star,
  Calendar as CalendarIcon,
  Mail,
  Phone,
  Wifi,
  Camera,
  Music,
  Utensils,
  Shield,
  ArrowLeft,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Sample venue data - replace with real data from Supabase
const sampleVenue = {
  id: '1',
  name: 'Grand Palais',
  location: 'Paris, France',
  description: 'An iconic Parisian venue that has hosted some of the world\'s most prestigious fashion events. The Grand Palais combines classical architecture with modern facilities, making it the perfect setting for haute couture shows and luxury fashion exhibitions.',
  capacity: {
    seated: 2000,
    standing: 3000,
  },
  price: 15000,
  priceUnit: 'day',
  currency: 'USD',
  category: ['Runway Hall', 'Luxury', 'Premium'],
  status: 'available',
  images: [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
    'https://images.unsplash.com/photo-1519167758481-83f29da8c19f?w=1200',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200',
  ],
  amenities: [
    { name: 'High-Speed Wi-Fi', icon: Wifi },
    { name: 'Professional AV/Lighting', icon: Camera },
    { name: 'Sound System', icon: Music },
    { name: 'Catering Services', icon: Utensils },
    { name: 'Security Staff', icon: Shield },
  ],
  rating: 4.8,
  reviews: 127,
  area: 85000,
  coordinates: { lat: 48.8566, lng: 2.3522 },
  contact: {
    manager: 'Sophie Laurent',
    email: 'sophie.laurent@grandpalais.fr',
    phone: '+33 1 44 13 17 17',
  },
  pastEvents: [
    {
      id: 'evt-1',
      title: 'Runway Revolution 2029',
      date: 'May 1, 2029',
      category: 'Fashion Week',
    },
    {
      id: 'evt-2',
      title: 'Spring Trends Fashion Show',
      date: 'March 15, 2029',
      category: 'Runway Show',
    },
    {
      id: 'evt-3',
      title: 'Haute Couture Week',
      date: 'January 20, 2029',
      category: 'Fashion Week',
    },
  ],
};

export default function VenueProfile() {
  const { venueId } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const venue = sampleVenue; // Replace with actual data fetching

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % venue.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + venue.images.length) % venue.images.length
    );
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <Link to="/dashboard/venues" className="hover:text-foreground transition-colors">
              Venues
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{venue.name}</span>
          </div>
        </div>

        {/* Back Button */}
        <div className="px-6 py-4">
          <Link to="/dashboard/venues">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Venues
            </Button>
          </Link>
        </div>

        {/* Hero Section with Image Gallery */}
        <div className="px-6 pb-6">
          <div className="relative h-96 rounded-xl overflow-hidden group">
            <img
              src={venue.images[currentImageIndex]}
              alt={venue.name}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {venue.images.length}
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <Badge
                className={
                  venue.status === 'available'
                    ? 'bg-green-500 text-white'
                    : venue.status === 'booked'
                    ? 'bg-red-500 text-white'
                    : 'bg-yellow-500 text-white'
                }
              >
                {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Venue Header */}
          <div className="mt-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{venue.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{venue.rating} ({venue.reviews} reviews)</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {venue.category.map((cat) => (
                    <Badge key={cat} variant="outline">{cat}</Badge>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Book Venue
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs Section */}
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="events">Past Events</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">About This Venue</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {venue.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="border border-border rounded-lg p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">Seated Capacity</span>
                        </div>
                        <p className="text-2xl font-bold">{venue.capacity.seated.toLocaleString()}</p>
                      </div>
                      <div className="border border-border rounded-lg p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">Standing Capacity</span>
                        </div>
                        <p className="text-2xl font-bold">{venue.capacity.standing.toLocaleString()}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="amenities" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {venue.amenities.map((amenity) => (
                        <div
                          key={amenity.name}
                          className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-lg">
                            <amenity.icon className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-medium">{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="events" className="mt-4">
                    <div className="space-y-3">
                      {venue.pastEvents.map((event) => (
                        <Link
                          key={event.id}
                          to={`/dashboard/events/${event.id}`}
                          className="block p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold group-hover:text-purple-600 transition-colors">
                                {event.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">{event.date}</p>
                            </div>
                            <Badge variant="outline">{event.category}</Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="location" className="mt-4">
                    <div className="space-y-4">
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                        <MapPin className="h-12 w-12" />
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">{venue.name}</p>
                          <p className="text-sm text-muted-foreground">{venue.location}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar Info */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    ${venue.price.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">/ {venue.priceUnit}</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Request Quote
                </Button>
              </CardContent>
            </Card>

            {/* Venue Facts Card */}
            <Card>
              <CardHeader>
                <CardTitle>Venue Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Total Area</span>
                  <span className="font-semibold">{venue.area.toLocaleString()} sq ft</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Seated</span>
                  <span className="font-semibold">{venue.capacity.seated.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Standing</span>
                  <span className="font-semibold">{venue.capacity.standing.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {venue.rating}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Availability Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>Check Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold mb-2">{venue.contact.manager}</p>
                  <p className="text-sm text-muted-foreground">Venue Manager</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${venue.contact.email}`}
                    className="text-purple-600 hover:underline"
                  >
                    {venue.contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${venue.contact.phone}`}
                    className="text-purple-600 hover:underline"
                  >
                    {venue.contact.phone}
                  </a>
                </div>
                <Button variant="outline" className="w-full mt-2">
                  <Download className="h-4 w-4 mr-2" />
                  Download Brochure
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
