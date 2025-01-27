alter table "public"."profiles" alter column "full_name" set default ('User_'::text || SUBSTRING((gen_random_uuid())::text FROM 1 FOR 8));

alter table "public"."profiles" alter column "full_name" drop not null;

alter table "public"."profiles" alter column "username" set default ('user_'::text || SUBSTRING((gen_random_uuid())::text FROM 1 FOR 8));