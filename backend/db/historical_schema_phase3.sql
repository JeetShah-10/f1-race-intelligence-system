-- PHASE 3: Telemetry Schema (High Volume)
-- Tables: telemetry

-- 8. TELEMETRY
-- This table stores high-frequency data (approx 4-10Hz)
-- Partitioning is recommended for production, but standard table with indices works for MVP (~10M rows)

create table if not exists public.telemetry (
    telemetry_id serial primary key,
    race_id text not null references public.races(race_id),
    driver_id text not null references public.drivers(driver_id),
    date timestamp not null, -- Precise timestamp
    speed integer,           -- km/h
    rpm integer,
    throttle integer,        -- 0-100
    brake boolean,
    gear integer,            -- 0-8
    drs integer,             -- 0-14 (FastF1 status codes)
    
    -- Optional: Link to specific lap if needed, but timestamp is usually primary join
    lap_number integer
);

-- Indices for performance
create index if not exists idx_telemetry_race_driver on public.telemetry(race_id, driver_id);
create index if not exists idx_telemetry_date on public.telemetry(date);

-- Enable RLS
alter table public.telemetry enable row level security;

-- Policies
create policy "Allow public read telemetry" on public.telemetry for select using (true);
create policy "Allow service insert telemetry" on public.telemetry for insert with check (true);
