import { useState } from "react";
import { ArrowLeft, Share2, Calendar, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { EventSummary } from "@/services/eventService";
import { ImageGallery } from "./ImageGallery";
import { useToast } from "@/hooks/use-toast";
import { useImageResolver } from "@/hooks/useImageResolver";

interface EventHeroProps {
  event: EventSummary;
  onImageClick: (imageUrl: string, images: string[]) => void;
}

export const EventHero = ({ event, onImageClick }: EventHeroProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resolveImage } = useImageResolver();

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
  };

  const getDaysUntilEvent = () => {
    const eventDate = new Date(event.startISO);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: `Check out this amazing fashion event: ${event.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Event link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Event link has been copied to your clipboard.",
        });
      } catch (clipboardError) {
        toast({
          title: "Share failed",
          description: "Unable to share or copy link.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddToCalendar = () => {
    const startDate = new Date(event.startISO);
    const endDate = event.endISO ? new Date(event.endISO) : new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // Default 3 hours
    
    const formatCalendarDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatCalendarDate(startDate)}/${formatCalendarDate(endDate)}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(`${event.venue.name}, ${event.venue.address || ''}`)}`;
    
    window.open(calendarUrl, '_blank');
  };

  const daysUntil = getDaysUntilEvent();
  const allImages = [event.heroImage, ...event.galleryImages].filter(Boolean) as string[];

  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
        <img
          src={resolveImage(event.heroImage)}
          alt={event.title}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => onImageClick(event.heroImage || "", allImages)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-black/20 hover:bg-black/40 text-white border-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Share Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white border-white/20"
        >
          <Share2 className="w-4 h-4" />
        </Button>

        {/* Event Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="bg-accent/20 text-white border-white/20">
                Fashion Event
              </Badge>
              {daysUntil > 0 && daysUntil <= 7 && (
                <Badge variant="destructive" className="bg-red-600/80 text-white">
                  {daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days left`}
                </Badge>
              )}
              {event.available && event.available < 50 && (
                <Badge variant="destructive" className="bg-orange-600/80 text-white">
                  Limited tickets
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-4">
              {event.title}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="font-inter">{formatDate(event.startISO)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-inter">{formatTime(event.startISO)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="font-inter">{event.venue.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="font-inter">
                  {event.capacity ? `${event.capacity - (event.ticketsSold || 0)} spots left` : 'Limited capacity'}
                </span>
              </div>
            </div>

            {/* Add to Calendar Button */}
            <Button
              onClick={handleAddToCalendar}
              variant="outline"
              className="mt-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Add to Calendar
            </Button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      {event.galleryImages && event.galleryImages.length > 0 && (
        <div className="mt-8">
          <ImageGallery
            images={event.galleryImages}
            onImageClick={onImageClick}
            allImages={allImages}
          />
        </div>
      )}
    </div>
  );
};