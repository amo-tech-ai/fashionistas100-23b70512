import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Camera, Download, Share2, Heart, Eye, Filter, Grid, List,
  Upload, Trash2, Edit, Star, Calendar, MapPin, Search, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';

const Gallery = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const mediaItems = [
    {
      id: '1',
      type: 'image',
      title: 'Medellín Fashion Week 2025 - Runway',
      event: 'Medellín Fashion Week',
      date: 'Sep 18, 2025',
      photographer: 'Carlos Martinez',
      url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
      views: 1250,
      likes: 89,
      category: 'runway'
    },
    {
      id: '2',
      type: 'image',
      title: 'Backstage Moments - Designer Prep',
      event: 'Noches de Alta Costura',
      date: 'Sep 12, 2025',
      photographer: 'Ana Rodriguez',
      url: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=400',
      views: 856,
      likes: 67,
      category: 'backstage'
    },
    {
      id: '3',
      type: 'image',
      title: 'VIP Reception - Fashion Week',
      event: 'Fashion Week Gala',
      date: 'Sep 15, 2025',
      photographer: 'Luis Gomez',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      views: 2100,
      likes: 156,
      category: 'events'
    },
    {
      id: '4',
      type: 'image',
      title: 'Designer Collection Showcase',
      event: 'Designer Spotlight',
      date: 'Oct 5, 2025',
      photographer: 'Maria Silva',
      url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
      views: 3200,
      likes: 234,
      category: 'collections'
    },
    {
      id: '5',
      type: 'image',
      title: 'Model Portraits - Fashion Week',
      event: 'Model Casting',
      date: 'Sep 10, 2025',
      photographer: 'Diego Morales',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      views: 1890,
      likes: 145,
      category: 'portraits'
    },
    {
      id: '6',
      type: 'image',
      title: 'Venue Setup - Plaza Mayor',
      event: 'Venue Preparation',
      date: 'Sep 17, 2025',
      photographer: 'Sofia Chen',
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      views: 945,
      likes: 72,
      category: 'venues'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Media', count: mediaItems.length },
    { id: 'runway', label: 'Runway', count: 24 },
    { id: 'backstage', label: 'Backstage', count: 18 },
    { id: 'events', label: 'Events', count: 32 },
    { id: 'collections', label: 'Collections', count: 15 },
    { id: 'portraits', label: 'Portraits', count: 28 },
    { id: 'venues', label: 'Venues', count: 12 }
  ];

  const filteredMedia = selectedCategory === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Media Gallery</h1>
                <p className="text-gray-600 mt-1">Event photos and media management</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Media
                </Button>
              </div>
            </div>
          </div>
        </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search by event, photographer, or date..." 
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <div className="flex gap-6">
          {/* Categories Sidebar */}
          <div className="w-64">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex justify-between items-center ${
                        selectedCategory === cat.id ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-600' : ''
                      }`}
                    >
                      <span className="text-sm">{cat.label}</span>
                      <Badge variant="secondary" className="text-xs">{cat.count}</Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Gallery Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Media</span>
                  <span className="font-semibold">1,284</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Views</span>
                  <span className="font-semibold">45.2K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Likes</span>
                  <span className="font-semibold">3,892</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Storage Used</span>
                  <span className="font-semibold">12.5 GB</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Media Grid */}
          <div className="flex-1">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMedia.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative group">
                      <img 
                        src={item.url} 
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="icon" variant="secondary" className="rounded-full">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="secondary" className="rounded-full">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="secondary" className="rounded-full">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                        {item.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-gray-600 mb-2">{item.event} • {item.date}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>by {item.photographer}</span>
                        <div className="flex gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {item.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {item.likes}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMedia.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={item.url} 
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.event} • {item.date} • by {item.photographer}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {item.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {item.likes} likes
                          </span>
                          <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Gallery;