-- Create tables for Emergency Medical Portal

-- Enable RLS
create extension if not exists "uuid-ossp";

-- Hospitals table
create table if not exists hospitals (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  address text not null,
  phone text not null,
  capacity integer not null,
  current_patients integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Emergency Incidents table
create table if not exists emergency_incidents (
  id uuid default uuid_generate_v4() primary key,
  type text not null,
  location text not null,
  severity integer not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Patient Transfers table
create table if not exists patient_transfers (
  id uuid default uuid_generate_v4() primary key,
  from_hospital_id uuid references hospitals(id) not null,
  to_hospital_id uuid references hospitals(id) not null,
  patient_condition text not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table hospitals enable row level security;
alter table emergency_incidents enable row level security;
alter table patient_transfers enable row level security;

-- Create policies
create policy "Hospitals are viewable by authenticated users"
  on hospitals for select
  to authenticated
  using (true);

create policy "Hospitals are insertable by authenticated users"
  on hospitals for insert
  to authenticated
  with check (true);

create policy "Incidents are viewable by authenticated users"
  on emergency_incidents for select
  to authenticated
  using (true);

create policy "Incidents are insertable by authenticated users"
  on emergency_incidents for insert
  to authenticated
  with check (true);

create policy "Transfers are viewable by authenticated users"
  on patient_transfers for select
  to authenticated
  using (true);

create policy "Transfers are insertable by authenticated users"
  on patient_transfers for insert
  to authenticated
  with check (true);