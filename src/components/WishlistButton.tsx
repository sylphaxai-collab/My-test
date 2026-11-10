'use client';

import React from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { HeartIcon, HeartFilledIcon } from './icons';

interface WishlistButtonProps {
  productId: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function WishlistButton({ productId, size = 'md', className = '' }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist, isLoading } = useWishlist();
  const isWishlisted = isInWishlist(productId);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      toggleWishlist(productId);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        p-2 rounded-full transition-colors duration-200
        ${isWishlisted 
          ? 'text-soft-pink-dark hover:text-soft-pink' 
          : 'text-navy hover:text-soft-pink-dark'}
        ${isLoading ? 'opacity-50 cursor-wait' : 'hover:bg-cream-dark/20'}
        ${className}
      `}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isWishlisted ? (
        <HeartFilledIcon className={sizeClasses[size]} />
      ) : (
        <HeartIcon className={sizeClasses[size]} />
      )}
    </button>
  );
}
