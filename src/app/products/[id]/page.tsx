import { Product } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import ImageGallery from '@/components/ImageGallery';
import CustomerReviews from '@/components/CustomerReviews';
import { Metadata } from 'next';
import { formatPrice } from '@/lib/utils';
import AddToCartButton from '@/components/AddToCartButton';
import WishlistButton from '@/components/WishlistButton';
import { Suspense } from 'react';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { data: product, error } = await supabase
    .from('products')
    .select('name, description')
    .eq('id', params.id)
    .single();

  if (error || !product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: product.name,
    description: product.description || `Buy ${product.name} at our store`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = params;

  // Fetch product data
  const { data: product, error } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error || !product) {
    notFound();
  }

  // Transform data to match Product interface
  const typedProduct: Product = {
    ...product,
    category: product.category ? { 
      id: product.category_id!, 
      name: product.category.name, 
      description: null, 
      created_at: '', 
      updated_at: '' 
    } : null
  };

  // Create array of images (using image_url as main image)
  const images = typedProduct.image_url ? [typedProduct.image_url] : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <ImageGallery images={images} />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-navy mb-4">{typedProduct.name}</h1>
          
          {typedProduct.category && (
            <p className="text-soft-pink-dark font-medium mb-2">
              Category: {typedProduct.category.name}
            </p>
          )}

          <div className="flex items-center gap-6 mb-6">
            <span className="text-2xl font-bold text-gold">{formatPrice(typedProduct.price)}</span>
            <span 
              className={`px-3 py-1 rounded-full text-sm font-medium
                ${typedProduct.stock_quantity > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'}`}
            >
              {typedProduct.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <p className="text-gray-700 mb-8 leading-relaxed">{typedProduct.description}</p>

          <div className="flex items-center gap-4 mb-8">
            <AddToCartButton product={typedProduct} />
            <WishlistButton productId={typedProduct.id} />
          </div>

          {/* Reviews Section */}
          <div className="border-t pt-8">
            <Suspense fallback={<div>Loading reviews...</div>}>
              <CustomerReviews productId={typedProduct.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
