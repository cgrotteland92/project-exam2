import { useState, useRef, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icons } from "./VenueIcons";

interface Media {
  url: string;
  alt?: string;
}

interface VenueGalleryProps {
  media?: Media[];
  name: string;
}

export default function VenueGallery({ media, name }: VenueGalleryProps) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const images = useMemo(() => {
    return media && media.length > 0
      ? media
      : [
          {
            url: "https://placehold.co/1200x600?text=No+Image",
            alt: "Placeholder",
          },
        ];
  }, [media]);

  useEffect(() => {
    if (images.length > 1) {
      const nextIndex = (currentImgIndex + 1) % images.length;
      const img = new Image();
      img.src = images[nextIndex].url;
    }
  }, [currentImgIndex, images]);

  const nextImage = () => {
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    if (swipeDistance > 50) nextImage();
    if (swipeDistance < -50) prevImage();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
      <div className="relative w-full h-[500px] md:h-[650px] bg-gray-100 rounded-3xl overflow-hidden shadow-sm group border border-gray-100">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImgIndex}
            src={images[currentImgIndex].url}
            alt={images[currentImgIndex].alt || name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 hidden md:block border border-gray-100 hover:scale-105 active:scale-95"
            >
              <Icons.ChevronLeft />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 hidden md:block border border-gray-100 hover:scale-105 active:scale-95"
            >
              <Icons.ChevronRight />
            </button>

            <div className="absolute bottom-5 right-5 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium tracking-wide shadow-sm">
              {currentImgIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
