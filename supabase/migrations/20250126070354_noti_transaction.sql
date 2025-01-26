alter table "public"."transactions" alter column "status" drop default;

alter type "public"."NotificationType" rename to "NotificationType__old_version_to_be_dropped";

create type "public"."NotificationType" as enum ('BillCreated', 'BillUpdated', 'BillDeleted', 'TransactionWaiting', 'TransactionConfirmed', 'TransactionDeclined');

alter type "public"."TransactionStatus" rename to "TransactionStatus__old_version_to_be_dropped";

create type "public"."TransactionStatus" as enum ('Waiting', 'Confirmed', 'Declined');

alter table "public"."notifications" alter column type type "public"."NotificationType" using type::text::"public"."NotificationType";

alter table "public"."transactions" alter column status type "public"."TransactionStatus" using status::text::"public"."TransactionStatus";

alter table "public"."transactions" alter column "status" set default 'Waiting'::"TransactionStatus";

drop type "public"."NotificationType__old_version_to_be_dropped";

drop type "public"."TransactionStatus__old_version_to_be_dropped";

alter table "public"."notifications" add column "transaction_id" uuid;

alter table "public"."notifications" add constraint "notifications_transaction_id_fkey" FOREIGN KEY (transaction_id) REFERENCES transactions(id) not valid;

alter table "public"."notifications" validate constraint "notifications_transaction_id_fkey";


