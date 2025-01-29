alter table "public"."bills" add column "receipt_file" text;

alter table "public"."profiles" alter column "full_name" set not null;

insert into storage.buckets
(id, name, public)
values
    ('receipts', 'receipts', false);
