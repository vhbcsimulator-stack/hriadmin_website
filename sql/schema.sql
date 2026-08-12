-- HRI website — Supabase schema.
-- Run this once in the Supabase SQL editor (Dashboard > SQL Editor > New query).
-- Safe to re-run: every statement is idempotent.

-- ---------------------------------------------------------------------------
-- 1. Who counts as an admin
-- ---------------------------------------------------------------------------
-- Signing in is not enough to edit content. A user must also have a row here,
-- which you add by hand — so even if sign-ups are ever left open, a stranger
-- with an account still cannot write.

create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Admins may see the admin list; nobody can change it from the client.
drop policy if exists "admins readable by admins" on public.admins;
create policy "admins readable by admins"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- 2. Page content
-- ---------------------------------------------------------------------------
-- One row per editable page. `page_id` matches the *_PAGE_ID constants in
-- shared/content/*.js: home, about, projects, contact, legal, sitemap.
-- `content` holds exactly the JSON object the editor already produces, so the
-- document shape is unchanged from content/site-content.json.

create table if not exists public.site_content (
  page_id    text primary key,
  content    jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id)
);

alter table public.site_content enable row level security;

-- The public site reads with the anon key.
drop policy if exists "site content is world readable" on public.site_content;
create policy "site content is world readable"
  on public.site_content for select
  to anon, authenticated
  using (true);

-- Only admins write.
drop policy if exists "admins insert site content" on public.site_content;
create policy "admins insert site content"
  on public.site_content for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "admins update site content" on public.site_content;
create policy "admins update site content"
  on public.site_content for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins delete site content" on public.site_content;
create policy "admins delete site content"
  on public.site_content for delete
  to authenticated
  using (public.is_admin());

-- Stamp updated_at / updated_by server-side so the client cannot lie about them.
create or replace function public.touch_site_content()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch
  before insert or update on public.site_content
  for each row execute function public.touch_site_content();

-- ---------------------------------------------------------------------------
-- 3. Image storage
-- ---------------------------------------------------------------------------
-- Bucket for images uploaded from the editor. Public read so <img src> works
-- straight off the CDN; writes restricted to admins.
--
-- If this section errors with "must be owner of table objects", your project
-- does not let SQL manage storage policies — create the bucket and the four
-- equivalent policies through Dashboard > Storage > Policies instead. The rest
-- of this file will already have applied.

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do update set public = true;

drop policy if exists "site images are world readable" on storage.objects;
create policy "site images are world readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'site-images');

drop policy if exists "admins upload site images" on storage.objects;
create policy "admins upload site images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "admins update site images" on storage.objects;
create policy "admins update site images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "admins delete site images" on storage.objects;
create policy "admins delete site images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-images' and public.is_admin());

-- ---------------------------------------------------------------------------
-- 4. After running this
-- ---------------------------------------------------------------------------
-- a) Create the admin user: Dashboard > Authentication > Users > Add user
--    (set "Auto Confirm User" so no email round-trip is needed).
-- b) Grant that user admin rights — replace the address below:
--
--      insert into public.admins (user_id, email)
--      select id, email from auth.users where email = 'you@example.com'
--      on conflict (user_id) do nothing;
--
-- c) Turn off public sign-ups: Dashboard > Authentication > Sign In / Providers
--    > uncheck "Allow new users to sign up".
-- d) Load the existing content from content/site-content.json:
--
--      npm --prefix admin run seed:content
