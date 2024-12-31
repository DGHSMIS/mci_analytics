#!/bin/sh
cd /app
pnpm run prisma:migrate:prod
pnpm run prisma:generate:prod
pnpm run build
pnpm start