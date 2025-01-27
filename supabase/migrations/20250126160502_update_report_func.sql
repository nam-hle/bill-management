drop function if exists "public"."calculate_balances"();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.report(target_user_id uuid)
 RETURNS TABLE(paid bigint, owed bigint, self_paid bigint, received numeric, sent numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
        WITH SelfPaid AS (
            SELECT
                sum(bm.amount *  (case when role = 'Creditor' then 0 else 1 end)) as self_paid
            FROM bill_members bm
            WHERE bm."userId" = target_user_id
            GROUP BY bm."billId", bm."userId"
            HAVING COUNT(DISTINCT bm."role") = 2
        ),
             ReceivedTransactions AS (
                 SELECT COALESCE(SUM(amount), 0)
                 FROM transactions
                 WHERE receiver_id = target_user_id
                   AND status != 'Declined'
             ),
             SentTransactions AS (
                 SELECT COALESCE(SUM(amount), 0)
                 FROM transactions
                 WHERE sender_id = target_user_id
                   AND status != 'Declined'
             )

        SELECT
            SUM((CASE WHEN role = 'Creditor' THEN amount ELSE 0 END)) as paid,
            SUM((CASE WHEN role = 'Debtor' THEN amount ELSE 0 END)) as owed,
            (SELECT * FROM SelfPaid) as self_paid,
            (SELECT * FROM ReceivedTransactions) as received,
            (SELECT * FROM SentTransactions) as sent
        FROM bill_members bm
        WHERE bm."userId" = target_user_id;
END
$function$
;


