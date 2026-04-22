-- UNITED Real Estate — Supabase Schema
-- Run this in your Supabase SQL editor

-- ──────────────────────────────────────────
-- LISTINGS (new developer units)
-- ──────────────────────────────────────────
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ar text not null,
  description_en text,
  description_ar text,
  price numeric default 0,
  down_payment numeric,
  monthly_payment numeric,
  annual_payment numeric,
  area_sqm numeric default 0,
  bedrooms integer,
  bathrooms integer,
  unit_type text,
  finishing text,
  delivery_year integer,
  compound_name text,
  region text,
  area text,
  neighborhood text,
  images text[] default '{}',
  show_price boolean default true,
  show_downpayment boolean default true,
  show_monthly boolean default true,
  show_full_price boolean default false,
  is_featured boolean default false,
  whatsapp_number text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ──────────────────────────────────────────
-- RESALE UNITS
-- ──────────────────────────────────────────
create table if not exists resale_units (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ar text not null,
  description_en text,
  description_ar text,
  price numeric default 0,
  area_sqm numeric default 0,
  bedrooms integer,
  bathrooms integer,
  unit_type text,
  finishing text,
  compound_name text,
  region text,
  area text,
  images text[] default '{}',
  owner_name text,
  show_price boolean default true,
  is_featured boolean default false,
  whatsapp_number text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ──────────────────────────────────────────
-- MEDIA VIDEOS
-- ──────────────────────────────────────────
create table if not exists media_videos (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ar text not null,
  platform text not null check (platform in ('youtube','instagram','facebook','tiktok')),
  video_url text not null,
  embed_id text,
  thumbnail_url text,
  is_featured boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ──────────────────────────────────────────
-- LOCATIONS hierarchy
-- ──────────────────────────────────────────
create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ar text not null,
  slug text unique not null,
  level integer not null, -- 1=region, 2=city, 3=area, 4=compound
  parent_id uuid references locations(id),
  image_url text,
  created_at timestamptz default now()
);

-- ──────────────────────────────────────────
-- LEADS (inquiry tracking)
-- ──────────────────────────────────────────
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid,
  listing_type text, -- 'new' or 'resale'
  name text,
  phone text,
  message text,
  source text default 'whatsapp',
  created_at timestamptz default now()
);

-- ──────────────────────────────────────────
-- Row Level Security (public read, authenticated write)
-- ──────────────────────────────────────────
alter table listings enable row level security;
alter table resale_units enable row level security;
alter table media_videos enable row level security;
alter table locations enable row level security;
alter table leads enable row level security;

-- Public can read all
create policy "Public read listings" on listings for select using (true);
create policy "Public read resale" on resale_units for select using (true);
create policy "Public read videos" on media_videos for select using (true);
create policy "Public read locations" on locations for select using (true);

-- Authenticated users (admin) can do everything
create policy "Admin full access listings" on listings for all using (auth.role() = 'authenticated');
create policy "Admin full access resale" on resale_units for all using (auth.role() = 'authenticated');
create policy "Admin full access videos" on media_videos for all using (auth.role() = 'authenticated');
create policy "Admin full access locations" on locations for all using (auth.role() = 'authenticated');
create policy "Admin full access leads" on leads for all using (auth.role() = 'authenticated');

-- ──────────────────────────────────────────
-- Seed: example locations
-- ──────────────────────────────────────────
insert into locations (name_en, name_ar, slug, level) values
  ('New Capital', 'العاصمة الإدارية', 'new-capital', 1),
  ('New Cairo', 'القاهرة الجديدة', 'new-cairo', 1),
  ('North Coast', 'الساحل الشمالي', 'north-coast', 1),
  ('Sheikh Zayed', 'الشيخ زايد', 'sheikh-zayed', 1),
  ('6th of October', 'السادس من أكتوبر', '6th-october', 1),
  ('El Alamein', 'العلمين', 'el-alamein', 1)
on conflict (slug) do nothing;
