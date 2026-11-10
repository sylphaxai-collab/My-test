'use client';

import { useState, useEffect } from 'react';
import ProductFilter from '@/components/ProductFilter';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    query: '',
    category_id: '',
    min_price: '',
    max_price: '',
    in_stock: false,
    sort: 'created_at',
    order: 'desc' as const,
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0
  });

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (response.ok) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };

    loadCategories();
  }, []);

  // Load products based on filters
  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params.append(key, String(value));
        }
      });

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products || []);
        setPagination({
          total: data.total || 0,
          totalPages: data.totalPages || 0
        });
      } else {
        throw new Error(data.error || 'Failed to fetch products');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleSortChange = (sort: string, order: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sort, order, page: 1 }));
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const renderProducts = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-soft-gray"></div>
              <div className="p-4">
                <div className="h-4 bg-soft-gray mb-2"></div>
                <div className="h-4 bg-soft-gray w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500">Error: {error}</p>
          <button
            onClick={loadProducts}
            className="mt-4 px-4 py-2 bg-soft-pink text-white rounded hover:bg-soft-pink-dark transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-navy">No products found matching your criteria.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-navy mb-8">Products</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <aside className="lg:w-1/4">
          <ProductFilter
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onSearch={handleSearch}
          />
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          {renderProducts()}

          {/* Pagination */}
          {products.length > 0 && !loading && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page <= 1}
                className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cream-dark/20"
              >
                Previous
              </button>
              
              <span className="text-navy">
                Page {filters.page} of {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= pagination.totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cream-dark/20"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
