# 1. Build Stage
FROM node:20-slim as builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY . .


# 2. Runtime Stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "src/server.js"]
