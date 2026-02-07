-- PHASE 1: Historical Metadata Schema
-- Tables: seasons, circuits, drivers, teams, races

-- 1. SEASONS
create table if not exists public.seasons (
  year integer primary key,
  url text
);

-- 2. CIRCUITS
create table if not exists public.circuits (
  circuit_id text primary key, -- e.g. "monaco", "silverstone"
  name text not null,
  location text,
  country text,
  lat float,
  lng float,
  alt integer,
  url text
);

-- 3. TEAMS (Constructors)
create table if not exists public.teams (
  team_id text primary key, -- e.g. "red_bull", "ferrari"
  name text not null,
  nationality text,
  url text
);

-- 4. DRIVERS
create table if not exists public.drivers (
  driver_id text primary key, -- e.g. "max_verstappen"
  code text,                  -- "VER"
  number integer,             -- 1
  forename text not null,
  surname text not null,
  date_of_birth date,
  nationality text,
  url text
);

-- 5. RACES (Scheduled Events)
create table if not exists public.races (
  race_id text primary key,   -- e.g. "2023_1_bahrain" (Composite or Surrogate)
  year integer not null references public.seasons(year),
  round integer not null,
  circuit_id text not null references public.circuits(circuit_id),
  name text not null,
  date date not null,
  time time,
  url text,
  unique(year, round)
);

-- Enable RLS
alter table public.seasons enable row level security;
alter table public.circuits enable row level security;
alter table public.teams enable row level security;
alter table public.drivers enable row level security;
alter table public.races enable row level security;

-- Policies (Public Read, Service Write)
create policy "Allow public read seasons" on public.seasons for select using (true);
create policy "Allow service insert seasons" on public.seasons for insert with check (true);

create policy "Allow public read circuits" on public.circuits for select using (true);
create policy "Allow service insert circuits" on public.circuits for insert with check (true);

create policy "Allow public read teams" on public.teams for select using (true);
create policy "Allow service insert teams" on public.teams for insert with check (true);

create policy "Allow public read drivers" on public.drivers for select using (true);
create policy "Allow service insert drivers" on public.drivers for insert with check (true);

create policy "Allow public read races" on public.races for select using (true);
create policy "Allow service insert races" on public.races for insert with check (true);
