-- Karibu Assalam booking automation schema.
-- Run this in the Supabase SQL editor after creating the project.

create table if not exists public.staff_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'staff' check (role in ('admin', 'manager', 'staff')),
  created_at timestamptz not null default now()
);

create table if not exists public.booking_requests (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'new' check (
    status in ('new', 'contacted', 'quoted', 'deposit-pending', 'confirmed', 'cancelled')
  ),
  booking_type text not null,
  retreat_slug text,
  retreat_title text,
  room_type text,
  arrival_date date,
  departure_date date,
  adults integer not null default 1 check (adults >= 1),
  children integer not null default 0 check (children >= 0),
  guests integer not null default 1 check (guests >= 1),
  guest_language text not null default 'en',
  preferred_contact text not null default 'whatsapp',
  airport_pickup boolean not null default false,
  name text not null,
  email text not null,
  phone text not null,
  country text,
  dietary_needs text,
  message text,
  source text not null default 'website',
  priority text not null default 'normal' check (priority in ('normal', 'medium', 'high')),
  score integer not null default 0 check (score >= 0),
  timing text,
  nights integer,
  rooms_needed integer not null default 1 check (rooms_needed >= 1),
  automation_summary text,
  next_action text,
  reply_draft text
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_booking_requests_updated_at on public.booking_requests;
create trigger set_booking_requests_updated_at
before update on public.booking_requests
for each row
execute function public.set_updated_at();

alter table public.staff_profiles enable row level security;
alter table public.booking_requests enable row level security;

grant select on public.staff_profiles to authenticated;
grant insert on public.booking_requests to anon, authenticated;
grant select, update, delete on public.booking_requests to authenticated;

drop policy if exists "Staff can read their own staff profile" on public.staff_profiles;
create policy "Staff can read their own staff profile"
on public.staff_profiles
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Guests can create booking requests" on public.booking_requests;
create policy "Guests can create booking requests"
on public.booking_requests
for insert
to anon, authenticated
with check (status = 'new');

drop policy if exists "Staff can read booking requests" on public.booking_requests;
create policy "Staff can read booking requests"
on public.booking_requests
for select
to authenticated
using (
  exists (
    select 1
    from public.staff_profiles staff
    where staff.user_id = (select auth.uid())
  )
);

drop policy if exists "Staff can update booking requests" on public.booking_requests;
create policy "Staff can update booking requests"
on public.booking_requests
for update
to authenticated
using (
  exists (
    select 1
    from public.staff_profiles staff
    where staff.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.staff_profiles staff
    where staff.user_id = (select auth.uid())
  )
);

drop policy if exists "Staff can delete booking requests" on public.booking_requests;
create policy "Staff can delete booking requests"
on public.booking_requests
for delete
to authenticated
using (
  exists (
    select 1
    from public.staff_profiles staff
    where staff.user_id = (select auth.uid())
  )
);

-- After creating a staff user in Supabase Auth, add them with:
-- insert into public.staff_profiles (user_id, full_name, role)
-- values ('AUTH_USER_ID_HERE', 'Staff Name', 'admin');
