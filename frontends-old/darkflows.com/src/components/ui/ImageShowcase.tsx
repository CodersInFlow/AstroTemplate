"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ShowcaseItem {
  title: string;
  description: string;
  imageSrc: string;
}

interface ImageShowcaseProps {
  items?: ShowcaseItem[];
  title?: string;
  subtitle?: string;
}

const ImageShowcase: React.FC<ImageShowcaseProps> = ({ items: propItems, title, subtitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [selectedImage, setSelectedImage] = useState<ShowcaseItem | null>(null);
  const [startPos, setStartPos] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Default items if none provided
  const defaultItems: ShowcaseItem[] = [
    {
      title: "Real-time Collaboration",
      description: "Work together with your team in real-time",
      imageSrc: "/placeholder.png"
    },
    {
      title: "Advanced Analytics",
      description: "Get insights into your development process",
      imageSrc: "/placeholder.png"
    },
    {
      title: "Code Intelligence",
      description: "Smart code analysis and suggestions",
      imageSrc: "/placeholder.png"
    },
  ];

  const items = propItems || defaultItems;

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1280) setItemsPerView(4); // xl
      else if (window.innerWidth >= 1024) setItemsPerView(3); // lg
      else if (window.innerWidth >= 768) setItemsPerView(2); // md
      else setItemsPerView(1); // mobile
    };

    const handleScroll = () => {
      const element = document.getElementById('image-showcase');
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight - 100;
      setIsVisible(isInView);
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('resize', updateItemsPerView);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = items.length - itemsPerView;
      return prev >= maxIndex ? maxIndex : prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? 0 : prev - 1
    );
  };

  const openModal = (item: ShowcaseItem) => {
    setSelectedImage(item);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setStartPos(e.clientX);
  };

  const handleMouseUp = () => {
    setStartPos(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (startPos === null) return;

    const diff = startPos - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      setStartPos(null);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartPos(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setStartPos(null);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startPos === null) return;

    const diff = startPos - e.touches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      setStartPos(null);
    }
  };

  return (
    <>
      <div 
        id="image-showcase" 
        className={`w-full bg-background py-8 select-none transition-opacity duration-1000
          ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-[95vw] mx-auto">
          {/* Section Header */}
          {(title || subtitle) && (
            <div className="text-center mb-8">
              {title && (
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          <div className="relative">
            <div 
              ref={carouselRef}
              className="overflow-hidden cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
            >
              <div 
                className="flex gap-2 transition-transform duration-500 ease-out mb-12"
                style={{ 
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                }}
              >
                {items.map((item, index) => {
                  const isCenter = index === currentIndex + Math.floor(itemsPerView / 2);
                  return (
                    <div
                      key={index}
                      className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 transition-all duration-300"
                      style={{
                        transform: `scale(${isCenter ? 1.1 : 0.9})`,
                        zIndex: isCenter ? 2 : 1,
                      }}
                    >
                      <div className="rounded-lg overflow-hidden">
                        <div 
                          className="relative w-full flex items-center justify-center cursor-pointer"
                          onClick={() => openModal(item)}
                        >
                          <img
                            src={item.imageSrc}
                            alt={item.title}
                            className="w-full h-auto object-contain rounded-lg hover:opacity-90 transition-opacity"
                            draggable={false}
                          />
                        </div>
                        <div className="text-center mt-4">
                          <h3 className="text-lg font-semibold text-foreground">
                            {item.title}
                          </h3>
                          <p className="text-sm text-foreground-muted">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-surface p-2 rounded-full text-foreground hover:bg-surface-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-surface p-2 rounded-full text-foreground hover:bg-surface-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
              disabled={currentIndex >= items.length - itemsPerView}
            >
              <ChevronRight size={24} />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-12 gap-2 pb-8">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary' : 'bg-surface-light'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal/Popup */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8"
          onClick={closeModal}
        >
          <div className="relative w-full max-w-[90vw] h-full max-h-[85vh] flex flex-col">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-foreground hover:text-foreground-muted transition-colors"
            >
              <X size={32} />
            </button>
            <div className="flex flex-col items-center h-full overflow-y-auto py-4">
              <img
                src={selectedImage.imageSrc}
                alt={selectedImage.title}
                className="max-w-full max-h-[90vh] object-contain"
              />
              <div 
                className="text-center w-full pb-4 mt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {selectedImage.title}
                </h2>
                <p className="text-foreground-secondary">
                  {selectedImage.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageShowcase;