create policy "Enable all 1lnm9mj_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'receipts'::text));


create policy "Enable all 1lnm9mj_1"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'receipts'::text));


create policy "Enable all 1lnm9mj_2"
on "storage"."objects"
as permissive
for delete
to public
using ((bucket_id = 'receipts'::text));


create policy "Enable all 1lnm9mj_3"
on "storage"."objects"
as permissive
for update
to public
using ((bucket_id = 'receipts'::text));


create policy "Enable all 1oj01fe_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'avatars'::text));


create policy "Enable all 1oj01fe_1"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'avatars'::text));


create policy "Enable all 1oj01fe_2"
on "storage"."objects"
as permissive
for update
to public
using ((bucket_id = 'avatars'::text));


create policy "Enable all 1oj01fe_3"
on "storage"."objects"
as permissive
for delete
to public
using ((bucket_id = 'avatars'::text));



