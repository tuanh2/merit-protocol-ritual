# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install

# Copy source code and build
COPY frontend/ ./
RUN npm run build

# Production Nginx Stage
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static assets from builder
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
