# ==============================================================
# FILE: node-backend/Dockerfile
# ==============================================================
# OWNER:        Team Member 3 (DevOps / Infrastructure Engineer)
# TECHNOLOGIES: Docker, Node.js 20 (Alpine), npm, Multi-Stage Build
#
# INSTRUCTIONS FOR TEAM MEMBER 3:
# ─────────────────────────────────────────────────────────────
# This Dockerfile builds the Node.js/Express backend into a
# lean, production-ready container using a multi-stage build.
# The Alpine Linux base image is used to minimise image size.
#
# STEPS TO IMPLEMENT:
#
# Stage 1 — Dependencies (base for all stages):
#   FROM node:20-alpine AS dependencies
#   - Set the working directory: WORKDIR /app
#   - Copy ONLY the package files first (Docker layer caching
#     optimization — npm install only re-runs if package.json
#     or package-lock.json changes):
#       COPY package.json package-lock.json ./
#   - Install production dependencies only:
#       RUN npm ci --omit=dev
#     (npm ci is stricter and faster than npm install for CI/CD.)
#
# Stage 2 — Development:
#   FROM node:20-alpine AS development
#   - WORKDIR /app
#   - COPY package.json package-lock.json ./
#   - RUN npm install  (includes devDependencies like nodemon)
#   - COPY . .
#   - EXPOSE 5000
#   - CMD ["npm", "run", "dev"]
#     (Assumes package.json has: "dev": "nodemon src/server.js")
#     Nodemon watches for file changes and auto-restarts the server.
#
# Stage 3 — Production:
#   FROM node:20-alpine AS production
#   - Add dumb-init for proper Unix signal handling inside Docker:
#       RUN apk add --no-cache dumb-init
#     (Without dumb-init, SIGTERM signals may not reach the Node
#     process, causing slow or improper container shutdowns.)
#   - Set NODE_ENV:
#       ENV NODE_ENV=production
#   - WORKDIR /app
#   - Copy production node_modules from Stage 1:
#       COPY --from=dependencies /app/node_modules ./node_modules
#   - Copy application source code:
#       COPY . .
#   - Create a non-root user for security:
#       RUN addgroup -S passcraft && adduser -S passcraft -G passcraft
#       USER passcraft
#     (Running as root inside a container is a security risk.)
#   - EXPOSE 5000
#   - Use dumb-init as the PID 1 process:
#       ENTRYPOINT ["dumb-init", "--"]
#       CMD ["node", "src/server.js"]
#
# .dockerignore file (create separately):
#   Team Member 3 must also create node-backend/.dockerignore:
#     node_modules
#     .env
#     .git
#     *.md
#     coverage/
#   This prevents large or sensitive directories from being
#   copied into the Docker build context.
#
# Build & Run:
#   Development:
#     docker build --target development -t passcraft-node:dev .
#     docker run -p 5000:5000 --env-file .env passcraft-node:dev
#
#   Production:
#     docker build --target production -t passcraft-node:latest .
#     docker run -p 5000:5000 --env-file .env passcraft-node:latest
# ==============================================================
