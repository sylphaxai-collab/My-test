'use client';

import React from 'react';

interface ProductFilterProps {
  categories: { id: number; name: string }[];
  filters: {
    query: string;
    category_id: string;
    min_price: string;
    max_price: string;
    in_stock: boolean;
    sort: string;
    order: 'asc' | 'desc';
  };
  onFilterChange: (filters: Partial<ProductFilterProps['filters']>) => void;
  onSortChange: (sort: string, order: 'asc' | 'desc') => void;
  onSearch: (query: string) => void;
}

export default function ProductFilter({
  categories,
  filters,
  onFilterChange,
  onSortChange,
  onSearch
}: ProductFilterProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ category_id: e.target.value });
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ min_price: e.target.value });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ max_price: e.target.value });
  };

  const handleInStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ in_stock: e.target.checked });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const [sort, order] = value.split('-');
    onSortChange(sort, order as 'asc' | 'desc');
  };

  return (
    <div className="bg-cream p-6 rounded-lg shadow-md space-y-6">
      {/* Search */}
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-navy mb-2">
          Search Products
        </label>
        <input
          type="text"
          id="search"
          value={filters.query}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="w-full px-3 py-2 border border-soft-pink-dark rounded-md focus:outline-none focus:ring-2 focus:ring-soft-pink-dark/50"
        />
      </div>

      {/* Category Filter */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-navy mb-2">
          Category
        </label>
        <select
          id="category"
          value={filters.category_id}
          onChange={handleCategoryChange}
          className="w-full px-3 py-2 border border-soft-pink-dark rounded-md focus:outline-none focus:ring-2 focus:ring-soft-pink-dark/50"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.min_price}
            onChange={handleMinPriceChange}
            min="0"
            step="0.01"
            className="px-3 py-2 border border-soft-pink-dark rounded-md focus:outline-none focus:ring-2 focus:ring-soft-pink-dark/50"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.max_price}
            onChange={handleMaxPriceChange}
            min="0"
            step="0.01"
            className="px-3 py-2 border border-soft-pink-dark rounded-md focus:outline-none focus:ring-2 focus:ring-soft-pink-dark/50"
          />
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.in_stock}
            onChange={handleInStockChange}
            className="rounded border-soft-pink-dark text-soft-pink-dark focus:ring-soft-pink-dark"
          />
          <span className="ml-2 text-sm text-navy">In Stock Only</span>
        </label>
      </div>

      {/* Sort */}
      <div>
        <label htmlFor="sort" className="block text-sm font-medium text-navy mb-2">
          Sort By
        </label>
        <select
          id="sort"
          value={`${filters.sort}-${filters.order}`}
          onChange={handleSortChange}
          className="w-full px-3 py-2 border border-soft-pink-dark rounded-md focus:outline-none focus:ring-2 focus:ring-soft-pink-dark/50"
        >
          <option value="created_at-desc">Newest</option>
          <option value="created_at-asc">Oldest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>
    </div>
  );
}
