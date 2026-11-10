import { supabase } from './supabaseClient';

export interface WishlistItem {
  id: number;
  user_id: string;
  product_id: number;
  created_at: string;
}

export const wishlistService = {
  async getWishlist() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        return { data: [], error: null };
      }

      const { data, error } = await supabase
        .from('wishlist_items')
        .select('product_id')
        .eq('user_id', session.user.id);

      if (error) throw error;

      return { data: data.map(item => item.product_id), error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  },

  async toggleWishlist(productId: number) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        return { error: 'Unauthorized' };
      }

      // Check if product exists and is active
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, is_active')
        .eq('id', productId)
        .single();

      if (productError || !product || !product.is_active) {
        return { error: 'Product not found or inactive' };
      }

      // Check if already in wishlist
      const { data: existing } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('product_id', productId)
        .single();

      if (existing) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('user_id', session.user.id)
          .eq('product_id', productId);

        if (error) throw error;

        return { in_wishlist: false, error: null };
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlist_items')
          .insert({
            user_id: session.user.id,
            product_id: productId
          });

        if (error) throw error;

        return { in_wishlist: true, error: null };
      }
    } catch (error: any) {
      return { error: error.message };
    }
  }
};
