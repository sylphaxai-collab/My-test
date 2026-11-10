import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/lib/types';

// GET /api/products - List products with filtering, sorting, and pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Pagination
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const offset = (page - 1) * limit;

    // Search
    const query = searchParams.get('query') || '';
    
    // Filters
    const category_id = searchParams.get('category_id');
    const min_price = searchParams.get('min_price');
    const max_price = searchParams.get('max_price');
    const in_stock = searchParams.get('in_stock') === 'true';

    // Sorting
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

    // Validate sort field
    const validSortFields = ['name', 'price', 'created_at', 'updated_at'];
    const orderBy = validSortFields.includes(sort) ? sort : 'created_at';

    let baseQuery = supabase
      .from('products')
      .select(
        `
        id,
        name,
        description,
        price,
        category_id,
        image_url,
        stock_quantity,
        is_active,
        created_at,
        updated_at,
        category:categories(name)
      `,
        { count: 'exact' }
      )
      .eq('is_active', true);

    // Apply search if provided
    if (query) {
      baseQuery = baseQuery.ilike('name', `%${query}%`);
    }

    // Apply filters
    if (category_id) {
      baseQuery = baseQuery.eq('category_id', Number(category_id));
    }

    if (min_price !== null) {
      const price = parseFloat(min_price || '0');
      if (!isNaN(price) && price >= 0) {
        baseQuery = baseQuery.gte('price', price);
      }
    }

    if (max_price !== null) {
      const price = parseFloat(max_price || 'Infinity');
      if (!isNaN(price) && price > 0) {
        baseQuery = baseQuery.lte('price', price);
      }
    }

    if (in_stock) {
      baseQuery = baseQuery.gte('stock_quantity', 1);
    }

    // Apply sorting and pagination
    baseQuery = baseQuery
      .order(orderBy, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await baseQuery;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    // Transform data to match Product interface
    const products: Product[] = (data || []).map(item => ({
      ...item,
      category: item.category ? { id: item.category_id!, name: item.category.name, description: null, created_at: '', updated_at: '' } : null
    }));

    return NextResponse.json({
      products,
      total: count || 0,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/products/[id] - Get product by ID
export async function GET_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Validate ID
    const productId = parseInt(id);
    if (isNaN(productId) || productId <= 0) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('products')
      .select(
        `
        id,
        name,
        description,
        price,
        category_id,
        image_url,
        stock_quantity,
        is_active,
        created_at,
        updated_at,
        category:categories(name, description)
      `
      )
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Transform to match Product interface
    const product: Product = {
      ...data,
      category: data.category ? { 
        id: data.category_id!, 
        name: data.category.name, 
        description: data.category.description, 
        created_at: '', 
        updated_at: '' 
      } : null
    };

    return NextResponse.json(product);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle dynamic routes - this combines both /api/products and /api/products/[id]
export default async function handler(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const id = path.split('/').pop();

  // If the path ends with a number, it's a product detail request
  if (id && /^\d+$/.test(id)) {
    return GET_BY_ID(req, { params: { id } });
  }

  // Otherwise it's a list/search request
  return GET(req);
}
