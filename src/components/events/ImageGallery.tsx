import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useImageResolver } from "@/hooks/useImageResolver";

interface ImageGalleryProps {
  images: string[];
  onImageClick: (imageUrl: string, allImages: string[]) => void;
  allImages: string[];
}

export const ImageGallery = ({ images, onImageClick, allImages }: ImageGalleryProps) => {
  const { resolveImage } = useImageResolver();
  return (
    <div className="container mx-auto px-4">
      <h3 className="text-2xl font-playfair font-bold mb-6">Event Gallery</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
            onClick={() => onImageClick(image, allImages)}
          >
            <img
              src={resolveImage(image)}
              alt={`Event gallery ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
};

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export const ImageLightbox = ({ isOpen, onClose, images, currentIndex, onIndexChange }: ImageLightboxProps) => {
  const { resolveImage } = useImageResolver();
  const nextImage = () => {
    onIndexChange((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    onIndexChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95" onKeyDown={handleKeyDown}>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={prevImage}
                className="absolute left-4 z-50 text-white hover:bg-white/10"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextImage}
                className="absolute right-4 z-50 text-white hover:bg-white/10"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          {/* Current Image */}
          <img
            src={resolveImage(images[currentIndex])}
            alt={`Gallery image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};