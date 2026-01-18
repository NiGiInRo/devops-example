FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY prisma ./prisma
COPY prisma.config.ts ./
COPY src ./src
COPY index.js ./

EXPOSE 3000

CMD ["npm", "start"]
