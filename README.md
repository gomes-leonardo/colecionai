# Colecionai API 🚀

Complete RESTful API for collectibles marketplace, built with **Clean Architecture**, **Domain-Driven Design** and **TypeScript**. Robust system with real-time auctions, secure authentication, async processing and distributed cache.

## 📋 About the Project

**Colecionai** is a complete backend platform for collectibles marketplace (Action Figures, Funko Pops, Manga, Trading Cards, etc.). The system implements advanced features like real-time auctions with WebSockets, notification system, async queues and distributed cache.

### 🎯 Key Features

- ✅ **Clean Architecture**: Clean Architecture + DDD
- ✅ **Real-time**: WebSockets with Socket.IO for auctions
- ✅ **Performance**: Redis Cache + Async Processing
- ✅ **Security**: JWT, Rate Limiting, Rigorous Validation
- ✅ **Scalable**: Queues with BullMQ, Workers, Distributed cache
- ✅ **Type-Safe**: 100% TypeScript with Prisma ORM
- ✅ **CI/CD**: GitHub Actions + Automatic Deploy
- ✅ **Tests**: Unit and Integration tests

## 🛠️ Tech Stack

### Core
- **Node.js 20** - JavaScript runtime
- **TypeScript 5.9** - Static typing
- **Express 5.1** - Web framework

### Database
- **PostgreSQL 15** - Relational database
- **Prisma 7.1** - Type-safe ORM
- **Redis** - Cache and queues

### Authentication & Security
- **JWT** - Stateless authentication
- **bcryptjs** - Password hashing
- **express-rate-limit** - DDoS protection
- **Zod** - Schema validation

### Real-time & Processing
- **Socket.IO 4.8** - WebSockets
- **BullMQ 5.65** - Queue system
- **Redis** - Queue backend

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Render.com** - Production deploy

## ✨ Implemented Features

### 🔐 Authentication and Authorization
- Registration with rigorous validation
- Login with JWT in HTTP-only cookie
- Email verification with token
- Password recovery
- Secure logout

### 📦 Product Management
- Complete CRUD for products
- Image upload (Multer)
- 13 predefined categories
- 3 conditions (New, Used, Open Box)
- Redis cache for performance
- Ownership validation

### 🎯 Auction System
- Creation and management of auctions
- Real-time bids via WebSocket
- Instant notifications:
  - New bid (broadcast)
  - User outbid
  - Notification for product owner
- Automatic closure via worker
- Complete bid history

### ⚡ Performance and Scalability
- Redis cache for listings and details
- Async processing with BullMQ
- Workers for emails and auctions
- Rate limiting configured
- Optimized queries with Prisma

## 📚 API Documentation

### Swagger/OpenAPI

The API is fully documented with Swagger. Access the interactive documentation at:

**Development**: http://localhost:3333/api-docs

**Production**: https://your-api-url.com/api-docs

The documentation includes:
- All endpoints with request/response schemas
- Authentication requirements
- Validation rules
- Example requests and responses
- Error codes and messages

### API Endpoints Overview

#### Authentication
- `POST /sessions` - Login
- `POST /logout` - Logout
- `POST /users` - Register
- `GET /me` - Get current user

#### Users
- `POST /verify` - Verify email
- `POST /verify/resend` - Resend verification token
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password

#### Products
- `GET /products` - List products (with filters and pagination)
- `GET /products/:id` - Get product details
- `GET /products/me` - Get user's products
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `PATCH /products/:id/image` - Update product image

#### Auctions
- `GET /auctions` - List auctions (with filters and pagination)
- `GET /auctions/me` - Get user's auctions
- `GET /auctions/details/:id` - Get auction details
- `POST /auctions` - Create auction
- `PUT /auctions/:id` - Update auction
- `DELETE /auctions/:id` - Delete auction

#### Bids
- `POST /bids` - Create bid

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v18+)
- Docker and Docker Compose

### Step by Step

1. **Clone the repository**
   ```bash
   git clone https://github.com/gomes-leonardo/colecionai.git
   cd colecionai/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Copy `.env.example` and adjust values:
   ```bash
   cp .env.example .env
   ```

### Environment Variables

- `NODE_ENV`: execution environment (`development`/`production`).
- `JWT_SECRET`: secret used to sign JWT tokens.
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`: PostgreSQL credentials.
- `REDIS_HOST`, `REDIS_PORT`: Redis host and port used by BullMQ.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: credentials for sending emails.
- `MAIL_PROVIDER`: email provider (`smtp` or `console`).

4. **Start the Database**
   Use Docker to start PostgreSQL container:
   ```bash
   docker-compose up -d
   ```

5. **Run Migrations**
   Create database tables:
   ```bash
   npx prisma migrate dev
   ```

6. **Start the Server**
   ```bash
   npm run dev
   ```
   The server will be running at `http://localhost:3333`.

7. **(Optional) Start Queue Worker**
   For email processing via BullMQ/Redis:
   ```bash
   npm run worker
   ```

8. **Access API Documentation**
   Open your browser and navigate to:
   ```
   http://localhost:3333/api-docs
   ```

## 🧪 Testing

To ensure code quality, run automated tests:

```bash
npm test
```

## 🏗️ Architecture

The project follows **Clean Architecture** and **DDD**, organized in domain modules:

```
src/
├── modules/          # Domains (Accounts, Products, Auctions, Bids)
│   ├── useCases/    # Business logic
│   └── repositories/ # Data access
└── shared/          # Shared code
    ├── container/   # Dependency injection
    ├── providers/   # Cache, Mail, Queue
    └── infra/       # HTTP, Prisma
```

### Implemented Patterns
- ✅ Repository Pattern
- ✅ Dependency Injection (TSyringe)
- ✅ Use Case Pattern
- ✅ Provider Pattern
- ✅ Event-Driven Architecture

## 🚀 Deploy

### Production (Render.com)
- Auto-deploy from `main` branch
- Managed PostgreSQL
- Managed Redis
- Automatic migrations
- Health checks configured

### Development
```bash
docker-compose up -d  # Start services
npm run dev           # API
npm run worker        # Worker (separate terminal)
```

## 📊 Statistics

- **+5000 lines** of TypeScript code
- **20+ endpoints** REST
- **20+ use cases** implemented
- **4 main domains**
- **100% type-safe** with TypeScript + Prisma

## 🎯 Technical Highlights

- ✅ Scalable and maintainable architecture
- ✅ Real-time with WebSockets
- ✅ Distributed cache with Redis
- ✅ Robust async processing
- ✅ Security in all layers
- ✅ Automated CI/CD
- ✅ Production-ready code

## 📖 Additional Documentation

- **[Portuguese README](./README.pt-BR.md)** - Documentação em português
- **[Complete Documentation](./DOCUMENTACAO_COMPLETA.md)** - Detailed architecture, infrastructure and technical decisions analysis

---

**Developed with dedication and attention to detail by Leonardo Rodrigues**
