alter table "public"."notifications" drop constraint "notifications_transaction_id_fkey";

alter table "public"."notifications" add constraint "notifications_transaction_id_fkey" FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_transaction_id_fkey";

UPDATE storage.buckets
SET file_size_limit = 512000, allowed_mime_types = '{image/jpeg,image/png}'
WHERE id = 'receipts';

UPDATE storage.buckets
SET file_size_limit = 512000, allowed_mime_types = '{image/jpeg,image/png}', public = true
WHERE id = 'avatars';