# ── Stage 1: Build Frontend & Install Dependencies ───────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests for workspace installation
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install all workspace dependencies (including devDependencies required for Vite build)
RUN npm install

# Copy source files
COPY . .

# Build Vite frontend static assets
RUN npm run build --workspace=frontend

# Prune devDependencies for production runtime image optimization
RUN npm prune --omit=dev

# ── Stage 2: Minimal Production Image ─────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy pruned workspace dependencies & built assets
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/frontend/dist ./frontend/dist

# Create uploads directory for PDF storage with proper permissions
RUN mkdir -p /app/backend/uploads

WORKDIR /app/backend

# Non-root user for security best practices
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 5000

# Health check for AWS Elastic Beanstalk / App Runner / ALB
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT:-5000}/health || exit 1

CMD ["node", "server.js"]
