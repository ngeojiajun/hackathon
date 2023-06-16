-- 01-claim status by purchase_type
select purchase_type,claim_status, COUNT(*) as "count"
    FROM "claims"."claims"
    [[WHERE claim_date >= {{start_date}} AND claim_date <= {{end_date}} ]]
    GROUP BY 1,2;

-- 02-claim status by employees
select employee_name,claim_status, COUNT(*) as "count"
    FROM "claims"."claims" c
   INNER JOIN "claims"."employee"
   USING (employee_id)
   [[WHERE claim_date >= {{start_date}} AND claim_date <= {{end_date}} ]]
   GROUP BY 1,2;

-- 03-claim status by vendor
SELECT
    CASE
        WHEN c.vendor_id = 1 THEN COALESCE(c.vendor_name, 'Unknown')
        ELSE v.vendor_name
    END as vendor_name,
    claim_status,
    COUNT(*) as "count"
    FROM "claims"."claims" c
    INNER JOIN "claims"."vendor" v
    USING (vendor_id)
    [[WHERE claim_date >= {{start_date}} AND claim_date <= {{end_date}} ]]
    GROUP BY 1,2;