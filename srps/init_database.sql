DROP SCHEMA IF EXISTS "claims" CASCADE;
CREATE SCHEMA IF NOT EXISTS "claims";

CREATE TYPE "claims"."approval_status" AS ENUM ('pending','approved','rejected');

CREATE TABLE "claims"."vendor" (
	vendor_id BIGSERIAL PRIMARY KEY,
	vendor_name TEXT NOT NULL
);
CREATE INDEX idx_vendor_name ON "claims"."vendor"(vendor_name);

CREATE TABLE "claims"."employee" (
    employee_id     BIGSERIAL PRIMARY KEY,
    employee_name   TEXT NOT NULL,
	employee_email	TEXT NULL
);

CREATE TABLE "claims"."claims" (
	claim_id 		BIGSERIAL PRIMARY KEY,
	vendor_id 		BIGINT NOT NULL REFERENCES "claims"."vendor"(vendor_id),
	vendor_name 	TEXT NULL, -- Fill this up if vendor_id is 1
	employee_id     BIGINT NOT NULL REFERENCES "claims"."employee"(employee_id),
	receipt_number 	TEXT NOT NULL,
	-- 1. travelling allowance
	-- 2. dental benefit
	-- 3. childcare allowance
	-- 4. telephone bill allowance
	-- 5. parking allowance
	purchase_type 	TEXT NOT NULL,
	price			DECIMAL NOT NULL,
    remarks         TEXT NOT NULL DEFAULT '',
	receipt_picture TEXT NOT NULL, -- Remote reference to BLOB storage
	claim_date		TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	last_updated	TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	claim_status	"claims"."approval_status" DEFAULT 'pending'
);
