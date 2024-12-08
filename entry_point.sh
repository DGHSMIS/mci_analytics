#!/bin/sh
bun run prisma:migrate:prod && \
bun run prisma:generate:prod && \
bun run build && \
bun run start