drop policy "Enable read access for all users" on "public"."transactions";

alter table "public"."transactions" drop constraint "transactions_receiverId_fkey";

alter table "public"."transactions" drop constraint "transactions_senderId_fkey";

alter table "public"."transactions" alter column "status" drop default;

alter type "public"."TransactionStatus" rename to "TransactionStatus__old_version_to_be_dropped";

create type "public"."TransactionStatus" as enum ('Waiting', 'Confirmed', 'Rejected');

alter table "public"."transactions" alter column status type "public"."TransactionStatus" using status::text::"public"."TransactionStatus";

alter table "public"."transactions" alter column "status" set default 'pending'::"TransactionStatus";

drop type "public"."TransactionStatus__old_version_to_be_dropped";

alter table "public"."transactions" drop column "receiverId";

alter table "public"."transactions" drop column "senderId";

alter table "public"."transactions" add column "amount" numeric not null;

alter table "public"."transactions" add column "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text);

alter table "public"."transactions" add column "issued_at" date not null;

alter table "public"."transactions" add column "receiver_id" uuid not null;

alter table "public"."transactions" add column "sender_id" uuid not null;

alter table "public"."transactions" alter column "status" set default 'Waiting'::"TransactionStatus";

alter table "public"."transactions" add constraint "transactions_receiver_id_fkey" FOREIGN KEY (receiver_id) REFERENCES profiles(id) not valid;

alter table "public"."transactions" validate constraint "transactions_receiver_id_fkey";

alter table "public"."transactions" add constraint "transactions_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES profiles(id) not valid;

alter table "public"."transactions" validate constraint "transactions_sender_id_fkey";

create policy "Enable all"
on "public"."transactions"
as permissive
for all
to public
using (true)
with check (true);



