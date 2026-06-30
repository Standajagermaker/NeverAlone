# NeverAlone Database Design

Database: PostgreSQL on Supabase.

Core principles:

- Row Level Security enabled on user-facing tables.
- Exact user location is never exposed to other users.
- Public discovery uses approximate location and distance calculations.
- Blocking and reports must be enforced in queries.

## Tables

### profiles

Stores public and private profile data linked to Supabase Auth.

Columns:

- id uuid primary key references auth.users(id)
- display_name text not null
- birth_date date
- country_code text
- bio text
- avatar_url text
- languages text[] default '{}'
- interests text[] default '{}'
- is_verified boolean default false
- rating_avg numeric default 0
- rating_count integer default 0
- created_at timestamptz default now()
- updated_at timestamptz default now()

### user_locations

Stores the latest approximate location used for discovery.

Columns:

- user_id uuid primary key references profiles(id)
- lat numeric not null
- lng numeric not null
- geohash text
- city text
- country_code text
- updated_at timestamptz default now()

Privacy rule: never return exact coordinates directly to another user. Return distance bands or approximate coordinates only.

### activities

Predefined activity categories.

Columns:

- id uuid primary key
- key text unique not null
- label_en text not null
- icon text
- is_active boolean default true

Seed examples:

- coffee
- beer
- wine
- dinner
- museum
- beach
- hiking
- travel_partner
- nightlife

### user_availability

Stores what a user is available for right now.

Columns:

- id uuid primary key
- user_id uuid references profiles(id)
- activity_key text not null
- note text
- radius_meters integer default 2000
- expires_at timestamptz not null
- created_at timestamptz default now()

### blocks

Columns:

- blocker_id uuid references profiles(id)
- blocked_id uuid references profiles(id)
- created_at timestamptz default now()
- primary key (blocker_id, blocked_id)

### reports

Columns:

- id uuid primary key
- reporter_id uuid references profiles(id)
- reported_id uuid references profiles(id)
- reason text not null
- details text
- status text default 'open'
- created_at timestamptz default now()

### conversations

Columns:

- id uuid primary key
- created_at timestamptz default now()
- updated_at timestamptz default now()

### conversation_participants

Columns:

- conversation_id uuid references conversations(id)
- user_id uuid references profiles(id)
- created_at timestamptz default now()
- primary key (conversation_id, user_id)

### messages

Columns:

- id uuid primary key
- conversation_id uuid references conversations(id)
- sender_id uuid references profiles(id)
- body text
- image_url text
- created_at timestamptz default now()

### ai_sessions

Columns:

- id uuid primary key
- user_id uuid references profiles(id)
- title text
- created_at timestamptz default now()
- updated_at timestamptz default now()

### ai_messages

Columns:

- id uuid primary key
- session_id uuid references ai_sessions(id)
- role text not null
- content text not null
- created_at timestamptz default now()

### reviews

Columns:

- id uuid primary key
- reviewer_id uuid references profiles(id)
- reviewed_id uuid references profiles(id)
- rating integer check (rating between 1 and 5)
- would_meet_again boolean
- comment text
- created_at timestamptz default now()

## Security notes

- Users can read their own full profile.
- Users can read public profile fields of discoverable users.
- Users can update only their own profile.
- Messages are readable only by conversation participants.
- Reports are readable by reporter and admins only.
- Blocks must remove users from discovery and chat creation.
