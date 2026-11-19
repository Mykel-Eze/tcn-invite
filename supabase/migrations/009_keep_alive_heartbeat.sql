-- Keep-alive heartbeat for the free-tier project.
-- The GitHub Actions workflow (.github/workflows/supabase-keep-alive.yml)
-- calls public.keep_alive() over the REST API so the database sees a real
-- write on a schedule, not just a tiny read.

CREATE TABLE IF NOT EXISTS public.keep_alive (
  id         smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),  -- single row
  pinged_at  timestamptz NOT NULL DEFAULT now(),
  ping_count bigint      NOT NULL DEFAULT 0
);

-- RLS on with no policies: nobody can read or write the table directly
-- through the API. The only way in is the function below.
ALTER TABLE public.keep_alive ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.keep_alive()
RETURNS timestamptz
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  INSERT INTO public.keep_alive (id, pinged_at, ping_count)
  VALUES (1, now(), 1)
  ON CONFLICT (id) DO UPDATE
    SET pinged_at  = now(),
        ping_count = public.keep_alive.ping_count + 1
  RETURNING pinged_at;
$$;

-- Only the API roles may call it. It can only touch the single heartbeat row.
REVOKE ALL ON FUNCTION public.keep_alive() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.keep_alive() TO anon, authenticated;
