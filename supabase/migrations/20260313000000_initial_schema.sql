-- prmpts.io database schema (v2 — with tools layer)

-- Profiles
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Tools
create table tools (
  id text primary key,
  name text not null,
  slug text unique not null,
  type text not null check (type in ('model','app','repo','api','template','dataset','extension','script','integration','platform')),
  description text,
  url text,
  icon_url text,
  pricing_type text not null default 'free' check (pricing_type in ('free','freemium','paid','open-source')),
  technical_level text not null default 'beginner' check (technical_level in ('beginner','intermediate','advanced')),
  tags text[] default '{}',
  created_at timestamptz default now() not null
);

-- Prompts
create table prompts (
  id uuid default gen_random_uuid() primary key,
  creator_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  slug text unique not null,
  description text,
  body text not null,
  tags text[] default '{}',
  is_public boolean default true,
  copy_count int default 0,
  save_count int default 0,
  difficulty_level text not null default 'instant' check (difficulty_level in ('instant','light-setup','technical-setup')),
  execution_context text not null default 'chat-based' check (execution_context in ('chat-based','api-based','local-workflow','no-code-automation','research-stack','design-workflow','dev-workflow')),
  setup_notes text,
  prerequisites text[] default '{}',
  external_links jsonb default '[]',
  compatible_tool_ids text[] default '{}',
  required_tool_ids text[] default '{}',
  optional_tool_ids text[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Workflows
create table workflows (
  id uuid default gen_random_uuid() primary key,
  creator_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  slug text unique not null,
  description text,
  tags text[] default '{}',
  is_public boolean default true,
  save_count int default 0,
  difficulty_level text not null default 'instant' check (difficulty_level in ('instant','light-setup','technical-setup')),
  execution_context text not null default 'chat-based' check (execution_context in ('chat-based','api-based','local-workflow','no-code-automation','research-stack','design-workflow','dev-workflow')),
  setup_notes text,
  prerequisites text[] default '{}',
  external_links jsonb default '[]',
  compatible_tool_ids text[] default '{}',
  required_tool_ids text[] default '{}',
  optional_tool_ids text[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Workflow steps
create table workflow_steps (
  id uuid default gen_random_uuid() primary key,
  workflow_id uuid references workflows(id) on delete cascade not null,
  title text not null,
  body text not null,
  notes text,
  tool_id text references tools(id) on delete set null,
  position int not null,
  created_at timestamptz default now() not null
);

-- Saves (bookmarks)
create table saves (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  prompt_id uuid references prompts(id) on delete cascade,
  workflow_id uuid references workflows(id) on delete cascade,
  created_at timestamptz default now() not null,
  constraint saves_one_type check (
    (prompt_id is not null and workflow_id is null) or
    (prompt_id is null and workflow_id is not null)
  ),
  unique(user_id, prompt_id),
  unique(user_id, workflow_id)
);

-- Copy events (analytics)
create table copy_events (
  id uuid default gen_random_uuid() primary key,
  prompt_id uuid references prompts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete set null,
  created_at timestamptz default now() not null
);

-- Indexes
create index tools_type_idx on tools(type);
create index tools_slug_idx on tools(slug);

create index prompts_creator_id_idx on prompts(creator_id);
create index prompts_created_at_idx on prompts(created_at desc);
create index prompts_tags_idx on prompts using gin(tags);
create index prompts_compatible_tools_idx on prompts using gin(compatible_tool_ids);
create index prompts_difficulty_idx on prompts(difficulty_level);
create index prompts_context_idx on prompts(execution_context);
create index prompts_search_idx on prompts using gin(
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(body, ''))
);

create index workflows_creator_id_idx on workflows(creator_id);
create index workflows_created_at_idx on workflows(created_at desc);
create index workflows_tags_idx on workflows using gin(tags);
create index workflows_compatible_tools_idx on workflows using gin(compatible_tool_ids);
create index workflows_difficulty_idx on workflows(difficulty_level);
create index workflows_context_idx on workflows(execution_context);
create index workflows_search_idx on workflows using gin(
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
);

create index workflow_steps_workflow_id_idx on workflow_steps(workflow_id);
create index workflow_steps_tool_id_idx on workflow_steps(tool_id);
create index saves_user_id_idx on saves(user_id);

-- Trigger functions
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function handle_save_count()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    if new.prompt_id is not null then
      update prompts set save_count = save_count + 1 where id = new.prompt_id;
    elsif new.workflow_id is not null then
      update workflows set save_count = save_count + 1 where id = new.workflow_id;
    end if;
  elsif tg_op = 'DELETE' then
    if old.prompt_id is not null then
      update prompts set save_count = save_count - 1 where id = old.prompt_id;
    elsif old.workflow_id is not null then
      update workflows set save_count = save_count - 1 where id = old.workflow_id;
    end if;
  end if;
  return coalesce(new, old);
end;
$$ language plpgsql;

create or replace function handle_copy_count()
returns trigger as $$
begin
  update prompts set copy_count = copy_count + 1 where id = new.prompt_id;
  return new;
end;
$$ language plpgsql;

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'preferred_username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql;

-- Triggers
create trigger on_prompts_updated
  before update on prompts
  for each row execute function handle_updated_at();

create trigger on_workflows_updated
  before update on workflows
  for each row execute function handle_updated_at();

create trigger on_profiles_updated
  before update on profiles
  for each row execute function handle_updated_at();

create trigger on_save_changed
  after insert or delete on saves
  for each row execute function handle_save_count();

create trigger on_copy_event
  after insert on copy_events
  for each row execute function handle_copy_count();

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- RLS policies
alter table profiles enable row level security;
alter table tools enable row level security;
alter table prompts enable row level security;
alter table workflows enable row level security;
alter table workflow_steps enable row level security;
alter table saves enable row level security;
alter table copy_events enable row level security;

-- Tools: public read
create policy "Public tools" on tools for select using (true);

-- Profiles: public read, own write
create policy "Public profiles" on profiles for select using (true);
create policy "Own profile update" on profiles for update using (auth.uid() = id);

-- Prompts: public read for public prompts, own prompts for creator
create policy "Public prompts read" on prompts for select using (is_public = true or creator_id = auth.uid());
create policy "Own prompts insert" on prompts for insert with check (creator_id = auth.uid());
create policy "Own prompts update" on prompts for update using (creator_id = auth.uid());
create policy "Own prompts delete" on prompts for delete using (creator_id = auth.uid());

-- Workflows: public read for public workflows, own workflows for creator
create policy "Public workflows read" on workflows for select using (is_public = true or creator_id = auth.uid());
create policy "Own workflows insert" on workflows for insert with check (creator_id = auth.uid());
create policy "Own workflows update" on workflows for update using (creator_id = auth.uid());
create policy "Own workflows delete" on workflows for delete using (creator_id = auth.uid());

-- Workflow steps: follow parent workflow visibility
create policy "Steps read" on workflow_steps for select using (
  exists (select 1 from workflows where workflows.id = workflow_steps.workflow_id and (workflows.is_public = true or workflows.creator_id = auth.uid()))
);
create policy "Steps insert" on workflow_steps for insert with check (
  exists (select 1 from workflows where workflows.id = workflow_steps.workflow_id and workflows.creator_id = auth.uid())
);
create policy "Steps update" on workflow_steps for update using (
  exists (select 1 from workflows where workflows.id = workflow_steps.workflow_id and workflows.creator_id = auth.uid())
);
create policy "Steps delete" on workflow_steps for delete using (
  exists (select 1 from workflows where workflows.id = workflow_steps.workflow_id and workflows.creator_id = auth.uid())
);

-- Saves: own saves only
create policy "Own saves read" on saves for select using (user_id = auth.uid());
create policy "Own saves insert" on saves for insert with check (user_id = auth.uid());
create policy "Own saves delete" on saves for delete using (user_id = auth.uid());

-- Copy events: anyone can insert
create policy "Copy events insert" on copy_events for insert with check (true);
create policy "Copy events read" on copy_events for select using (user_id = auth.uid());

-- Search function (v2 — includes tooling metadata)
create or replace function search_content(
  search_query text default '',
  content_type text default 'all',
  result_limit int default 20,
  result_offset int default 0
)
returns table (
  id uuid,
  type text,
  title text,
  slug text,
  description text,
  tags text[],
  creator_username text,
  creator_display_name text,
  creator_avatar_url text,
  copy_count int,
  save_count int,
  difficulty_level text,
  execution_context text,
  compatible_tool_ids text[],
  created_at timestamptz
) language plpgsql as $$
begin
  return query
  with combined as (
    select
      p.id,
      'prompt'::text as type,
      p.title,
      p.slug,
      p.description,
      p.tags,
      pr.username as creator_username,
      pr.display_name as creator_display_name,
      pr.avatar_url as creator_avatar_url,
      p.copy_count,
      p.save_count,
      p.difficulty_level,
      p.execution_context,
      p.compatible_tool_ids,
      p.created_at,
      case when search_query != '' then
        ts_rank(to_tsvector('english', coalesce(p.title, '') || ' ' || coalesce(p.description, '') || ' ' || coalesce(p.body, '')), plainto_tsquery('english', search_query))
      else 0 end as rank
    from prompts p
    join profiles pr on pr.id = p.creator_id
    where p.is_public = true
      and (content_type = 'all' or content_type = 'prompts')
      and (search_query = '' or to_tsvector('english', coalesce(p.title, '') || ' ' || coalesce(p.description, '') || ' ' || coalesce(p.body, '')) @@ plainto_tsquery('english', search_query))

    union all

    select
      w.id,
      'workflow'::text as type,
      w.title,
      w.slug,
      w.description,
      w.tags,
      pr.username as creator_username,
      pr.display_name as creator_display_name,
      pr.avatar_url as creator_avatar_url,
      0 as copy_count,
      w.save_count,
      w.difficulty_level,
      w.execution_context,
      w.compatible_tool_ids,
      w.created_at,
      case when search_query != '' then
        ts_rank(to_tsvector('english', coalesce(w.title, '') || ' ' || coalesce(w.description, '')), plainto_tsquery('english', search_query))
      else 0 end as rank
    from workflows w
    join profiles pr on pr.id = w.creator_id
    where w.is_public = true
      and (content_type = 'all' or content_type = 'workflows')
      and (search_query = '' or to_tsvector('english', coalesce(w.title, '') || ' ' || coalesce(w.description, '')) @@ plainto_tsquery('english', search_query))
  )
  select
    combined.id,
    combined.type,
    combined.title,
    combined.slug,
    combined.description,
    combined.tags,
    combined.creator_username,
    combined.creator_display_name,
    combined.creator_avatar_url,
    combined.copy_count,
    combined.save_count,
    combined.difficulty_level,
    combined.execution_context,
    combined.compatible_tool_ids,
    combined.created_at
  from combined
  order by
    case when search_query != '' then combined.rank else 0 end desc,
    combined.created_at desc
  limit result_limit
  offset result_offset;
end;
$$;

-- Seed tools
insert into tools (id, name, slug, type, description, url, pricing_type, technical_level, tags) values
('t-chatgpt', 'ChatGPT', 'chatgpt', 'model', 'OpenAI''s conversational AI assistant. Supports GPT-4o and GPT-4.1 models.', 'https://chat.openai.com', 'freemium', 'beginner', '{"ai","chat","openai"}'),
('t-claude', 'Claude', 'claude', 'model', 'Anthropic''s AI assistant. Known for nuance, safety, and long-context capability.', 'https://claude.ai', 'freemium', 'beginner', '{"ai","chat","anthropic"}'),
('t-perplexity', 'Perplexity', 'perplexity', 'app', 'AI-powered research and search engine with source citations.', 'https://perplexity.ai', 'freemium', 'beginner', '{"ai","search","research"}'),
('t-cursor', 'Cursor', 'cursor', 'app', 'AI-native code editor built on VS Code. Inline code generation and editing.', 'https://cursor.com', 'freemium', 'intermediate', '{"ai","coding","editor"}'),
('t-notion', 'Notion', 'notion', 'platform', 'All-in-one workspace for notes, docs, databases, and project management.', 'https://notion.so', 'freemium', 'beginner', '{"productivity","docs","database"}'),
('t-midjourney', 'Midjourney', 'midjourney', 'model', 'AI image generation via Discord or web. Known for artistic, high-quality outputs.', 'https://midjourney.com', 'paid', 'beginner', '{"ai","image","design"}'),
('t-n8n', 'n8n', 'n8n', 'integration', 'Open-source workflow automation tool. Connect APIs, services, and AI models.', 'https://n8n.io', 'open-source', 'intermediate', '{"automation","integration","workflow"}'),
('t-zapier', 'Zapier', 'zapier', 'integration', 'No-code automation platform connecting 6,000+ apps.', 'https://zapier.com', 'freemium', 'beginner', '{"automation","no-code","integration"}'),
('t-github', 'GitHub', 'github', 'platform', 'Code hosting, version control, and collaboration platform.', 'https://github.com', 'freemium', 'intermediate', '{"coding","git","collaboration"}'),
('t-gsheets', 'Google Sheets', 'google-sheets', 'template', 'Cloud spreadsheet for data, tracking, and lightweight databases.', 'https://sheets.google.com', 'free', 'beginner', '{"spreadsheet","data","google"}'),
('t-python', 'Python', 'python', 'script', 'General-purpose programming language. Used for AI/ML, scripting, and automation.', 'https://python.org', 'free', 'intermediate', '{"coding","scripting","ai"}'),
('t-airtable', 'Airtable', 'airtable', 'platform', 'Spreadsheet-database hybrid for structured data and workflows.', 'https://airtable.com', 'freemium', 'beginner', '{"database","no-code","productivity"}');
