import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import {
  Search,
  Plus,
  MoreVertical,
  Bell,
  Settings,
  User,
  Edit,
  Trash2,
  Eye,
  FolderPlus,
} from 'lucide-react';

interface Event {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string;
  categoryColor: string;
}

const events: Event[] = [
  {
    id: 1,
    title: 'Echo Beats Festival',
    category: 'Music',
    date: 'May 20, 2029',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
    categoryColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 2,
    title: 'Culinary Delights Festival',
    category: 'Food & Culinary',
    date: 'May 25, 2029',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    categoryColor: 'bg-orange-100 text-orange-700',
  },
  {
    id: 3,
    title: 'Artistry Unveiled Expo',
    category: 'Art & Design',
    date: 'May 15, 2029',
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&h=600&fit=crop',
    categoryColor: 'bg-cyan-100 text-cyan-700',
  },
  {
    id: 4,
    title: 'Tech Future Expo',
    category: 'Technology',
    date: 'June 1, 2029',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    categoryColor: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 5,
    title: 'Runway Revolution 2029',
    category: 'Fashion',
    date: 'May 1, 2029',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea3c8db6?w=800&h=600&fit=crop',
    categoryColor: 'bg-pink-100 text-pink-700',
  },
  {
    id: 6,
    title: 'Global Wellness Summit',
    category: 'Health & Wellness',
    date: 'May 5, 2029',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=600&fit=crop',
    categoryColor: 'bg-green-100 text-green-700',
  },
  {
    id: 7,
    title: 'Adventure Gear Show',
    category: 'Outdoor & Adventure',
    date: 'June 5, 2029',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
    categoryColor: 'bg-teal-100 text-teal-700',
  },
  {
    id: 8,
    title: 'Symphony Under the Stars',
    category: 'Music',
    date: 'April 20, 2029',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop',
    categoryColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 9,
    title: 'Harmony Health Fair',
    category: 'Health & Wellness',
    date: 'June 15, 2029',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop',
    categoryColor: 'bg-green-100 text-green-700',
  },
  {
    id: 10,
    title: 'Live Paint Battle',
    category: 'Art & Design',
    date: 'June 20, 2029',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
    categoryColor: 'bg-cyan-100 text-cyan-700',
  },
  {
    id: 11,
    title: 'Spring Trends Runway',
    category: 'Fashion',
    date: 'June 10, 2029',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=600&fit=crop',
    categoryColor: 'bg-pink-100 text-pink-700',
  },
  {
    id: 12,
    title: 'Champions League Final Viewing Party',
    category: 'Sports',
    date: 'May 10, 2029',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=600&fit=crop',
    categoryColor: 'bg-red-100 text-red-700',
  },
];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  const filteredEvents = events.filter((event) => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);
  const totalEvents = 48; // Mock total for display

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4">
          <div className="flex flex-col gap-4">
            {/* Breadcrumbs and Title */}
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Dashboard / <span className="text-foreground">Gallery</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gallery</h1>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search event"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              {/* Filter Icon (Mobile) */}
              <Button
                variant="outline"
                size="icon"
                className="flex sm:hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
              >
                <Settings className="h-4 w-4" />
              </Button>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Category" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="all">All Category</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Music">Music</SelectItem>
                  <SelectItem value="Art & Design">Art & Design</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Food & Culinary">Food & Culinary</SelectItem>
                  <SelectItem value="Outdoor & Adventure">Outdoor & Adventure</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Filter */}
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="This Week" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>

              {/* Create New Folder Button */}
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 whitespace-nowrap">
                <Plus className="h-4 w-4 mr-2" />
                Create New Folder
              </Button>

              {/* User Section (Desktop) */}
              <div className="hidden lg:flex items-center gap-3 ml-auto">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden xl:block">
                    <p className="text-sm font-medium">Orlando Laurentius</p>
                    <p className="text-xs text-muted-foreground">Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {/* Event Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {currentEvents.map((event) => (
              <Card
                key={event.id}
                className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-white"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-2 right-2 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white z-50">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-1">
                    {event.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <Badge className={`${event.categoryColor} text-xs font-medium`}>
                      {event.category}
                    </Badge>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {event.date}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-muted-foreground">
              Showing{' '}
              <Select value={itemsPerPage.toString()} onValueChange={() => {}}>
                <SelectTrigger className="inline-flex w-16 h-8 mx-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
              out of {totalEvents}
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(1);
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>

                {currentPage > 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {currentPage !== 1 && currentPage !== totalPages && (
                  <PaginationItem>
                    <PaginationLink href="#" isActive={true}>
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                )}

                {currentPage < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {totalPages > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === totalPages}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(totalPages);
                      }}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-4 sm:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>Copyright © 2025 Fashionistas</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Term and conditions
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </DashboardLayout>
  );
}
