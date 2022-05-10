
create sequence role_id_seq start with 1 increment by 1 no minvalue maxvalue 9999999999;
create sequence permission_id_seq start with 1 increment by 1 no minvalue maxvalue 9999999999;
create sequence user_id_seq start with 1 increment by 1 no minvalue maxvalue 9999999999;
create sequence product_template_id_seq start with 1 no minvalue maxvalue 999999999 cache 1;


create table public."role" (
	role_id integer not null default nextval('role_id_seq'::regClass),
	role_name character varying not null,
	description character varying
);
alter table public."role" add constraint role_pkey primary key (role_id);

create table public."permission" (
	permission_id integer not null default nextval('permission_id_seq'::regClass),
	permission_name character varying not null
);
alter table public."permission" add constraint permission_pkey primary key (permission_id);

create table public.role_permission (
	permission_id integer not null,
	role_id integer not null
);

alter table public.role_permission add constraint role_permission_pkey primary key(permission_id , role_id);
alter table public.role_permission add constraint role_permission_fkey_permission foreign key (permission_id) references public."permission"(permission_id);
alter table public.role_permission add constraint role_permission_fkey_role foreign key (role_id) references public."role"(role_id);


create table public."user" (
	user_id integer not null default nextval('user_id_seq'::regClass),
	username character varying unique not null,
	password character varying not null,
	fullname character varying unique not null,
	email character varying unique not null,
	phone_number character varying unique not null,
	role_id integer not null,
	created_at timestamp default now(),	
	updated_at timestamp default now()
);

alter table public."user" add constraint user_pkey primary key (user_id);
alter table public."user" add constraint user_fkey_role foreign key (role_id) references public."role" (role_id);


create table product_template (
	product_template_id integer not null default nextval('product_template_id_seq'::regClass),
	product_name character varying not null,
	price integer not null,
	thumbnail character varying,
	slug character varying not null,
	created_at timestamp default now(),
	updated_at timestamp default now(),
	average integer
);

alter table product_template add constraint product_template_pkey primary key(product_template_id);

create table product_product (
	product_template_id integer not null,
	product_id character varying not null
);

alter table product_product add constraint product_product_pkey primary key (product_template_id,product_id);
alter table product_product add constraint product_product_fkey_product foreign key (product_id) references product(product_id);
alter table product_product add constraint product_product_fkey_product_template foreign key (product_template_id) references product_template(product_template_id);

create table aff_config (
	name character varying not null,
	value character varying not null,
	created_at timestamp default now(),
	updated_at timestamp default now()
);

alter table aff_config add constraint aff_config_pkey primary key (name);

create table category (
	id character varying not null, 
	merchant character varying not null,
	slug character varying not null,
	parent_id character varying,
	created_at timestamp default now(),
	updated_at timestamp default now()
);

alter table category add constraint category_pkey primary key(id);


-- Category
create table crawl_category (
	crawl_category_id character varying not null, 
	merchant character varying not null,
	title character varying not null,
	slug character varying not null,
	parent_id character varying,
	active boolean not null default false,
	crawl boolean not null default false,
	created_at timestamp default now(),
	updated_at timestamp default now()
);

alter table crawl_category add constraint crawl_category_pkey primary key(crawl_category_id);
alter table crawl_category add constraint crawl_category_fkey foreign key (parent_id) references crawl_category(crawl_category_id);


create sequence category_id_seq start with 1 increment by 1 no minvalue maxvalue 9999999999;

create table category (
	category_id integer not null default nextval('category_id_seq'::regClass), 
	title character varying not null,
	slug character varying not null,
	active boolean not null default false,
	crawl boolean not null default false,
	created_at timestamp default now(),
	updated_at timestamp default now()
);

alter table category add constraint category_pkey primary key(category_id);

create table mapping_category (
	category_id integer not null,
	crawl_category_id character varying not null
);

alter table mapping_category add constraint mapping_category_pkey primary key(category_id,crawl_category_id);
alter table mapping_category add constraint mapping_category_fkey_category foreign key(category_id) references category(category_id);
alter table mapping_category add constraint mapping_category_fkey_crawl_category foreign key(crawl_category_id) references crawl_category(crawl_category_id);

