/*
  Warnings:

  - The `rol` column on the `Usuario` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "rol",
ADD COLUMN     "rol" TEXT NOT NULL DEFAULT 'CLIENTE';

-- DropEnum
DROP TYPE "Rol";
