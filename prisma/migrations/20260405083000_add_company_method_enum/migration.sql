-- CreateEnum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CompanyMethod') THEN
        CREATE TYPE "CompanyMethod" AS ENUM (
            'Transfer Pricing',
            'Debt Shifting',
            'Royalty Stripping',
            'Shell Layering'
        );
    END IF;
END $$;

CREATE OR REPLACE FUNCTION convert_company_methods(methods_input text[])
RETURNS "CompanyMethod"[]
LANGUAGE SQL
AS $$
    SELECT COALESCE(
        ARRAY(
            SELECT method_value::"CompanyMethod"
            FROM unnest(COALESCE(methods_input, ARRAY[]::text[])) AS method_value
            WHERE method_value IN (
                'Transfer Pricing',
                'Debt Shifting',
                'Royalty Stripping',
                'Shell Layering'
            )
        ),
        ARRAY[]::"CompanyMethod"[]
    );
$$;

-- Normalize existing method arrays by removing legacy unsupported values before casting
ALTER TABLE "CompanyCollection"
ALTER COLUMN "methods" TYPE "CompanyMethod"[]
USING (convert_company_methods("methods"));

DROP FUNCTION convert_company_methods(text[]);
