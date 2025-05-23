-- DropForeignKey
ALTER TABLE "BerthAllocation" DROP CONSTRAINT "BerthAllocation_ticketId_fkey";

-- AddForeignKey
ALTER TABLE "BerthAllocation" ADD CONSTRAINT "BerthAllocation_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
