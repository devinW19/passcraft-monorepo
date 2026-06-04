# ==============================================================
# FILE: frontend/Dockerfile
# ==============================================================
# OWNER:        Team Member 3 (DevOps / Infrastructure Engineer)
# TECHNOLOGIES: Docker, Node.js 20 (Alpine), Nginx (Alpine),
#               Vite, npm, Multi-Stage Build
#
# INSTRUCTIONS FOR TEAM MEMBER 3:
# ─────────────────────────────────────────────────────────────
# This Dockerfile uses a multi-stage build strategy to produce
# a minimal, production-ready container image. Stage 1 uses
# Node to build the React app. Stage 2 uses Nginx to serve the
# compiled static assets efficiently. A separate dev target
# is also supported for hot-reloading during development.
#
# STEPS TO IMPLEMENT:
#
# Stage 1 — Development (optional, for docker compose dev workflow):
#   FROM node:20-alpine AS development
#   - Set WORKDIR to /app.
#   - COPY package.json and package-lock.json first (for Docker
#     layer caching — npm install only re-runs if these change).
#   - RUN npm install  (installs all devDependencies too).
#   - COPY . .  (copy the full source).
#   - EXPOSE 5173  (Vite's default dev server port).
#   - CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
#     (--host 0.0.0.0 makes Vite accessible outside the container.)
#
# Stage 2 — Builder:
#   FROM node:20-alpine AS builder
#   - Set WORKDIR to /app.
#   - ARG VITE_NODE_API_URL and ARG VITE_FLASK_API_URL
#     (Accept build-time arguments for API URLs so production
#     builds target the correct endpoints.)
#   - ENV VITE_NODE_API_URL=$VITE_NODE_API_URL
#   - ENV VITE_FLASK_API_URL=$VITE_FLASK_API_URL
#   - COPY package*.json ./
#   - RUN npm ci  (ci is faster and more reproducible than install
#     for production builds — uses package-lock.json exactly.)
#   - COPY . .
#   - RUN npm run build
#     (Vite will output compiled static files to /app/dist.)
#
# Stage 3 — Production (Nginx Serving):
#   FROM nginx:stable-alpine AS production
#   - COPY --from=builder /app/dist /usr/share/nginx/html
#     (Copy built static files into Nginx's default serve root.)
#   - COPY nginx.conf /etc/nginx/conf.d/default.conf
#     (Provide a custom Nginx config — see Note below.)
#   - EXPOSE 80
#   - CMD ["nginx", "-g", "daemon off;"]
#
# Nginx Configuration (nginx.conf) — Team Member 3 must also
# create this file alongside the Dockerfile:
#   - Configure the server block to listen on port 80.
#   - Set root to /usr/share/nginx/html.
#   - Add try_files $uri $uri/ /index.html; for SPA routing
#     (without this, direct URL access like /dashboard would 404).
#   - Enable gzip compression for text/html, text/css,
#     application/javascript.
#   - Set cache-control headers:
#       - index.html: no-cache (so updated deployments are served).
#       - JS/CSS assets: max-age=31536000 (1 year, immutable).
#
# Usage:
#   Development:
#     docker build --target development -t passcraft-frontend:dev .
#     docker run -p 5173:5173 -v $(pwd):/app passcraft-frontend:dev
#
#   Production:
#     docker build --target production \
#       --build-arg VITE_NODE_API_URL=https://api.passcraft.io \
#       -t passcraft-frontend:latest .
#     docker run -p 80:80 passcraft-frontend:latest
# ==============================================================
