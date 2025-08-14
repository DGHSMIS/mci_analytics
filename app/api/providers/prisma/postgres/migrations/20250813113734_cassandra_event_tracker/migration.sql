-- CreateTable
CREATE TABLE "CassandraEventTracker" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "CassandraEventTracker_pkey" PRIMARY KEY ("id")
);
