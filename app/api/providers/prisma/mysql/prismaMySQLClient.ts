import { PrismaClient } from '../../../../prisma/generated/mysql';

const prismaMySQLClient = new PrismaClient({
    datasources: {
      db: {
        url: process.env.MYSQL_NID_PROXY_DATABASE_URL, // Use the MYSQL database URL
      },
    },
  });

export default prismaMySQLClient;
