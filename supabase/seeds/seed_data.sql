-- Seed data for e-commerce testing

-- Clear existing seed data if re-running
delete from public.order_items;
delete from public.orders;
delete from public.user_profiles;
delete from public.coupons;
delete from public.products;
delete from public.categories;
delete from public.profiles where id in (
  'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',
  'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2',
  'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3'
);

-- Insert test categories
insert into public.categories (name, description)
values
  ('Electronics', 'Latest gadgets and electronic devices'),
  ('Clothing', 'Trendy apparel and fashion wear'),
  ('Home & Kitchen', 'Essential home and kitchen products');

-- Insert test products
insert into public.products (name, description, price, category_id, image_url, stock_quantity, is_active)
values
  ('Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 199.99, 1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 50, true),
  ('Smart Watch', 'Feature-rich smartwatch with health tracking', 299.99, 1, 'https://images.unsplash.com/photo-1523275335378-d949b5980b53?w=600', 30, true),
  ('Cotton T-Shirt', 'Comfortable 100% cotton t-shirt available in multiple colors', 19.99, 2, 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600', 100, true),
  ('Leather Jacket', 'Genuine leather jacket with modern design', 199.99, 2, 'https://images.unsplash.com/photo-1551028704-4d35815b4b8b?w=600', 20, true),
  ('Blender', 'High-speed blender for smoothies and food processing', 89.99, 3, 'https://images.unsplash.com/photo-1519970426027-5465074383aa?w=600', 15, true);

-- Insert test coupons
insert into public.coupons (code, discount_type, discount_value, min_purchase_amount, max_discount_amount, usage_limit, used_count, is_active, valid_from, valid_until)
values
  ('SUMMER20', 'percentage', 20, 50, null, 100, 0, true, now() - interval '1 day', now() + interval '30 days'),
  ('SAVE50', 'fixed_amount', 50, 100, 50, 50, 0, true, now() - interval '1 day', now() + interval '30 days');

-- Insert test users with profiles
-- Admin user
insert into auth.users (id, email, encrypted_password, email_confirmed_at)
values
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'admin@shop.com', crypt('admin-pass', gen_salt('bf')), now());

insert into public.profiles (id, email, full_name, role)
values
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'admin@shop.com', 'Admin User', 'admin');

-- Customer users
insert into auth.users (id, email, encrypted_password, email_confirmed_at)
values
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'customer1@shop.com', crypt('customer-pass', gen_salt('bf')), now()),
  ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'customer2@shop.com', crypt('customer-pass', gen_salt('bf')), now());

insert into public.profiles (id, email, full_name, role)
values
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'customer1@shop.com', 'Customer One', 'customer'),
  ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'customer2@shop.com', 'Customer Two', 'customer');

-- Create user_profiles entries
insert into public.user_profiles (id, user_id, default_shipping_address, phone)
values
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', '123 Main St, City, Country', '+1234567890'),
  ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', '456 Oak Ave, Town, Country', '+0987654321');

-- Insert test orders
insert into public.orders (user_id, total_amount, status, shipping_address, created_at)
values
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 219.98, 'completed', '123 Main St, City, Country', now() - interval '5 days'),
  ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 109.99, 'shipped', '456 Oak Ave, Town, Country', now() - interval '3 days');

-- Insert order items
insert into public.order_items (order_id, product_id, quantity, price_per_unit)
values
  (1, 3, 1, 19.99),  -- T-Shirt
  (1, 1, 1, 199.99), -- Headphones
  (2, 5, 1, 89.99);   -- Blender
