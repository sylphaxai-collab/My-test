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
      // For unauthenticated users, you might want to redirect to login
      return;
    }

    try {
      const result = await wishlistService.toggleWishlist(productId);
      if (!result.error) {
        setWishlist(prev => {
          if (result.in_wishlist) {
            return [...prev, productId];
          } else {
            return prev.filter(id => id !== productId);
          }
        });
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
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
