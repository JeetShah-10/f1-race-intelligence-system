-- PHASE 2: Race Data Schema
-- Tables: race_results, lap_times

-- 6. RACE RESULTS
create table if not exists public.race_results (
    result_id serial primary key,
    race_id text not null references public.races(race_id),
    driver_id text not null references public.drivers(driver_id),
    team_id text references public.teams(team_id),
    position integer,
    grid integer,
    status text,         -- "Finished", "Collision", "+1 Lap"
    points float,
    time_millis integer, -- Total race time in ms (null if DNF)
    unique(race_id, driver_id)
);

-- 7. LAP TIMES (High Volume)
create table if not exists public.lap_times (
    lap_id serial primary key,
    race_id text not null references public.races(race_id),
    driver_id text not null references public.drivers(driver_id),
    lap_number integer not null,
    lap_time_millis integer,
    sector_1_millis integer,
    sector_2_millis integer,
    sector_3_millis integer,
    compound text,       -- "SOFT", "MEDIUM", "HARD", "INTER", "WET"
    tyre_life integer,   -- Laps on current tyre
    unique(race_id, driver_id, lap_number)
);

-- Enable RLS
alter table public.race_results enable row level security;
alter table public.lap_times enable row level security;

-- Policies
create policy "Allow public read race_results" on public.race_results for select using (true);
create policy "Allow service insert race_results" on public.race_results for insert with check (true);

create policy "Allow public read lap_times" on public.lap_times for select using (true);
create policy "Allow service insert lap_times" on public.lap_times for insert with check (true);
