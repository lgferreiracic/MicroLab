insert into public.role (name)
values ('ADMIN'), ('CUSTOMER')
on conflict (name) do nothing;
