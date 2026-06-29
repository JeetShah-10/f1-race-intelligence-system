# Step 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments needed by Vite during compile time
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_API_BASE_URL

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
    VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy package files and install dependencies
COPY package.json package-lock.json /app/
RUN npm ci

# Copy source code and build
COPY . /app/
RUN npm run build

# Step 2: Serve static files with Nginx (unprivileged, non-root)
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
