import { PrismaClient } from '../../../../prisma/generated/postgres';


const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const prismaPostGresClient = globalForPrisma.prisma || new PrismaClient({
    datasources: {
      db: {
        url: process.env.POSTGRES_DATABASE_URL, // Use the Postgres database URL
      },
    },
  });


if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaPostGresClient


export default prismaPostGresClient;
