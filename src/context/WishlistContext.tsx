'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { wishlistService } from '@/lib/wishlist';
import { useAuth } from '@/lib/auth';

interface WishlistContextType {
  wishlist: number[];
  toggleWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load wishlist on user change
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setWishlist([]);
      setIsLoading(false);
      return;
    }

    const loadWishlist = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await wishlistService.getWishlist();
        if (error) {
          console.error('Failed to load wishlist:', error);
        } else {
          setWishlist(data);
        }
      } catch (err) {
        console.error('Error loading wishlist:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [user, authLoading]);

  const toggleWishlist = async (productId: number) => {
    if (!user) {
      return;
    }

    try {
      // Check current state first
      const isCurrentlyInWishlist = wishlist.includes(productId);

      if (isCurrentlyInWishlist) {
        // Use dedicated remove endpoint when removing
        const result = await wishlistService.removeWishlistItem(productId);
        if (result.success) {
          setWishlist(prev => prev.filter(id => id !== productId));
        } else {
          throw new Error(result.error);
        }
      } else {
        // Use toggle for adding (as before)
        const result = await wishlistService.toggleWishlist(productId);
        if (!result.error) {
          setWishlist(prev => [...prev, productId]);
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlist.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
