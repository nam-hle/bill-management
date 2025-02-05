CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();


alter table "public"."transactions" add column "bank_account_id" uuid;

alter table "public"."transactions" add constraint "transactions_bank_account_id_fkey" FOREIGN KEY (bank_account_id) REFERENCES bank_accounts(id) not valid;

alter table "public"."transactions" validate constraint "transactions_bank_account_id_fkey";

create or replace view "public"."user_financial_summary" as  WITH total_received AS (
         SELECT p_1.id AS user_id,
            COALESCE(sum(t.amount), (0)::numeric) AS received
           FROM (profiles p_1
             LEFT JOIN transactions t ON ((p_1.id = t.receiver_id)))
          WHERE (t.status <> 'Declined'::"TransactionStatus")
          GROUP BY p_1.id
        ), total_sent AS (
         SELECT p_1.id AS user_id,
            COALESCE(sum(t.amount), (0)::numeric) AS sent
           FROM (profiles p_1
             LEFT JOIN transactions t ON ((p_1.id = t.sender_id)))
          WHERE (t.status <> 'Declined'::"TransactionStatus")
          GROUP BY p_1.id
        ), total_bill_self_paid AS (
         SELECT p_1.id AS user_id,
            COALESCE(sum((bm.amount *
                CASE
                    WHEN (bm.role = 'Creditor'::"BillMemberRole") THEN 0
                    ELSE 1
                END)), (0)::bigint) AS self_paid
           FROM ((profiles p_1
             LEFT JOIN bill_members bm ON ((p_1.id = bm.user_id)))
             LEFT JOIN bills b ON ((bm.bill_id = b.id)))
          GROUP BY p_1.id, b.id
         HAVING (count(DISTINCT bm.role) = 2)
        ), total_bill_paid AS (
         SELECT p_1.id AS user_id,
            COALESCE(sum(
                CASE
                    WHEN (bm.role = 'Creditor'::"BillMemberRole") THEN (bm.amount)::integer
                    ELSE 0
                END), (0)::bigint) AS paid,
            COALESCE(sum(
                CASE
                    WHEN (bm.role = 'Debtor'::"BillMemberRole") THEN (bm.amount)::integer
                    ELSE 0
                END), (0)::bigint) AS owed
           FROM (profiles p_1
             LEFT JOIN bill_members bm ON ((p_1.id = bm.user_id)))
          GROUP BY p_1.id
        ), total_bill AS (
         SELECT p_1.id AS user_id,
            (COALESCE(bp.paid, (0)::bigint) - COALESCE(sp.self_paid, (0)::bigint)) AS paid,
            (COALESCE(bp.owed, (0)::bigint) - COALESCE(sp.self_paid, (0)::bigint)) AS owed
           FROM ((profiles p_1
             LEFT JOIN total_bill_paid bp ON ((p_1.id = bp.user_id)))
             LEFT JOIN total_bill_self_paid sp ON ((p_1.id = sp.user_id)))
        )
 SELECT p.id AS user_id,
    COALESCE(tb.owed, (0)::bigint) AS owed,
    COALESCE(tr.received, (0)::numeric) AS received,
    COALESCE(tb.paid, (0)::bigint) AS paid,
    COALESCE(ts.sent, (0)::numeric) AS sent,
    ((((COALESCE(tb.paid, (0)::bigint) - COALESCE(tb.owed, (0)::bigint)))::numeric + COALESCE(tr.received, (0)::numeric)) - COALESCE(ts.sent, (0)::numeric)) AS balance
   FROM (((profiles p
     LEFT JOIN total_bill tb ON ((p.id = tb.user_id)))
     LEFT JOIN total_received tr ON ((p.id = tr.user_id)))
     LEFT JOIN total_sent ts ON ((p.id = ts.user_id)));



