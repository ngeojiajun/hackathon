-- 01-claim status by purchase_type
select purchase_type,claim_status, COUNT(*) as "count"
    FROM "claims"."claims"
    WHERE {{claim_date}}
    GROUP BY 1,2;

-- 02-claim status by employees
select employee_name,claim_status, COUNT(*) as "count"
    FROM "claims"."claims"
   INNER JOIN "claims"."employee"
   USING (employee_id)
   WHERE {{claim_date}}
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
    WHERE {{claim_date}}
    GROUP BY 1,2;

-- 04-total claims by employee
SELECT employee_name, SUM(price) as total_claim
    FROM "claims"."claims" c
   INNER JOIN "claims"."employee" e
   USING (employee_id)
   WHERE c.employee_id > 1 AND {{claim_date}}
   GROUP BY 1;

-- 05-claim status
select claim_status, COUNT(*) as "count"
    FROM "claims"."claims"
    WHERE {{claim_date}}
    GROUP BY 1;