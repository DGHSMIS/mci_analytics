FROM oven/bun:latest as build
# Set debug environment variables for more verbose logging
# ENV BUN_DEBUG=true
# ENV BUN_LOG_LEVEL=debug
# Install SHARP Package globally for Next.js Image Optimization 
RUN bun add -g sharp

# Create a non-root user and group
RUN groupadd -g 1001 appgroup && \
    useradd -u 1001 -g appgroup -s /bin/sh -m appuser


# Copy Entry Point File from host & set necessary permissions
COPY ./entry_point.sh /entry_point.sh

# Create Application Directory & set work directory
RUN mkdir -p /app  && chown -R appuser:appgroup /app && chmod -R 755 /app

WORKDIR /app

# Install package dependencies by first copying package.json and bun.lock files & running bun install
COPY ./package.json /app
COPY ./bun.lockb /app
RUN bun install --frozen-lockfile --verbose

# Copy project src files to /app directory
COPY . /app


# Ensure correct ownership of the app directory
RUN chown -R appuser:appgroup /app

# Expose port 3001 for external access
EXPOSE 3001

# Switch to the non-root user
USER appuser

# Set entry point for the container
CMD ["/entry_point.sh"]