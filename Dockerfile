FROM node:24-alpine AS builder

WORKDIR /app

# Install deps first (better caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy source
COPY . .

# Build Vite app
ENV NODE_ENV=production
RUN npm run build


FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]