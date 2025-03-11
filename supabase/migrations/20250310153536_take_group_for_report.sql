drop function if exists "public"."get_filtered_bills"(page_size integer, page_number integer, member uuid, text_search text, since_timestamp timestamp without time zone, debtor uuid, creator uuid, creditor uuid);

drop view if exists "public"."user_financial_summary";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_filtered_bills(page_size integer, page_number integer, "group" uuid, member uuid, text_search text DEFAULT NULL::text, since_timestamp timestamp without time zone DEFAULT NULL::timestamp without time zone, debtor uuid DEFAULT NULL::uuid, creator uuid DEFAULT NULL::uuid, creditor uuid DEFAULT NULL::uuid)
 RETURNS TABLE(total_count bigint, id uuid)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    WITH filtered_bills AS (
        SELECT DISTINCT b.created_at,  b.id
        FROM bills b
                 LEFT JOIN bill_debtors bd ON b.id = bd.bill_id
        WHERE
            CASE
                WHEN creator IS NULL AND creditor IS NULL AND debtor IS NULL THEN
                    (b.creator_id = member OR b.creditor_id = member OR bd.user_id = member)
                ELSE
                    ((creditor IS NULL OR b.creditor_id = creditor) AND
                    (creator IS NULL OR b.creator_id = creator) AND
                    (debtor IS NULL OR bd.user_id = debtor))
            END
        AND (text_search IS NULL OR to_tsvector('english', b.description) @@ to_tsquery('english', text_search || ':*'))
        AND (b.group_id = get_filtered_bills.group)
    )

    SELECT
        (SELECT COUNT(*) FROM filtered_bills) AS total_count,
        fb.id
    FROM filtered_bills fb
    ORDER BY fb.created_at DESC
    LIMIT page_size OFFSET (page_number - 1) * page_size
    ;

END;
$function$
;

create or replace view "public"."user_financial_summary" as  WITH total_received AS (
         SELECT m_1.user_id,
            m_1.group_id,
            COALESCE(sum(t.amount), (0)::numeric) AS received
           FROM (memberships m_1
             LEFT JOIN transactions t ON (((m_1.user_id = t.receiver_id) AND (m_1.group_id = t.group_id))))
          WHERE ((t.status <> 'Declined'::"TransactionStatus") AND (m_1.status = 'Active'::"MembershipStatus"))
          GROUP BY m_1.user_id, m_1.group_id
        ), total_sent AS (
         SELECT m_1.user_id,
            m_1.group_id,
            COALESCE(sum(t.amount), (0)::numeric) AS sent
           FROM (memberships m_1
             LEFT JOIN transactions t ON (((m_1.user_id = t.sender_id) AND (m_1.group_id = t.group_id))))
          WHERE ((t.status <> 'Declined'::"TransactionStatus") AND (m_1.status = 'Active'::"MembershipStatus"))
          GROUP BY m_1.user_id, m_1.group_id
        ), total_bill_self_paid AS (
         SELECT m_1.user_id,
            m_1.group_id,
            COALESCE(sum(bd.amount), (0)::bigint) AS self_paid
           FROM ((memberships m_1
             LEFT JOIN bills b ON (((b.creditor_id = m_1.user_id) AND (b.group_id = m_1.group_id))))
             LEFT JOIN bill_debtors bd ON (((bd.user_id = b.creditor_id) AND (bd.bill_id = b.id))))
          WHERE (m_1.status = 'Active'::"MembershipStatus")
          GROUP BY m_1.user_id, m_1.group_id
        ), total_bill_paid AS (
         SELECT m_1.user_id,
            m_1.group_id,
            COALESCE(sum(b.total_amount), (0)::bigint) AS paid
           FROM (memberships m_1
             LEFT JOIN bills b ON (((m_1.user_id = b.creditor_id) AND (m_1.group_id = b.group_id))))
          WHERE (m_1.status = 'Active'::"MembershipStatus")
          GROUP BY m_1.user_id, m_1.group_id
        ), total_bill_owed AS (
         SELECT m_1.user_id,
            m_1.group_id,
            COALESCE(sum(bd.amount), (0)::bigint) AS owed
           FROM ((memberships m_1
             LEFT JOIN bills b ON ((m_1.group_id = b.group_id)))
             LEFT JOIN bill_debtors bd ON (((m_1.user_id = bd.user_id) AND (bd.bill_id = b.id))))
          WHERE (m_1.status = 'Active'::"MembershipStatus")
          GROUP BY m_1.user_id, m_1.group_id
        ), total_bill AS (
         SELECT m_1.user_id,
            m_1.group_id,
            (COALESCE(bp.paid, (0)::bigint) - COALESCE(sp.self_paid, (0)::bigint)) AS paid,
            (COALESCE(bo.owed, (0)::bigint) - COALESCE(sp.self_paid, (0)::bigint)) AS owed
           FROM (((memberships m_1
             LEFT JOIN total_bill_paid bp ON (((m_1.user_id = bp.user_id) AND (m_1.group_id = bp.group_id))))
             LEFT JOIN total_bill_owed bo ON (((m_1.user_id = bo.user_id) AND (m_1.group_id = bo.group_id))))
             LEFT JOIN total_bill_self_paid sp ON (((m_1.user_id = sp.user_id) AND (m_1.group_id = sp.group_id))))
          WHERE (m_1.status = 'Active'::"MembershipStatus")
        )
 SELECT m.user_id,
    m.group_id,
    COALESCE(sum(tr.received), (0)::numeric) AS received,
    COALESCE(sum(ts.sent), (0)::numeric) AS sent,
    COALESCE(sum(tb.owed), ((0)::bigint)::numeric) AS owed,
    COALESCE(sum(tb.paid), ((0)::bigint)::numeric) AS paid,
    (((COALESCE(sum(tb.paid), ((0)::bigint)::numeric) - COALESCE(sum(tb.owed), ((0)::bigint)::numeric)) + COALESCE(sum(tr.received), (0)::numeric)) - COALESCE(sum(ts.sent), (0)::numeric)) AS balance
   FROM (((memberships m
     LEFT JOIN total_bill tb ON (((m.user_id = tb.user_id) AND (m.group_id = tb.group_id))))
     LEFT JOIN total_received tr ON (((m.user_id = tr.user_id) AND (m.group_id = tr.group_id))))
     LEFT JOIN total_sent ts ON (((m.user_id = ts.user_id) AND (m.group_id = ts.group_id))))
  GROUP BY m.user_id, m.group_id;



