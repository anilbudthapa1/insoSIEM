FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime

WORKDIR /app
RUN npm install -g vite@5.4.21
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["vite", "preview", "--host", "0.0.0.0", "--port", "3000"]
