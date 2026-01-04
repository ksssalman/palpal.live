# Stage 1: Build the work-tracker sub-project
FROM node:20-alpine AS builder

WORKDIR /app

# Copy the work-tracker package files
# We copy only what's needed for install first to cache dependencies
COPY projects/work-tracker/package.json projects/work-tracker/package-lock.json ./projects/work-tracker/

# Install dependencies
WORKDIR /app/projects/work-tracker
RUN npm ci

# Copy the rest of the work-tracker source code
COPY projects/work-tracker ./

# Build the project
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the public directory to the Nginx serving directory
# This ensures the Docker image serves the same content as Firebase Hosting
COPY public /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy and setup entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Copy the built work-tracker artifacts to the appropriate location
COPY --from=builder /app/projects/work-tracker/dist /usr/share/nginx/html/projects/work-tracker

# Expose port 80
EXPOSE 80

# Start Nginx using the entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
