-- SAA 2025 Initial Schema

create table if not exists departments (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz default now()
);

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  department_id uuid references departments,
  role text not null default 'user' check (role in ('user', 'admin')),
  kudos_received_count int not null default 0,
  kudos_sent_count int not null default 0,
  hearts_received_count int not null default 0,
  updated_at timestamptz default now()
);

create table if not exists hashtags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz default now()
);

create table if not exists kudos (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references auth.users on delete cascade not null,
  receiver_id uuid references auth.users on delete cascade not null,
  content text not null,
  is_anonymous boolean not null default false,
  anonymous_name text,
  created_at timestamptz default now()
);

create table if not exists kudo_hashtags (
  kudo_id uuid references kudos on delete cascade,
  hashtag_id uuid references hashtags on delete cascade,
  primary key (kudo_id, hashtag_id)
);

create table if not exists kudo_images (
  id uuid primary key default gen_random_uuid(),
  kudo_id uuid references kudos on delete cascade not null,
  url text not null,
  order_index int not null default 0
);

create table if not exists kudo_hearts (
  kudo_id uuid references kudos on delete cascade,
  user_id uuid references auth.users on delete cascade,
  count int not null default 1 check (count in (1, 2)),
  created_at timestamptz default now(),
  primary key (kudo_id, user_id)
);

create table if not exists secret_boxes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  is_opened boolean not null default false,
  opened_at timestamptz,
  reward_description text,
  created_at timestamptz default now()
);

-- Auto-create profile on user signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, display_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Aggregated heart count view
create or replace view kudo_heart_counts as
  select kudo_id, coalesce(sum(count), 0) as total
  from kudo_hearts
  group by kudo_id;

-- RLS
alter table profiles enable row level security;
alter table kudos enable row level security;
alter table kudo_hearts enable row level security;
alter table secret_boxes enable row level security;

create policy "Profiles viewable by authenticated users"
  on profiles for select to authenticated using (true);

create policy "Users update own profile"
  on profiles for update to authenticated using (auth.uid() = id);

create policy "Kudos viewable by authenticated users"
  on kudos for select to authenticated using (true);

create policy "Authenticated users can insert kudos"
  on kudos for insert to authenticated with check (auth.uid() = sender_id);

create policy "Hearts viewable by authenticated users"
  on kudo_hearts for select to authenticated using (true);

create policy "Users manage own hearts"
  on kudo_hearts for all to authenticated using (auth.uid() = user_id);

create policy "Users view own secret boxes"
  on secret_boxes for select to authenticated using (auth.uid() = user_id);
