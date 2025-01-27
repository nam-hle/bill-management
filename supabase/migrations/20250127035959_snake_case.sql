drop function if exists "public"."update_updatedat_column"();

alter table "public"."bill_members" drop constraint "bill_members_userId_fkey";
alter table "public"."bill_members" drop constraint "bill_members_bill_id_fkey";

alter table "public"."bills" drop constraint "bills_creatorId_fkey";
alter table "public"."bills" drop constraint "bills_updaterId_fkey";

alter table "public"."notifications" drop constraint "notifications_billId_fkey";
alter table "public"."notifications" drop constraint "notifications_userId_fkey";
alter table "public"."notifications" drop constraint "notifications_triggerId_fkey";

-- bill_members

ALTER TABLE "public"."bill_members" RENAME COLUMN "billId" TO "bill_id";
ALTER TABLE "public"."bill_members" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "public"."bill_members" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "public"."bill_members" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "public"."bill_members" RENAME COLUMN "userId" TO "user_id";

alter table "public"."bill_members" add constraint "bill_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;
alter table "public"."bill_members" validate constraint "bill_members_user_id_fkey";

alter table "public"."bill_members" add constraint "bill_members_bill_id_fkey" FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE not valid;
alter table "public"."bill_members" validate constraint "bill_members_bill_id_fkey";

-- bills

ALTER TABLE "public"."bills" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "public"."bills" RENAME COLUMN "issuedAt" TO "issued_at";
ALTER TABLE "public"."bills" RENAME COLUMN "creatorId" TO "creator_id";
ALTER TABLE "public"."bills" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "public"."bills" RENAME COLUMN "updaterId" TO "updater_id";

alter table "public"."bills" add constraint "bills_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES profiles(id) not valid;
alter table "public"."bills" validate constraint "bills_creator_id_fkey";
alter table "public"."bills" add constraint "bills_updater_id_fkey" FOREIGN KEY (updater_id) REFERENCES profiles(id) not valid;
alter table "public"."bills" validate constraint "bills_updater_id_fkey";

ALTER TABLE "public"."notifications" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "public"."notifications" RENAME COLUMN "readStatus" TO "read_status";
ALTER TABLE "public"."notifications" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "public"."notifications" RENAME COLUMN "billId" TO "bill_id";
ALTER TABLE "public"."notifications" RENAME COLUMN "triggerId" TO "trigger_id";

alter table "public"."notifications" add constraint "notifications_bill_id_fkey" FOREIGN KEY (bill_id) REFERENCES bills(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;
alter table "public"."notifications" validate constraint "notifications_bill_id_fkey";
alter table "public"."notifications" add constraint "notifications_trigger_id_fkey" FOREIGN KEY (trigger_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;
alter table "public"."notifications" validate constraint "notifications_trigger_id_fkey";
alter table "public"."notifications" add constraint "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;
alter table "public"."notifications" validate constraint "notifications_user_id_fkey";

-- profiles
ALTER TABLE "public"."profiles" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "public"."profiles" RENAME COLUMN "fullName" TO "full_name";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  NEW."updated_at" = NOW();
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.report(target_user_id uuid)
 RETURNS TABLE(paid bigint, owed bigint, self_paid bigint, received numeric, sent numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
        WITH SelfPaid AS (
            SELECT
                sum(bm.amount *  (case when role = 'Creditor' then 0 else 1 end)) as self_paid
            FROM bill_members bm
            WHERE bm.user_id = target_user_id
            GROUP BY bm.bill_id, bm.user_id
            HAVING COUNT(DISTINCT bm."role") = 2
        ),
             ReceivedTransactions AS (
                 SELECT COALESCE(SUM(amount), 0)
                 FROM transactions
                 WHERE receiver_id = target_user_id
                   AND status != 'Declined'
             ),
             SentTransactions AS (
                 SELECT COALESCE(SUM(amount), 0)
                 FROM transactions
                 WHERE sender_id = target_user_id
                   AND status != 'Declined'
             )

        SELECT
            SUM((CASE WHEN role = 'Creditor' THEN amount ELSE 0 END)) as paid,
            SUM((CASE WHEN role = 'Debtor' THEN amount ELSE 0 END)) as owed,
            (SELECT * FROM SelfPaid) as self_paid,
            (SELECT * FROM ReceivedTransactions) as received,
            (SELECT * FROM SentTransactions) as sent
        FROM bill_members bm
        WHERE bm.user_id = target_user_id;
END
$function$
;


