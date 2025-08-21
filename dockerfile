FROM node:22-alpine

# Install necessary packages
RUN apk add --no-cache openssl mysql-client

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code and prisma schema
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Build the application
RUN pnpm run build

# Expose port
EXPOSE 8000

# Default command (can be overridden in docker-compose)
CMD ["pnpm", "run", "start"]
