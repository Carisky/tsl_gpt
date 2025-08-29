FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm ci || npm install

COPY tsconfig.json ./
COPY prisma ./prisma
RUN npx prisma generate || echo "prisma generate skipped"

COPY src ./src

EXPOSE 3300

CMD ["sh", "-c", "npx prisma migrate deploy || npx prisma db push && npm run dev"]

