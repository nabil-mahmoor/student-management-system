/*
  Warnings:

  - The values [CS,SE,CE,IT,IS] on the enum `Degree` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Degree_new" AS ENUM ('BCS', 'BSE', 'BCE', 'DBA', 'BIT', 'BIS');
ALTER TABLE "Student" ALTER COLUMN "degree" TYPE "Degree_new" USING ("degree"::text::"Degree_new");
ALTER TYPE "Degree" RENAME TO "Degree_old";
ALTER TYPE "Degree_new" RENAME TO "Degree";
DROP TYPE "public"."Degree_old";
COMMIT;
