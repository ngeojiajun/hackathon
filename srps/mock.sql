-- Vendors

INSERT INTO "claims"."vendor" (vendor_name)
    VALUES ('Other'),
    ('Maxis'),
    ('CelcomDigi'),
    ('TNB'),
    ('Air Selangor'),
    ('U Mobile'),
    ('All in All'),
    ('AIA');

-- Employees

INSERT INTO "claims"."employee" (employee_name)
    VALUES ('Company Purchase'), -- 1
    ('Jia Jun'), -- 2
    ('Nelson'), -- 3
    ('Meya'), -- 4
    ('Aditya'), --5
    ('Shivanand'), --6
    ('Anya'); --7

-- Pending Claims

INSERT INTO "claims"."claims"(vendor_id, vendor_name, receipt_number, purchase_type, price, receipt_picture, employee_id)
VALUES (2, NULL, 'R12345', 'internet allowance', 100.00, '<<>>', 5),
    (2, NULL, 'R12346', 'internet allowance', 100.00, '<<>>', 2),
    (3, NULL, 'R12347', 'internet allowance', 100.00, '<<>>', 3),
    (4, NULL, 'R12348', 'internet allowance', 100.00, '<<>>', 4),
    (2, NULL, 'R12349', 'internet allowance', 100.00, '<<>>', 6);

-- Approved claims

INSERT INTO "claims"."claims"(vendor_id, vendor_name, receipt_number, purchase_type, price, receipt_picture, employee_id, claim_status, remarks)
VALUES (1, 'AWS', 'R22345', 'professional training', 100.00, '<<>>', 3, 'approved', 'Exam'),
    (1, 'AWS', 'R22346', 'professional training', 100.00, '<<>>', 2, 'approved', 'Exam'),
    (1, 'AWS', 'R22347', 'professional training', 100.00, '<<>>', 3, 'approved', 'Exam'),
    (1, 'AWS', 'R22348', 'professional training', 100.00, '<<>>', 4, 'approved', 'Exam'),
    (1, 'AWS', 'R22349', 'professional training', 100.00, '<<>>', 6, 'approved', 'Exam');

-- Rejected claims
INSERT INTO "claims"."claims"(vendor_id, vendor_name, receipt_number, purchase_type, price, receipt_picture, employee_id, claim_status, remarks)
VALUES (1, 'AWS', 'R22345', 'professional training', 100.00, '<<>>', 7, 'rejected', 'Forged');