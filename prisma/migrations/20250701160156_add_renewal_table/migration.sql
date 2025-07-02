-- CreateTable
CREATE TABLE "Renewal" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "renewedByUserId" INTEGER NOT NULL,
    "renewStart" TIMESTAMP(3) NOT NULL,
    "renewEnd" TIMESTAMP(3) NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Renewal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Renewal" ADD CONSTRAINT "Renewal_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Renewal" ADD CONSTRAINT "Renewal_renewedByUserId_fkey" FOREIGN KEY ("renewedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
