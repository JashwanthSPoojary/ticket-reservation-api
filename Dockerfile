FROM node:18-alpine

# Install dependencies including postgresql-client
RUN apk add --no-cache openssl postgresql-client

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate

COPY . .

# Replace the init script with a Node.js version
COPY scripts/wait-for-db.js ./scripts/wait-for-db.js

RUN npm run build

EXPOSE 3000
CMD ["sh", "-c", "node scripts/wait-for-db.js && npm start"]