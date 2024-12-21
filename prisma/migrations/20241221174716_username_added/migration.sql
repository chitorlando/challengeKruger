/*
  Warnings:

  - Added the required column `usuario` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "usuario" VARCHAR(10) NOT NULL;
