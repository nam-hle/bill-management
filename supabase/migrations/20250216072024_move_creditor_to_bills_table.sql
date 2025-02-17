drop policy "Enable all" on "public"."bill_members";

revoke delete on table "public"."bill_members" from "anon";

revoke insert on table "public"."bill_members" from "anon";

revoke references on table "public"."bill_members" from "anon";

revoke select on table "public"."bill_members" from "anon";

revoke trigger on table "public"."bill_members" from "anon";

revoke truncate on table "public"."bill_members" from "anon";

revoke update on table "public"."bill_members" from "anon";

revoke delete on table "public"."bill_members" from "authenticated";

revoke insert on table "public"."bill_members" from "authenticated";

revoke references on table "public"."bill_members" from "authenticated";

revoke select on table "public"."bill_members" from "authenticated";

revoke trigger on table "public"."bill_members" from "authenticated";

revoke truncate on table "public"."bill_members" from "authenticated";

revoke update on table "public"."bill_members" from "authenticated";

revoke delete on table "public"."bill_members" from "service_role";

revoke insert on table "public"."bill_members" from "service_role";

revoke references on table "public"."bill_members" from "service_role";

revoke select on table "public"."bill_members" from "service_role";

revoke trigger on table "public"."bill_members" from "service_role";

revoke truncate on table "public"."bill_members" from "service_role";

revoke update on table "public"."bill_members" from "service_role";

alter table "public"."bill_members" drop constraint "bill_members_bill_id_fkey";

alter table "public"."bill_members" drop constraint "bill_members_user_id_fkey";

drop function if exists "public"."report"(target_user_id uuid);

drop view if exists "public"."user_financial_summary";

alter table "public"."bill_members" drop constraint "bill_members_pkey";

drop index if exists "public"."bill_members_pkey";

drop table "public"."bill_members";

create table "public"."bill_debtors" (
    "id" uuid not null default gen_random_uuid(),
    "amount" smallint not null,
    "bill_id" uuid not null default gen_random_uuid(),
    "role" "BillMemberRole" not null default 'Debtor'::"BillMemberRole",
    "user_id" uuid not null
);


alter table "public"."bill_debtors" enable row level security;

alter table "public"."bills" add column "creditor_id" uuid not null;

alter table "public"."bills" add column "total_amount" smallint not null;

CREATE UNIQUE INDEX unique_bill_debtor ON public.bill_debtors USING btree (bill_id, user_id);

CREATE UNIQUE INDEX bill_members_pkey ON public.bill_debtors USING btree (id);

alter table "public"."bill_debtors" add constraint "bill_members_pkey" PRIMARY KEY using index "bill_members_pkey";

alter table "public"."bill_debtors" add constraint "bill_members_bill_id_fkey" FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE not valid;

alter table "public"."bill_debtors" validate constraint "bill_members_bill_id_fkey";

alter table "public"."bill_debtors" add constraint "bill_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."bill_debtors" validate constraint "bill_members_user_id_fkey";

alter table "public"."bills" add constraint "bills_creditor_id_fkey" FOREIGN KEY (creditor_id) REFERENCES profiles(id) not valid;

alter table "public"."bills" validate constraint "bills_creditor_id_fkey";

create or replace view "public"."user_financial_summary" as  WITH total_received AS (
         SELECT p_1.id AS user_id,
            COALESCE(sum(t.amount), (0)::numeric) AS received
           FROM (profiles p_1
             LEFT JOIN transactions t ON ((p_1.id = t.receiver_id)))
          WHERE (t.status <> 'Declined'::"TransactionStatus")
          GROUP BY p_1.id
        ), total_sent AS (
         SELECT p_1.id AS user_id,
            COALESCE(sum(t.amount), (0)::numeric) AS sent
           FROM (profiles p_1
             LEFT JOIN transactions t ON ((p_1.id = t.sender_id)))
          WHERE (t.status <> 'Declined'::"TransactionStatus")
          GROUP BY p_1.id
        ), total_bill_self_paid AS (
         SELECT p_1.id AS user_id,
            COALESCE(sum(bd.amount), (0)::bigint) AS self_paid
           FROM ((profiles p_1
             LEFT JOIN bills b ON ((b.creditor_id = p_1.id)))
             LEFT JOIN bill_debtors bd ON (((bd.user_id = b.creditor_id) AND (bd.bill_id = b.id))))
          GROUP BY p_1.id
        ), total_bill_paid AS (
         SELECT p_1.id AS user_id,
            COALESCE(sum(b.total_amount), (0)::bigint) AS paid
           FROM (profiles p_1
             LEFT JOIN bills b ON ((p_1.id = b.creditor_id)))
          GROUP BY p_1.id
        ), total_bill_owed AS (
         SELECT p_1.id AS user_id,
            COALESCE(sum(b.amount), (0)::bigint) AS owed
           FROM (profiles p_1
             LEFT JOIN bill_debtors b ON ((p_1.id = b.user_id)))
          GROUP BY p_1.id
        ), total_bill AS (
         SELECT p_1.id AS user_id,
            (COALESCE(bp.paid, (0)::bigint) - COALESCE(sp.self_paid, (0)::bigint)) AS paid,
            (COALESCE(bo.owed, (0)::bigint) - COALESCE(sp.self_paid, (0)::bigint)) AS owed
           FROM (((profiles p_1
             LEFT JOIN total_bill_paid bp ON ((p_1.id = bp.user_id)))
             LEFT JOIN total_bill_owed bo ON ((p_1.id = bo.user_id)))
             LEFT JOIN total_bill_self_paid sp ON ((p_1.id = sp.user_id)))
        )
 SELECT p.id AS user_id,
    COALESCE(tb.owed, (0)::bigint) AS owed,
    COALESCE(tr.received, (0)::numeric) AS received,
    COALESCE(tb.paid, (0)::bigint) AS paid,
    COALESCE(ts.sent, (0)::numeric) AS sent,
    ((((COALESCE(tb.paid, (0)::bigint) - COALESCE(tb.owed, (0)::bigint)))::numeric + COALESCE(tr.received, (0)::numeric)) - COALESCE(ts.sent, (0)::numeric)) AS balance
   FROM (((profiles p
     LEFT JOIN total_bill tb ON ((p.id = tb.user_id)))
     LEFT JOIN total_received tr ON ((p.id = tr.user_id)))
     LEFT JOIN total_sent ts ON ((p.id = ts.user_id)));


grant delete on table "public"."bill_debtors" to "anon";

grant insert on table "public"."bill_debtors" to "anon";

grant references on table "public"."bill_debtors" to "anon";

grant select on table "public"."bill_debtors" to "anon";

grant trigger on table "public"."bill_debtors" to "anon";

grant truncate on table "public"."bill_debtors" to "anon";

grant update on table "public"."bill_debtors" to "anon";

grant delete on table "public"."bill_debtors" to "authenticated";

grant insert on table "public"."bill_debtors" to "authenticated";

grant references on table "public"."bill_debtors" to "authenticated";

grant select on table "public"."bill_debtors" to "authenticated";

grant trigger on table "public"."bill_debtors" to "authenticated";

grant truncate on table "public"."bill_debtors" to "authenticated";

grant update on table "public"."bill_debtors" to "authenticated";

grant delete on table "public"."bill_debtors" to "service_role";

grant insert on table "public"."bill_debtors" to "service_role";

grant references on table "public"."bill_debtors" to "service_role";

grant select on table "public"."bill_debtors" to "service_role";

grant trigger on table "public"."bill_debtors" to "service_role";

grant truncate on table "public"."bill_debtors" to "service_role";

grant update on table "public"."bill_debtors" to "service_role";

create policy "Enable all"
on "public"."bill_debtors"
as permissive
for all
to public
using (true);



