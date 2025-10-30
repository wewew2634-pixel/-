/**
 * Image Gallery Component
 * 
 * Displays a gallery of images with lightbox functionality.
 * Supports swipe navigation, zoom, and thumbnails.
 * 
 * @example
 * ```tsx
 * <ImageGallery
 *   images={['url1', 'url2', 'url3']}
 *   alt="Mission images"
 * />
 * ```
 */

'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface ImageGalleryProps {
  images: string[];
  alt?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide';
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  alt = 'Gallery image',
  className,
  aspectRatio = 'video',
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentLightboxIndex, setCurrentLightboxIndex] = useState(0);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
  };

  const openLightbox = useCallback((index: number) => {
    setCurrentLightboxIndex(index);
    setSelectedIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const nextImage = useCallback(() => {
    setCurrentLightboxIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const previousImage = useCallback(() => {
    setCurrentLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Handle keyboard navigation
  React.useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') previousImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, closeLightbox, nextImage, previousImage]);

  if (images.length === 0) return null;

  return (
    <>
      {/* Gallery Grid */}
      <div className={cn('grid gap-2', className)}>
        {/* Main Image */}
        <button
          onClick={() => openLightbox(0)}
          className={cn(
            'relative w-full overflow-hidden rounded-lg bg-bg-tertiary',
            'hover:opacity-90 transition-opacity cursor-zoom-in',
            aspectRatioClasses[aspectRatio]
          )}
        >
          <Image
            src={images[0] || ''}
            alt={`${alt} 1`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          {images.length > 1 && (
            <div className="absolute top-3 right-3 px-3 py-1 bg-black/70 text-white text-sm rounded-full backdrop-blur-sm">
              1 / {images.length}
            </div>
          )}
        </button>

        {/* Thumbnail Grid */}
        {images.length > 1 && (
          <div className={cn(
            'grid gap-2',
            images.length === 2 && 'grid-cols-2',
            images.length === 3 && 'grid-cols-3',
            images.length >= 4 && 'grid-cols-4'
          )}>
            {images.slice(1, 5).map((image, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index + 1)}
                className={cn(
                  'relative aspect-square rounded-lg overflow-hidden bg-bg-tertiary',
                  'hover:opacity-90 transition-opacity cursor-zoom-in'
                )}
              >
                <Image
                  src={image}
                  alt={`${alt} ${index + 2}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 10vw"
                />
                {/* Show "+N" overlay if more images */}
                {index === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      +{images.length - 5}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 animate-fade-in">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-3 text-white hover:text-gray-300 transition-colors"
            aria-label="Close lightbox"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-black/70 text-white rounded-full backdrop-blur-sm">
            {currentLightboxIndex + 1} / {images.length}
          </div>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="relative max-w-7xl max-h-full w-full h-full">
              <Image
                src={images[currentLightboxIndex] || ''}
                alt={`${alt} ${currentLightboxIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={previousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-3 bg-black/70 rounded-full backdrop-blur-sm max-w-full overflow-x-auto scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentLightboxIndex(index)}
                  className={cn(
                    'relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0',
                    'border-2 transition-all',
                    currentLightboxIndex === index
                      ? 'border-white scale-110'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

ImageGallery.displayName = 'ImageGallery';
