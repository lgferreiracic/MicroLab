alter table public.role
  add constraint role_name_unique unique (name);

alter table public.users
  add column if not exists auth_uid uuid unique;

create or replace function public.current_app_user_id()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select u.user_id
  from public.users u
  where u.auth_uid = auth.uid()
  limit 1;
$$;

grant execute on function public.current_app_user_id() to authenticated;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_auth_user_created();

create function public.handle_auth_user_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  customer_role_id integer;
begin
  select role_id
    into customer_role_id
  from public.role
  where upper(name) = 'CUSTOMER'
  limit 1;

  if customer_role_id is null then
    raise exception 'Role CUSTOMER nao encontrado. Execute a seed de roles.';
  end if;

  insert into public.users (auth_uid, name, email, password_hash, role_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1), 'Usuario'),
    new.email,
    'SUPABASE_AUTH',
    customer_role_id
  )
  on conflict (email)
  do update set
    auth_uid = excluded.auth_uid,
    name = excluded.name;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_auth_user_created();

alter table public.role enable row level security;
alter table public.users enable row level security;
alter table public.address enable row level security;
alter table public.category enable row level security;
alter table public.product enable row level security;
alter table public.cart enable row level security;
alter table public.cart_item enable row level security;
alter table public.orders enable row level security;
alter table public.order_item enable row level security;
alter table public.favorite enable row level security;

drop policy if exists role_read_all on public.role;
create policy role_read_all
on public.role
for select
to authenticated
using (true);

drop policy if exists users_read_own on public.users;
create policy users_read_own
on public.users
for select
to authenticated
using (auth_uid = auth.uid());

drop policy if exists users_update_own on public.users;
create policy users_update_own
on public.users
for update
to authenticated
using (auth_uid = auth.uid())
with check (auth_uid = auth.uid());

drop policy if exists address_all_own on public.address;
create policy address_all_own
on public.address
for all
to authenticated
using (user_id = public.current_app_user_id())
with check (user_id = public.current_app_user_id());

drop policy if exists category_read_all on public.category;
create policy category_read_all
on public.category
for select
to authenticated
using (true);

drop policy if exists product_read_all on public.product;
create policy product_read_all
on public.product
for select
to authenticated
using (true);

drop policy if exists cart_all_own on public.cart;
create policy cart_all_own
on public.cart
for all
to authenticated
using (user_id = public.current_app_user_id())
with check (user_id = public.current_app_user_id());

drop policy if exists cart_item_all_own on public.cart_item;
create policy cart_item_all_own
on public.cart_item
for all
to authenticated
using (
  exists (
    select 1
    from public.cart c
    where c.cart_id = cart_item.cart_id
      and c.user_id = public.current_app_user_id()
  )
)
with check (
  exists (
    select 1
    from public.cart c
    where c.cart_id = cart_item.cart_id
      and c.user_id = public.current_app_user_id()
  )
);

drop policy if exists orders_all_own on public.orders;
create policy orders_all_own
on public.orders
for all
to authenticated
using (user_id = public.current_app_user_id())
with check (user_id = public.current_app_user_id());

drop policy if exists order_item_all_own on public.order_item;
create policy order_item_all_own
on public.order_item
for all
to authenticated
using (
  exists (
    select 1
    from public.orders o
    where o.order_id = order_item.order_id
      and o.user_id = public.current_app_user_id()
  )
)
with check (
  exists (
    select 1
    from public.orders o
    where o.order_id = order_item.order_id
      and o.user_id = public.current_app_user_id()
  )
);

drop policy if exists favorite_all_own on public.favorite;
create policy favorite_all_own
on public.favorite
for all
to authenticated
using (user_id = public.current_app_user_id())
with check (user_id = public.current_app_user_id());
