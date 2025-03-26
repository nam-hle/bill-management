alter table "public"."notifications" drop constraint "notifications_transaction_id_fkey";

alter table "public"."notifications" drop column "transaction_id";

alter table "public"."notifications" add column "transaction_display_id" text;

CREATE UNIQUE INDEX unique_transaction_display_id ON public.transactions USING btree (display_id);

alter table "public"."notifications" add constraint "notifications_transaction_display_id_fkey" FOREIGN KEY (transaction_display_id) REFERENCES transactions(display_id) not valid;

alter table "public"."notifications" validate constraint "notifications_transaction_display_id_fkey";

alter table "public"."transactions" add constraint "unique_transaction_display_id" UNIQUE using index "unique_transaction_display_id";


