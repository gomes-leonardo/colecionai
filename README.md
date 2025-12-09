# Colecionai API 🚀

Bem-vindo ao repositório da API do **Colecionai**, uma plataforma dedicada ao marketplace de itens colecionáveis. Este projeto foi desenvolvido com foco em boas práticas de engenharia de software, arquitetura limpa e escalabilidade.

## 📋 Sobre o Projeto

O **Colecionai** é uma aplicação backend construída para gerenciar um ecossistema de compra e venda de colecionáveis (como Action Figures, Funko Pops, Mangás, etc.). O sistema gerencia usuários, autenticação segura, e o ciclo de vida dos produtos.

A arquitetura do projeto segue os princípios de **Clean Architecture** e **DDD (Domain-Driven Design)**, garantindo desacoplamento e facilidade de manutenção.

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias e ferramentas:

- **Node.js** & **Express**: Base sólida e performática para a API.
- **TypeScript**: Tipagem estática para maior segurança e produtividade.
- **Prisma ORM**: Manipulação eficiente do banco de dados.
- **PostgreSQL**: Banco de dados relacional robusto.
- **Zod**: Validação de esquemas e dados de entrada.
- **JWT (JSON Web Token)**: Autenticação segura e stateless.
- **Multer**: Upload de imagens dos produtos.
- **Jest**: Testes unitários e de integração.
- **Docker**: Containerização do ambiente de desenvolvimento (Banco de dados).

## ✨ Funcionalidades

- **Gerenciamento de Contas**:
  - Cadastro de usuários.
  - Autenticação (Login) com geração de Token JWT.
  - Validação rigorosa de dados (Email, Senha forte).

- **Gerenciamento de Produtos**:
  - Criação de anúncios de colecionáveis.
  - Upload de imagens do produto.
  - Listagem de produtos disponíveis.
  - Listagem de produtos do próprio usuário.
  - Edição e remoção de produtos.
  - Categorização (Action Figures, Mangás, etc.) e Condição (Novo, Usado).



## 📚 Documentação da API

Para detalhes completos sobre os endpoints, formatos de requisição e resposta, consulte o arquivo [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

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

## 🔮 Roadmap e Próximos Passos

O projeto está em constante evolução. As próximas funcionalidades planejadas são:

- **Sistema de Leilão**: Implementação de lances em tempo real para itens raros.
- **Recuperação de Senha**: Validação de token gerado por email utilizando **Redis** e **BullMQ** para filas de processamento.
- **Pagamentos**: Integração com gateway de pagamentos.

---

Desenvolvido com 💜 por Leonardo Rodrigues.
