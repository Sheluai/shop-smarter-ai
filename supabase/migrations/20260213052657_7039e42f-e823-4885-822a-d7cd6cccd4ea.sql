
-- Add missing columns to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS store text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_url text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS affiliate_url text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS coupon_code text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS coupon_expiry timestamp with time zone;
