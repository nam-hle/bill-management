alter table "public"."notifications" drop constraint "notifications_bill_id_fkey";

alter table "public"."bills" add column "display_id" text not null;

alter table "public"."notifications" drop column "bill_id";

alter table "public"."notifications" add column "bill_display_id" text;

CREATE UNIQUE INDEX bills_display_id_key ON public.bills USING btree (display_id);

alter table "public"."bills" add constraint "bills_display_id_key" UNIQUE using index "bills_display_id_key";

alter table "public"."notifications" add constraint "notifications_bill_display_id_fkey" FOREIGN KEY (bill_display_id) REFERENCES bills(display_id) not valid;

alter table "public"."notifications" validate constraint "notifications_bill_display_id_fkey";


