drop view if exists "public"."user_financial_summary";

alter table "public"."bill_debtors" alter column "amount" set data type integer using "amount"::integer;

alter table "public"."bills" alter column "total_amount" set data type integer using "total_amount"::integer;

alter table "public"."transactions" alter column "amount" set data type integer using "amount"::integer;

create or replace view "public"."user_financial_summary" as  WITH total_received AS (
         SELECT m_1.user_id,
            m_1.group_id,
            (COALESCE(sum(t.amount), (0)::bigint))::integer AS received
           FROM (memberships m_1
             LEFT JOIN transactions t ON (((m_1.user_id = t.receiver_id) AND (m_1.group_id = t.group_id))))
          WHERE ((t.status <> 'Declined'::"TransactionStatus") AND (m_1.status = 'Active'::"MembershipStatus"))
          GROUP BY m_1.user_id, m_1.group_id
        ), total_sent AS (
         SELECT m_1.user_id,
            m_1.group_id,
            (COALESCE(sum(t.amount), (0)::bigint))::integer AS sent
           FROM (memberships m_1
             LEFT JOIN transactions t ON (((m_1.user_id = t.sender_id) AND (m_1.group_id = t.group_id))))
          WHERE ((t.status <> 'Declined'::"TransactionStatus") AND (m_1.status = 'Active'::"MembershipStatus"))
          GROUP BY m_1.user_id, m_1.group_id
        ), total_bill_self_paid AS (
         SELECT m_1.user_id,
            m_1.group_id,
            (COALESCE(sum(bd.amount), (0)::bigint))::integer AS self_paid
           FROM ((memberships m_1
             LEFT JOIN bills b ON (((b.creditor_id = m_1.user_id) AND (b.group_id = m_1.group_id))))
             LEFT JOIN bill_debtors bd ON (((bd.user_id = b.creditor_id) AND (bd.bill_id = b.id))))
          WHERE (m_1.status = 'Active'::"MembershipStatus")
          GROUP BY m_1.user_id, m_1.group_id
        ), total_bill_paid AS (
         SELECT m_1.user_id,
            m_1.group_id,
            (COALESCE(sum(b.total_amount), (0)::bigint))::integer AS paid
           FROM (memberships m_1
             LEFT JOIN bills b ON (((m_1.user_id = b.creditor_id) AND (m_1.group_id = b.group_id))))
          WHERE (m_1.status = 'Active'::"MembershipStatus")
          GROUP BY m_1.user_id, m_1.group_id
        ), total_bill_owed AS (
         SELECT m_1.user_id,
            m_1.group_id,
            (COALESCE(sum(bd.amount), (0)::bigint))::integer AS owed
           FROM ((memberships m_1
             LEFT JOIN bills b ON ((m_1.group_id = b.group_id)))
             LEFT JOIN bill_debtors bd ON (((m_1.user_id = bd.user_id) AND (bd.bill_id = b.id))))
          WHERE (m_1.status = 'Active'::"MembershipStatus")
          GROUP BY m_1.user_id, m_1.group_id
        ), total_bill AS (
         SELECT m_1.user_id,
            m_1.group_id,
            (COALESCE(bp.paid, 0) - COALESCE(sp.self_paid, 0)) AS paid,
            (COALESCE(bo.owed, 0) - COALESCE(sp.self_paid, 0)) AS owed
           FROM (((memberships m_1
             LEFT JOIN total_bill_paid bp ON (((m_1.user_id = bp.user_id) AND (m_1.group_id = bp.group_id))))
             LEFT JOIN total_bill_owed bo ON (((m_1.user_id = bo.user_id) AND (m_1.group_id = bo.group_id))))
             LEFT JOIN total_bill_self_paid sp ON (((m_1.user_id = sp.user_id) AND (m_1.group_id = sp.group_id))))
          WHERE (m_1.status = 'Active'::"MembershipStatus")
        )
 SELECT m.user_id,
    m.group_id,
    (COALESCE(sum(tr.received), (0)::bigint))::integer AS received,
    (COALESCE(sum(ts.sent), (0)::bigint))::integer AS sent,
    (COALESCE(sum(tb.owed), (0)::bigint))::integer AS owed,
    (COALESCE(sum(tb.paid), (0)::bigint))::integer AS paid,
    (((((COALESCE(sum(tb.paid), (0)::bigint))::integer - (COALESCE(sum(tb.owed), (0)::bigint))::integer) + COALESCE(sum(tr.received), (0)::bigint)) - COALESCE(sum(ts.sent), (0)::bigint)))::integer AS balance
   FROM (((memberships m
     LEFT JOIN total_bill tb ON (((m.user_id = tb.user_id) AND (m.group_id = tb.group_id))))
     LEFT JOIN total_received tr ON (((m.user_id = tr.user_id) AND (m.group_id = tr.group_id))))
     LEFT JOIN total_sent ts ON (((m.user_id = ts.user_id) AND (m.group_id = ts.group_id))))
  GROUP BY m.user_id, m.group_id;



