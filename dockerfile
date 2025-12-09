FROM node:20-alpine

WORKDIR /usr/app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Build da aplicação TypeScript
RUN npm run build

# Expor porta
EXPOSE 3333

# Definir ambiente de produção
ENV NODE_ENV=production

# Rodar migrations e iniciar aplicação (API + Worker)
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run start:prod"]