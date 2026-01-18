FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci --ignore-scripts
RUN DATABASE_URL=postgresql://postgres:postgres@localhost:5432/devopsdb npx prisma generate
COPY src ./src
COPY index.js ./

EXPOSE 3000

CMD ["npm", "start"]
