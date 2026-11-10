'use client';

import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="bg-soft-gray flex items-center justify-center h-96 rounded-lg">
        <p className="text-navy">No image available</p>
      </div>
    );
  }

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
        <img
          src={images[selectedImageIndex]}
          alt="Product"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1661956400610-6bc7c197b1d8?w=600&auto=format';
            target.onerror = null;
          }}
        />
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={`
                flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2
                ${selectedImageIndex === index 
                  ? 'border-soft-pink-dark' 
                  : 'border-transparent'}
                transition-all duration-200 hover:scale-105
              `}
              onClick={() => handleThumbnailClick(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1661956400610-6bc7c197b1d8?w=600&auto=format';
                  target.onerror = null;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
