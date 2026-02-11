
-- Price snapshots for tracking historical changes
CREATE TABLE public.price_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  price NUMERIC NOT NULL,
  deal_score INTEGER NOT NULL DEFAULT 0,
  snapshot_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX idx_price_snapshots_product_time ON public.price_snapshots(product_id, snapshot_at DESC);
ALTER TABLE public.price_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read price snapshots" ON public.price_snapshots FOR SELECT USING (true);
CREATE POLICY "Service role can insert snapshots" ON public.price_snapshots FOR INSERT WITH CHECK (true);

-- User saved products / followed categories
CREATE TABLE public.user_watchlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  category_id TEXT REFERENCES public.categories(category_id) ON DELETE CASCADE,
  target_price NUMERIC,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT watchlist_has_target CHECK (product_id IS NOT NULL OR category_id IS NOT NULL)
);
CREATE INDEX idx_user_watchlist_user ON public.user_watchlist(user_id, is_active);
ALTER TABLE public.user_watchlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own watchlist" ON public.user_watchlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own watchlist" ON public.user_watchlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own watchlist" ON public.user_watchlist FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own watchlist" ON public.user_watchlist FOR DELETE USING (auth.uid() = user_id);

-- Notification log for anti-spam and history
CREATE TABLE public.deal_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  deal_score INTEGER NOT NULL,
  trigger_reason TEXT NOT NULL,
  notification_title TEXT NOT NULL,
  notification_body TEXT NOT NULL,
  deep_link TEXT,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX idx_deal_notifications_user_time ON public.deal_notifications(user_id, sent_at DESC);
CREATE INDEX idx_deal_notifications_user_product ON public.deal_notifications(user_id, product_id, sent_at DESC);
ALTER TABLE public.deal_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.deal_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can insert notifications" ON public.deal_notifications FOR INSERT WITH CHECK (true);

-- User push subscription tokens
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own subscriptions" ON public.push_subscriptions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
