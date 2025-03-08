alter table "public"."bills" add column "group_id" uuid not null;

alter table "public"."transactions" add column "group_id" uuid not null;

alter table "public"."bills" add constraint "bills_group_id_fkey" FOREIGN KEY (group_id) REFERENCES groups(id) not valid;

alter table "public"."bills" validate constraint "bills_group_id_fkey";

alter table "public"."transactions" add constraint "transactions_group_id_fkey" FOREIGN KEY (group_id) REFERENCES groups(id) not valid;

alter table "public"."transactions" validate constraint "transactions_group_id_fkey";


