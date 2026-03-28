
ALTER TABLE public.subscribers
  ADD COLUMN first_name text,
  ADD COLUMN context text,
  ADD COLUMN source text DEFAULT 'website',
  ADD COLUMN status text DEFAULT 'active';
