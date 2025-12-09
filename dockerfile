FROM node:20-alpine

WORKDIR /usr/app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Definir DATABASE_URL temporária para build (será sobrescrita em runtime)
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db?schema=public"

# Gerar Prisma Client ANTES do build
RUN npx prisma generate

# Build da aplicação TypeScript
RUN npm run build

# Expor porta
EXPOSE 3333

# Definir ambiente de produção
ENV NODE_ENV=production

# Rodar migrations e iniciar aplicação (API + Worker)
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]