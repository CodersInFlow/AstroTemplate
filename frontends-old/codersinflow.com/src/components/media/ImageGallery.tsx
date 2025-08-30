import React, { useState } from 'react';
import { BaseComponentProps } from '../../types';

export interface GalleryImage {
  id: string | number;
  src: string;
  alt?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
}

export interface ImageGalleryProps extends BaseComponentProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4 | 5;
  showModal?: boolean;
  showThumbnails?: boolean;
  theme?: 'light' | 'dark';
  onImageClick?: (image: GalleryImage, index: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  columns = 3,
  showModal = true,
  showThumbnails = false,
  theme = 'light',
  className = '',
  onImageClick
}) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isDark = theme === 'dark';

  const textColors = isDark
    ? { primary: 'text-white', secondary: 'text-gray-300', muted: 'text-gray-400' }
    : { primary: 'text-gray-900', secondary: 'text-gray-700', muted: 'text-gray-500' };

  const bgColors = isDark
    ? { modal: 'bg-black/90', card: 'bg-gray-800', hover: 'hover:bg-gray-700' }
    : { modal: 'bg-black/75', card: 'bg-white', hover: 'hover:bg-gray-50' };

  const gridClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
  };

  const handleImageClick = (image: GalleryImage, index: number) => {
    if (showModal) {
      setSelectedImage(image);
      setCurrentIndex(index);
    }
    onImageClick?.(image, index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    let newIndex = currentIndex;
    if (direction === 'next') {
      newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    }
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const ChevronLeftIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  if (images.length === 0) {
    return (
      <div className={`${bgColors.card} rounded-lg p-8 text-center ${className}`}>
        <p className={textColors.muted}>No images available</p>
      </div>
    );
  }

  return (
    <>
      <div className={`w-full ${className}`}>
        <div className={`grid ${gridClasses[columns]} gap-4`}>
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative group overflow-hidden rounded-lg cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
              onClick={() => handleImageClick(image, index)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={image.thumbnail || image.src}
                  alt={image.alt || image.title || `Image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
              
              {/* Image Info Overlay */}
              {image.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white font-medium text-sm truncate">
                    {image.title}
                  </h3>
                  {image.description && (
                    <p className="text-white/70 text-xs mt-1 line-clamp-2">
                      {image.description}
                    </p>
                  )}
                </div>
              )}

              {/* Zoom Icon */}
              <div className="absolute top-2 right-2 bg-black/50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Thumbnails */}
        {showThumbnails && selectedImage && (
          <div className="mt-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={`thumb-${image.id}`}
                  onClick={() => {
                    setCurrentIndex(index);
                    setSelectedImage(image);
                  }}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentIndex
                      ? 'border-indigo-500'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image.thumbnail || image.src}
                    alt={image.alt || `Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedImage && (
        <div 
          className={`fixed inset-0 ${bgColors.modal} z-50 flex items-center justify-center p-4`}
          onClick={closeModal}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Close image"
            >
              <CloseIcon />
            </button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2 z-10"
                  aria-label="Next image"
                >
                  <ChevronRightIcon />
                </button>
              </>
            )}

            {/* Image */}
            <div className="relative">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt || selectedImage.title || 'Full size image'}
                className="max-w-full max-h-[80vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Image Info */}
            {(selectedImage.title || selectedImage.description) && (
              <div className="mt-4 text-center">
                {selectedImage.title && (
                  <h3 className="text-white text-lg font-medium mb-2">
                    {selectedImage.title}
                  </h3>
                )}
                {selectedImage.description && (
                  <p className="text-white/70 text-sm">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white text-sm">
                {currentIndex + 1} of {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;