FROM node:20-alpine AS build

# Install necessary tools + bash
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat \
    bash

# Explicitly set SHELL to bash so pnpm detects it
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# 1. Set PNPM_HOME
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

# 2. Install pnpm globally via npm
RUN npm install -g pnpm

# 3. Run pnpm setup (will now detect bash properly)
RUN pnpm setup

# 4. Now safely install global packages
RUN pnpm add -g sharp node-sass


# Create a non-root user and group
RUN addgroup -g 1001 appgroup && \
    adduser -D -u 1001 -G appgroup appuser

# Copy and make entry script executable (if you have one)
COPY ./entry_point.sh /entry_point.sh
RUN chmod +x /entry_point.sh

# Create and set work directory
RUN mkdir -p /app && chown -R appuser:appgroup /app
WORKDIR /app

# Copy package manifest and lock file (if you have pnpm-lock.yaml)
COPY package.json .
COPY pnpm-lock.yaml .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the source
COPY . /app

# Ensure correct ownership
RUN chown -R appuser:appgroup /app

# Expose port
EXPOSE 3001

# Switch to the non-root user
USER appuser

# The container entry point
CMD ["/entry_point.sh"]