-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'RAC', 'WAITING');

-- CreateEnum
CREATE TYPE "BerthType" AS ENUM ('LOWER', 'MIDDLE', 'UPPER', 'SIDE_LOWER');

-- CreateTable
CREATE TABLE "Passenger" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "isChild" BOOLEAN NOT NULL DEFAULT false,
    "ticketId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Passenger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "pnrNumber" TEXT NOT NULL,
    "bookingStatus" "BookingStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Berth" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "type" "BerthType" NOT NULL,
    "coach" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Berth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BerthAllocation" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "passengerId" INTEGER NOT NULL,
    "berthId" INTEGER,
    "status" "BookingStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BerthAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemCounter" (
    "id" SERIAL NOT NULL,
    "confirmedAvailable" INTEGER NOT NULL DEFAULT 63,
    "racAvailable" INTEGER NOT NULL DEFAULT 18,
    "waitingAvailable" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_pnrNumber_key" ON "Ticket"("pnrNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Berth_number_key" ON "Berth"("number");

-- AddForeignKey
ALTER TABLE "Passenger" ADD CONSTRAINT "Passenger_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BerthAllocation" ADD CONSTRAINT "BerthAllocation_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BerthAllocation" ADD CONSTRAINT "BerthAllocation_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "Passenger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BerthAllocation" ADD CONSTRAINT "BerthAllocation_berthId_fkey" FOREIGN KEY ("berthId") REFERENCES "Berth"("id") ON DELETE SET NULL ON UPDATE CASCADE;
