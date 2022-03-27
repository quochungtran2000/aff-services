
create sequence role_id_seq start with 1 increment by 1 no minvalue maxvalue 9999999999
create sequence permission_id_seq start with 1 increment by 1 no minvalue maxvalue 9999999999
create sequence user_id_seq start with 1 increment by 1 no minvalue maxvalue 9999999999

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
