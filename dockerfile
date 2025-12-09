FROM node:20-alpine

WORKDIR /usr/app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma
COPY tsconfig.json ./
COPY prisma.config.ts ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY src ./src

# Compilar TypeScript e gerar Prisma Client
RUN npm run build

EXPOSE 3333

# Iniciar servidor e worker (Prisma Client já foi gerado no build)
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]