import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MapPin,
  Calendar,
  Star,
  Bookmark,
  Share2,
  Download,
  Mail,
  Phone,
  ExternalLink,
  ChevronLeft,
  User,
  Briefcase,
} from 'lucide-react';
import { getModelById, type ModelProfile as ModelProfileType } from '@/services/modelService';

export default function ModelProfile() {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<ModelProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchModel = async () => {
      if (!id) return;
      setLoading(true);
      const data = await getModelById(id);
      setModel(data);
      setLoading(false);
    };
    fetchModel();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!model) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Model Not Found</h2>
          <p className="text-muted-foreground mb-4">The model profile you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/dashboard/models">Back to Models</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Runway: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      Editorial: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
      Couture: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      Commercial: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Available: 'bg-green-500 text-white',
      Booked: 'bg-red-500 text-white',
      'On Hold': 'bg-yellow-500 text-white',
    };
    return colors[status] || 'bg-gray-500 text-white';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <span>/</span>
          <Link to="/dashboard/models" className="hover:text-foreground">Models</Link>
          <span>/</span>
          <span className="text-foreground">{model.name}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/dashboard/models">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Models
          </Link>
        </Button>

        {/* Hero Section */}
        <Card className="overflow-hidden">
          <div className="relative h-64 md:h-80 bg-gradient-to-br from-purple-500 to-pink-500">
            <img
              src={model.image}
              alt={model.name}
              className="w-full h-full object-cover mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Actions - Top Right */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="icon" variant="secondary" className="rounded-full">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Model Info - Bottom */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {model.name}
                  </h1>
                  <p className="text-white/90 text-lg mb-2">{model.agency}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getCategoryColor(model.category)}>{model.category}</Badge>
                    <Badge className={getStatusColor(model.status)}>{model.status}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{model.bio}</p>
                
                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Experience</p>
                    <p className="font-medium">{model.experience}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Location</p>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {model.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Age</p>
                    <p className="font-medium">{model.age} years</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Agency</p>
                    <p className="font-medium">{model.agency}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Past Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Past Events & Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Recent Events</h4>
                  <div className="space-y-2">
                    {model.pastEvents.map((event, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">{event.name}</span>
                        <span className="text-sm text-muted-foreground">{event.year}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Brands Worked With</h4>
                  <div className="flex flex-wrap gap-2">
                    {model.brandsWorkedWith.map((brand, idx) => (
                      <Badge key={idx} variant="outline">{brand}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Gallery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Main Image */}
                <div className="aspect-[4/5] relative rounded-lg overflow-hidden bg-muted">
                  <img
                    src={model.portfolioImages[selectedImage]}
                    alt={`Portfolio ${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnail Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {model.portfolioImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? 'border-primary scale-95'
                          : 'border-transparent hover:border-muted-foreground/20'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            {model.reviews && model.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    Reviews & Endorsements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {model.reviews.map((review, idx) => (
                    <div key={idx} className="p-4 bg-muted rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{review.author}</p>
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Details & Booking */}
          <div className="space-y-6">
            {/* Measurements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Measurements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Height</span>
                  <span className="font-medium">{model.height}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bust</span>
                  <span className="font-medium">{model.bust}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Waist</span>
                  <span className="font-medium">{model.waist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hips</span>
                  <span className="font-medium">{model.hips}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shoe Size</span>
                  <span className="font-medium">{model.shoeSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hair Color</span>
                  <span className="font-medium">{model.hairColor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Eye Color</span>
                  <span className="font-medium">{model.eyeColor}</span>
                </div>
              </CardContent>
            </Card>

            {/* Rates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Per Show</p>
                  <p className="text-2xl font-bold text-primary">${model.pricePerShow}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-muted rounded-lg">
                    <p className="text-muted-foreground mb-1">Per Hour</p>
                    <p className="font-bold">${model.pricePerHour}</p>
                  </div>
                  {model.dailyRate && (
                    <div className="p-2 bg-muted rounded-lg">
                      <p className="text-muted-foreground mb-1">Daily Rate</p>
                      <p className="font-bold">${model.dailyRate}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Next Available:</span>
                </div>
                <p className="font-semibold text-lg">{model.nextAvailable}</p>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Booking Rate</span>
                    <span className="text-sm font-medium">{model.bookedPercentage}%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                      style={{ width: `${model.bookedPercentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact & Booking */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact & Booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" size="lg">
                  <Link to={`/dashboard/bookings/new?modelId=${model.id}`} className="w-full">
                    Book Model
                  </Link>
                </Button>

                {model.managerName && (
                  <>
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold">Agency Manager</p>
                      <p className="text-muted-foreground">{model.managerName}</p>
                      {model.managerEmail && (
                        <a
                          href={`mailto:${model.managerEmail}`}
                          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                          <Mail className="h-3 w-3" />
                          {model.managerEmail}
                        </a>
                      )}
                      {model.managerPhone && (
                        <a
                          href={`tel:${model.managerPhone}`}
                          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                          <Phone className="h-3 w-3" />
                          {model.managerPhone}
                        </a>
                      )}
                    </div>
                  </>
                )}

                {model.compCardUrl && (
                  <>
                    <Separator />
                    <Button variant="outline" className="w-full" asChild>
                      <a href={model.compCardUrl} download>
                        <Download className="h-4 w-4 mr-2" />
                        Download Comp Card
                      </a>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
