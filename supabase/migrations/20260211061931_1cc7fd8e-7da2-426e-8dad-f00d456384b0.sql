
-- Tighten INSERT policies to only allow service role (not anon)
DROP POLICY "Service role can insert snapshots" ON public.price_snapshots;
DROP POLICY "Service role can insert notifications" ON public.deal_notifications;

-- These tables are only written to by edge functions using service role key
-- No RLS INSERT policy needed since service role bypasses RLS
-- The SELECT policies remain for user reads
