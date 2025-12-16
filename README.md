# Colecionai API 🚀

API RESTful completa para marketplace de colecionáveis, desenvolvida com **Clean Architecture**, **Domain-Driven Design** e **TypeScript**. Sistema robusto com leilões em tempo real, autenticação segura, processamento assíncrono e cache distribuído.

## 📋 Sobre o Projeto

O **Colecionai** é uma plataforma backend completa para marketplace de itens colecionáveis (Action Figures, Funko Pops, Mangás, Trading Cards, etc.). O sistema implementa funcionalidades avançadas como leilões em tempo real com WebSockets, sistema de notificações, filas assíncronas e cache distribuído.

### 🎯 Características Principais

- ✅ **Arquitetura Limpa**: Clean Architecture + DDD
- ✅ **Real-time**: WebSockets com Socket.IO para leilões
- ✅ **Performance**: Cache Redis + Processamento Assíncrono
- ✅ **Segurança**: JWT, Rate Limiting, Validação Rigorosa
- ✅ **Escalável**: Filas com BullMQ, Workers, Cache distribuído
- ✅ **Type-Safe**: 100% TypeScript com Prisma ORM
- ✅ **CI/CD**: GitHub Actions + Deploy Automático
- ✅ **Testes**: Unitários e Integração

## 🛠️ Stack Tecnológico

### Core
- **Node.js 20** - Runtime JavaScript
- **TypeScript 5.9** - Tipagem estática
- **Express 5.1** - Framework web

### Banco de Dados
- **PostgreSQL 15** - Banco relacional
- **Prisma 7.1** - ORM type-safe
- **Redis** - Cache e filas

### Autenticação & Segurança
- **JWT** - Autenticação stateless
- **bcryptjs** - Hash de senhas
- **express-rate-limit** - Proteção DDoS
- **Zod** - Validação de schemas

### Real-time & Processamento
- **Socket.IO 4.8** - WebSockets
- **BullMQ 5.65** - Sistema de filas
- **Redis** - Backend para filas

### DevOps
- **Docker** - Containerização
- **GitHub Actions** - CI/CD
- **Render.com** - Deploy em produção

## ✨ Funcionalidades Implementadas

### 🔐 Autenticação e Autorização
- Cadastro com validação rigorosa
- Login com JWT em cookie HTTP-only
- Verificação de email com token
- Recuperação de senha
- Logout seguro

### 📦 Gerenciamento de Produtos
- CRUD completo de produtos
- Upload de imagens (Multer)
- 13 categorias pré-definidas
- 3 condições (Novo, Usado, Caixa Aberta)
- Cache Redis para performance
- Validação de propriedade

### 🎯 Sistema de Leilões
- Criação e gerenciamento de leilões
- Lances em tempo real via WebSocket
- Notificações instantâneas:
  - Novo lance (broadcast)
  - Usuário superado (outbid)
  - Notificação para dono do produto
- Fechamento automático via worker
- Histórico completo de lances

### ⚡ Performance e Escalabilidade
- Cache Redis para listagens e detalhes
- Processamento assíncrono com BullMQ
- Workers para emails e leilões
- Rate limiting configurado
- Queries otimizadas com Prisma



## 📚 Documentação

- **[Documentação Completa](./DOCUMENTACAO_COMPLETA.md)** - Análise detalhada de arquitetura, infraestrutura e decisões técnicas
- **API Endpoints** - Consulte os controllers em `src/modules/*/useCases/*/`

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (v18+)
- Docker e Docker Compose

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/colecionai-backend.git
   cd colecionai-backend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   Copie o `.env.example` e ajuste os valores:
   ```bash
   cp .env.example .env
   ```

### Variáveis de ambiente

- `NODE_ENV`: ambiente de execução (`development`/`production`).
- `JWT_SECRET`: segredo usado para assinar os tokens JWT.
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`: credenciais do PostgreSQL.
- `REDIS_HOST`, `REDIS_PORT`: host e porta do Redis usado pelo BullMQ.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: credenciais para envio de e-mails.

4. **Inicie o Banco de Dados**
   Utilize o Docker para subir o container do PostgreSQL:
   ```bash
   docker-compose up -d
   ```

5. **Execute as Migrations**
   Crie as tabelas no banco de dados:
   ```bash
   npx prisma migrate dev
   ```

6. **Inicie o Servidor**
   ```bash
   npm run dev
   ```
   O servidor estará rodando em `http://localhost:3333`.

7. **(Opcional) Inicie o Worker de Fila**
   Para processamento de e-mails via BullMQ/Redis:
   ```bash
   npx ts-node src/job/worker.ts
   ```

## 🧪 Testes

Para garantir a qualidade do código, execute os testes automatizados:

```bash
npm test
```

## 🏗️ Arquitetura

O projeto segue **Clean Architecture** e **DDD**, organizado em módulos de domínio:

```
src/
├── modules/          # Domínios (Accounts, Products, Auctions, Bids)
│   ├── useCases/    # Lógica de negócio
│   └── repositories/ # Acesso a dados
└── shared/          # Código compartilhado
    ├── container/   # Injeção de dependências
    ├── providers/   # Cache, Mail, Queue
    └── infra/       # HTTP, Prisma
```

### Padrões Implementados
- ✅ Repository Pattern
- ✅ Dependency Injection (TSyringe)
- ✅ Use Case Pattern
- ✅ Provider Pattern
- ✅ Event-Driven Architecture

## 🚀 Deploy

### Produção (Render.com)
- Auto-deploy do branch `main`
- PostgreSQL gerenciado
- Redis gerenciado
- Migrations automáticas
- Health checks configurados

### Desenvolvimento
```bash
docker-compose up -d  # Inicia serviços
npm run dev           # API
npm run worker        # Worker (terminal separado)
```

## 🧪 Testes

```bash
npm test              # Executa todos os testes
npm run test:watch    # Modo watch
```

- Testes unitários com Jest
- Repositories in-memory para isolamento
- CI/CD com GitHub Actions

## 📊 Estatísticas

- **+5000 linhas** de código TypeScript
- **20+ endpoints** REST
- **20+ use cases** implementados
- **4 domínios** principais
- **100% type-safe** com TypeScript + Prisma

## 🎯 Diferenciais Técnicos

- ✅ Arquitetura escalável e manutenível
- ✅ Real-time com WebSockets
- ✅ Cache distribuído com Redis
- ✅ Processamento assíncrono robusto
- ✅ Segurança em todas as camadas
- ✅ CI/CD automatizado
- ✅ Código production-ready

---

**Desenvolvido com dedicação e atenção aos detalhes por Leonardo Rodrigues**

📖 Para documentação completa, consulte [DOCUMENTACAO_COMPLETA.md](./DOCUMENTACAO_COMPLETA.md)
