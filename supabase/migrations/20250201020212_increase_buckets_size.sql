UPDATE storage.buckets
SET file_size_limit = 1024000
WHERE id = 'receipts';

UPDATE storage.buckets
SET file_size_limit = 1024000
WHERE id = 'avatars';

ALTER TABLE public.profiles ADD CONSTRAINT full_name_not_empty CHECK (LENGTH(full_name) > 0);