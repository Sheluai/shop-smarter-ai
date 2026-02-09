
-- Make affiliate_clicks INSERT slightly more restrictive: require at least a guest_id or user_id
DROP POLICY "Anyone can insert clicks" ON public.affiliate_clicks;

CREATE POLICY "Users can insert clicks with identity"
  ON public.affiliate_clicks FOR INSERT
  WITH CHECK (user_id IS NOT NULL OR guest_id IS NOT NULL);
