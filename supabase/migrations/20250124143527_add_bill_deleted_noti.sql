alter type "public"."NotificationType" rename to "NotificationType__old_version_to_be_dropped";

create type "public"."NotificationType" as enum ('BillCreated', 'BillUpdated', 'BillDeleted');

alter table "public"."notifications" alter column type type "public"."NotificationType" using type::text::"public"."NotificationType";

drop type "public"."NotificationType__old_version_to_be_dropped";
