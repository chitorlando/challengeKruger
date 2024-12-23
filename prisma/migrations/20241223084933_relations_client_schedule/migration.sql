/*
  Warnings:

  - You are about to drop the column `clienteId` on the `Horario` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Horario" DROP CONSTRAINT "Horario_clienteId_fkey";

-- AlterTable
ALTER TABLE "Horario" DROP COLUMN "clienteId";
