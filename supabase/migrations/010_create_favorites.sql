create table if not exists public.favorite (
  user_id integer not null,
  product_id integer not null,
  primary key (user_id, product_id),
  constraint fk_favorite_user
    foreign key (user_id)
    references public.users(user_id)
    on update cascade
    on delete cascade,
  constraint fk_favorite_product
    foreign key (product_id)
    references public.product(product_id)
    on update cascade
    on delete cascade
);
