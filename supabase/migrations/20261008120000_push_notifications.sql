-- Push notifications for the AI News page.
-- Plan and rulings: reports/2026-10-08-push-notifications-plan.md.
--
-- RLS is on and there are no policies, so the publishable key can do nothing
-- with either table. Only the service role, used by the api/ functions, reads
-- or writes them. The grants are revoked as well so that a policy added later
-- by mistake still finds nothing to open.

create table public.push_subscriptions (
  endpoint   text primary key,          -- Apple's push address for one device
  p256dh     text not null,             -- encryption key from the browser
  auth       text not null,             -- encryption secret from the browser
  origin     text not null,             -- host it was made on: production or the test subdomain
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;
revoke all on public.push_subscriptions from anon, authenticated;

-- One row per send. The primary key is the daily cap (ruling F): a second send
-- for the same UK date and host fails on insert, before anything is sent.
create table public.push_sends (
  send_date   date not null,
  origin      text not null,
  story_count integer not null,
  delivered   integer,
  removed     integer,
  failed      integer,
  sent_at     timestamptz not null default now(),
  primary key (send_date, origin)
);

alter table public.push_sends enable row level security;
revoke all on public.push_sends from anon, authenticated;
