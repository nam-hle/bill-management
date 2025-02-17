set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_filtered_bills(page_size integer, page_number integer, member uuid, text_search text DEFAULT NULL::text, since_timestamp timestamp without time zone DEFAULT NULL::timestamp without time zone, debtor uuid DEFAULT NULL::uuid, creator uuid DEFAULT NULL::uuid, creditor uuid DEFAULT NULL::uuid)
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


