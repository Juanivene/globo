-- CreateEnum
CREATE TYPE "DraftStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "freeShipping" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "freeShippingProvinces" "ArgentinaProvince"[] DEFAULT ARRAY[]::"ArgentinaProvince"[];

-- CreateTable
CREATE TABLE "CheckoutDraft" (
    "id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "mpPreferenceId" TEXT,
    "status" "DraftStatus" NOT NULL DEFAULT 'PENDING',
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CheckoutDraft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutDraft_mpPreferenceId_key" ON "CheckoutDraft"("mpPreferenceId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutDraft_orderId_key" ON "CheckoutDraft"("orderId");
