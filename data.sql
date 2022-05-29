
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





create table product (
	product_id character varying not null,
	name character varying not null,
	slug character varying not null,
	price integer not null,
	original_url character varying not null,
	thumbnail character varying,
	is_complete_crawl boolean,
	is_complete_update boolean,
	created_at timestamp default now(),
	updated_at timestamp default now(),
	lastest_crawl_at timestamp default now(),
	sold integer default 0,
	average float,
	merchant character varying not null,
	description character varying
);	


alter table product add constraint product_pkey primary key (product_id);



create table product_variants (
	product_id character varying not null,
	sku character varying not null,
	variant_name character varying,
	variant_image_url character varying,
	list_price float not null,
	sale_price float not null,
	is_sale boolean default false,
	discount_percent float
);

alter table product_variants add constraint product_variants_pkey primary key (product_id, sku );
alter table product_variants add constraint product_variants_fkey_product foreign key (product_id) references product(product_id);


create sequence product_affiliate_id_seq start with 1 increment by 1 no minvalue maxvalue 9999999999;

create table product_affiliate_link (
	product_affiliate_link_id integer default nextval('product_affiliate_id_seq'::regClass) not null,
	campaign_id character varying,
	click_url character varying,
	merchant_id character varying,
	origin_url character varying,
	publisher_id character varying,
	short_url character varying,
	utm_campaign character varying,
	utm_content character varying,
	utm_medium character varying,
	utm_source character varying,
	utm_term character varying,
	product_id character varying
);

alter table product_affiliate_link add constraint product_affiliate_link_pkey primary key (product_affiliate_link_id);
alter table product_affiliate_link add constraint product_affiliate_link_fkey_product foreign key (product_id) references product(product_id);

create sequence prodict_image_id_seq;

create table product_image (
	id integer default nextval('product_image'::regClass),
	product_id character varying not null,
	image_url character varying not null
);

alter table product_image add constraint product_image_pkey primary key (id);
alter table product_image add constraint product_image_fkey_product foreign key (product_id) references product(product_id);

create sequence product_template_id_seq;

create table product_template (
 product_template_id int default nextval('product_template_id_seq'::regClass),
	product_name character varying not null,
	thumbnail character varying,
	product_short_name character varying,
	slug character varying,
	slug1 character varying,
	created_at timestamp default now(),
	updated_at timestamp default now()
);

alter table product_template add constraint product_template_pkey primary key(product_template_id);

create table product_product (
	product_template_id integer not null,
	product_id character varying not null	
);

alter table product_product add constraint product_product_pkey primary key (product_template_id,product_id);
alter table product_product add constraint product_product_fkey_product foreign key (product_id) references product(product_id);
alter table product_product add constraint product_product_fkey_product_template foreign key (product_template_id) references product_template(product_template_id);



create sequence product_image_id_seq start with 1 increment by 1 no minvalue maxvalue 9999999999;

create table product_variant_image (
	id integer not null default nextval('product_image_id_seq'::regClass),
	product_id character varying not null,
	sku character varying not null,
	image_url character varying
);

alter table product_variant_image add constraint product_variant_image_pkey primary key(id);
alter table product_variant_image add constraint product_variant_image_fkey_product_variants foreign key(product_id,sku) references product_variants(product_id,sku);

create sequence product_comment_id_seq start with 1 increment by 1 no minvalue maxvalue 9999999999;

create table product_comment (
	product_comment_id integer not null default nextval('product_comment_id_seq'::regClass),
	product_id character varying not null,
	customer_name character varying,
	customer_satisfaction_evel character varying,
	content character varying
);

alter table product_comment add constraint product_comment_pkey primary key(product_comment_id);
alter table product_comment add constraint product_comment_fkey_product foreign key(product_id) references product(product_id);

create sequence product_comment_image_id_seq start with 1 increment by 1 no minvalue maxvalue 9999999999;

create table product_comment_image (
	product_comment_image_id integer not null default nextval('product_comment_id_seq'::regClass),
	product_comment_id integer not null,
	image_url character varying
);

alter table product_comment_image add constraint product_comment_image_pkey primary key(product_comment_image_id);
alter table product_comment_image add constraint product_comment_image_fkey_product_comment foreign key(product_comment_id) references product_comment (product_comment_id);



alter table product add column crawl_category_id character varying;
alter table product add constraint product_fkey_crawl_category foreign key (crawl_category_id) references crawl_category(crawl_category_id);


create table user_save_product (
	product_template_id integer not null,
	user_id integer not null,
	created_at timestamp default now(),
	updated_at timestamp default now()
);

alter table user_save_product add constraint user_save_product_pkey primary key(product_template_id, user_id);
alter table user_save_product add constraint user_save_product_fkey_product_template foreign key (product_template_id) references product_template(product_template_id);
alter table user_save_product add constraint user_save_product_fkey_user foreign key (user_id) references public.user(user_id);
