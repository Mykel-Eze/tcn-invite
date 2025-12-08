-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Users)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text default 'inviter' check (role in ('inviter', 'admin', 'pcu_host')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CAMPUSES
create table campuses (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  address text not null,
  service_times text[] not null,
  country text default 'Nigeria',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INVITATIONS
create table invitations (
  id uuid default uuid_generate_v4() primary key,
  inviter_id uuid references profiles(id) not null,
  guest_name text not null,
  guest_phone text not null,
  campus_id uuid references campuses(id) not null,
  flyer_design_id text not null,
  qr_code_value uuid default uuid_generate_v4() not null unique,
  status text default 'sent' check (status in ('sent', 'attended')),
  delivery_method text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  attended_at timestamp with time zone
);

-- RLS POLICIES
alter table profiles enable row level security;
alter table campuses enable row level security;
alter table invitations enable row level security;

-- Profiles: Public read (for now), Self update
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);

-- Campuses: Public read, Admin write
create policy "Campuses are viewable by everyone." on campuses for select using (true);

-- Invitations: Inviters can see their own, Admins/PCU can see all
create policy "Inviters can view own invitations." on invitations for select using (auth.uid() = inviter_id);
create policy "Inviters can insert own invitations." on invitations for insert with check (auth.uid() = inviter_id);

-- SEED DATA
insert into campuses (name, address, service_times) values
('TCN Ikeja', '123 Allen Avenue, Ikeja, Lagos', ARRAY['9:00 AM', '11:00 AM']),
('TCN Lekki', 'Admiralty Way, Lekki Phase 1, Lagos', ARRAY['10:00 AM']),
('TCN Abuja', 'Central Business District, Abuja', ARRAY['9:00 AM', '11:00 AM']);
