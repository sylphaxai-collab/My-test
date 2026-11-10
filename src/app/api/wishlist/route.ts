import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('wishlist_items')
      .select('product_id')
      .eq('user_id', session.user.id);

    if (error) throw error;

    return NextResponse.json({ product_ids: data.map(item => item.product_id) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { product_id } = await request.json();

    if (!product_id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Check if product exists and is active
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, is_active')
      .eq('id', product_id)
      .single();

    if (productError || !product || !product.is_active) {
      return NextResponse.json({ error: 'Product not found or inactive' }, { status: 404 });
    }

    // Check if already in wishlist
    const { data: existing } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('product_id', product_id)
      .single();

    if (existing) {
      // Remove from wishlist
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', session.user.id)
        .eq('product_id', product_id);

      if (error) throw error;

      return NextResponse.json({ in_wishlist: false });
    } else {
      // Add to wishlist
      const { error } = await supabase
        .from('wishlist_items')
        .insert({
          user_id: session.user.id,
          product_id: product_id
        });

      if (error) throw error;

      return NextResponse.json({ in_wishlist: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { product_id } = await request.json();

    if (!product_id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Check if product exists and is active
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, is_active')
      .eq('id', product_id)
      .single();

    if (productError || !product || !product.is_active) {
      return NextResponse.json({ error: 'Product not found or inactive' }, { status: 404 });
    }

    // Check if item is in wishlist
    const { data: existing, error: wishlistError } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('product_id', product_id)
      .single();

    if (wishlistError || !existing) {
      return NextResponse.json({ error: 'Item not in wishlist' }, { status: 404 });
    }

    // Delete the wishlist item
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', session.user.id)
      .eq('product_id', product_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
