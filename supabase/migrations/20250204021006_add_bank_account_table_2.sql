create type "public"."BankAccountStatus" as enum ('Active', 'Inactive');

create type "public"."BankAccountType" as enum ('Bank', 'Wallet');

create table "public"."bank_accounts" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "type" "BankAccountType" not null,
    "provider_name" text not null,
    "provider_number" bigint not null,
    "account_number" text not null,
    "account_holder" text not null,
    "is_default" boolean not null default false,
    "status" "BankAccountStatus" not null default 'Active'::"BankAccountStatus"
);


alter table "public"."bank_accounts" enable row level security;

CREATE UNIQUE INDEX bank_accounts_pkey ON public.bank_accounts USING btree (id);

CREATE UNIQUE INDEX unique_default_account ON public.bank_accounts USING btree (user_id) WHERE (is_default = true);

alter table "public"."bank_accounts" add constraint "bank_accounts_pkey" PRIMARY KEY using index "bank_accounts_pkey";

alter table "public"."bank_accounts" add constraint "bank_accounts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL not valid;

alter table "public"."bank_accounts" validate constraint "bank_accounts_user_id_fkey";

grant delete on table "public"."bank_accounts" to "anon";

grant insert on table "public"."bank_accounts" to "anon";

grant references on table "public"."bank_accounts" to "anon";

grant select on table "public"."bank_accounts" to "anon";

grant trigger on table "public"."bank_accounts" to "anon";

grant truncate on table "public"."bank_accounts" to "anon";

grant update on table "public"."bank_accounts" to "anon";

grant delete on table "public"."bank_accounts" to "authenticated";

grant insert on table "public"."bank_accounts" to "authenticated";

grant references on table "public"."bank_accounts" to "authenticated";

grant select on table "public"."bank_accounts" to "authenticated";

grant trigger on table "public"."bank_accounts" to "authenticated";

grant truncate on table "public"."bank_accounts" to "authenticated";

grant update on table "public"."bank_accounts" to "authenticated";

grant delete on table "public"."bank_accounts" to "service_role";

grant insert on table "public"."bank_accounts" to "service_role";

grant references on table "public"."bank_accounts" to "service_role";

grant select on table "public"."bank_accounts" to "service_role";

grant trigger on table "public"."bank_accounts" to "service_role";

grant truncate on table "public"."bank_accounts" to "service_role";

grant update on table "public"."bank_accounts" to "service_role";

create policy "Enable all"
on "public"."bank_accounts"
as permissive
for all
to public
using (true)
with check (true);



