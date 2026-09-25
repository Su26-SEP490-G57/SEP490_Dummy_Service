FROM node:24.18.0-alpine
WORKDIR /app

ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --ignore-scripts --omit=dev
COPY dist ./dist

EXPOSE 4000

CMD ["node", "dist/main"]
