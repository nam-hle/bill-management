create type "public"."MembershipStatus" as enum ('Idle', 'Active', 'Requesting', 'Inviting');

create table "public"."groups" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "display_id" text not null
);


alter table "public"."groups" enable row level security;

create table "public"."memberships" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "group_id" uuid not null,
    "status" "MembershipStatus" not null default 'Idle'::"MembershipStatus"
);


alter table "public"."memberships" enable row level security;

alter table "public"."bank_accounts" drop column "provider_name";

alter table "public"."bank_accounts" alter column "provider_number" set data type text using "provider_number"::text;

alter table "public"."bank_accounts" alter column "type" set default 'Bank'::"BankAccountType";

alter table "public"."profiles" add column "selected_group_id" uuid;

CREATE UNIQUE INDEX groups_display_id_key ON public.groups USING btree (display_id);

CREATE UNIQUE INDEX groups_pkey ON public.groups USING btree (id);

CREATE UNIQUE INDEX memberships_group_user_unique ON public.memberships USING btree (group_id, user_id);

CREATE INDEX user_names_to_tsvector_idx ON public.profiles USING gin (to_tsvector('english'::regconfig, 'full_name'::text));

CREATE UNIQUE INDEX users_groups_pkey ON public.memberships USING btree (id);

alter table "public"."groups" add constraint "groups_pkey" PRIMARY KEY using index "groups_pkey";

alter table "public"."memberships" add constraint "users_groups_pkey" PRIMARY KEY using index "users_groups_pkey";

alter table "public"."groups" add constraint "groups_display_id_check" CHECK ((length(display_id) = 8)) not valid;

alter table "public"."groups" validate constraint "groups_display_id_check";

alter table "public"."groups" add constraint "groups_display_id_key" UNIQUE using index "groups_display_id_key";

alter table "public"."memberships" add constraint "memberships_group_user_unique" UNIQUE using index "memberships_group_user_unique";

alter table "public"."memberships" add constraint "users_groups_group_id_fkey" FOREIGN KEY (group_id) REFERENCES groups(id) not valid;

alter table "public"."memberships" validate constraint "users_groups_group_id_fkey";

alter table "public"."memberships" add constraint "users_groups_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."memberships" validate constraint "users_groups_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_selected_group_id_fkey" FOREIGN KEY (selected_group_id) REFERENCES groups(id) ON DELETE SET NULL not valid;

alter table "public"."profiles" validate constraint "profiles_selected_group_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$begin
  insert into public.profiles (id, full_name)
  values (new.id,new.raw_user_meta_data->>'full_name' );
  return new;
end;$function$
;

grant delete on table "public"."groups" to "anon";

grant insert on table "public"."groups" to "anon";

grant references on table "public"."groups" to "anon";

grant select on table "public"."groups" to "anon";

grant trigger on table "public"."groups" to "anon";

grant truncate on table "public"."groups" to "anon";

grant update on table "public"."groups" to "anon";

grant delete on table "public"."groups" to "authenticated";

grant insert on table "public"."groups" to "authenticated";

grant references on table "public"."groups" to "authenticated";

grant select on table "public"."groups" to "authenticated";

grant trigger on table "public"."groups" to "authenticated";

grant truncate on table "public"."groups" to "authenticated";

grant update on table "public"."groups" to "authenticated";

grant delete on table "public"."groups" to "service_role";

grant insert on table "public"."groups" to "service_role";

grant references on table "public"."groups" to "service_role";

grant select on table "public"."groups" to "service_role";

grant trigger on table "public"."groups" to "service_role";

grant truncate on table "public"."groups" to "service_role";

grant update on table "public"."groups" to "service_role";

grant delete on table "public"."memberships" to "anon";

grant insert on table "public"."memberships" to "anon";

grant references on table "public"."memberships" to "anon";

grant select on table "public"."memberships" to "anon";

grant trigger on table "public"."memberships" to "anon";

grant truncate on table "public"."memberships" to "anon";

grant update on table "public"."memberships" to "anon";

grant delete on table "public"."memberships" to "authenticated";

grant insert on table "public"."memberships" to "authenticated";

grant references on table "public"."memberships" to "authenticated";

grant select on table "public"."memberships" to "authenticated";

grant trigger on table "public"."memberships" to "authenticated";

grant truncate on table "public"."memberships" to "authenticated";

grant update on table "public"."memberships" to "authenticated";

grant delete on table "public"."memberships" to "service_role";

grant insert on table "public"."memberships" to "service_role";

grant references on table "public"."memberships" to "service_role";

grant select on table "public"."memberships" to "service_role";

grant trigger on table "public"."memberships" to "service_role";

grant truncate on table "public"."memberships" to "service_role";

grant update on table "public"."memberships" to "service_role";

create policy "Allow all"
on "public"."groups"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow all"
on "public"."memberships"
as permissive
for all
to public
using (true);



