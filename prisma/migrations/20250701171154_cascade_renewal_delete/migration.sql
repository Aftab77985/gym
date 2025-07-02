-- DropForeignKey
ALTER TABLE "Renewal" DROP CONSTRAINT "Renewal_memberId_fkey";

-- AddForeignKey
ALTER TABLE "Renewal" ADD CONSTRAINT "Renewal_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
