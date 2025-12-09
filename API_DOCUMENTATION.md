# Documentação da API Colecionai

Esta documentação detalha os endpoints disponíveis na API do Colecionai para integração com o Frontend.

## 🌐 Base URL
O servidor de desenvolvimento roda por padrão em:
`http://localhost:3333`

## 🔐 Autenticação
A maioria das rotas requer autenticação.
Para rotas autenticadas, envie o token JWT no header `Authorization`.
**Formato:** `Bearer <token>`

---

## 👤 Usuários (Accounts)

### 1. Criar Usuário
Cria uma nova conta de usuário.

- **Método:** `POST`
- **Rota:** `/users`
- **Body (JSON):**
  ```json
  {
    "name": "Seu Nome",
    "email": "seu@email.com",
    "password": "SenhaForte123!" // Mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial
  }
  ```
- **Resposta Sucesso (201):** Sem conteúdo (ou dados do usuário criado).

### 2. Login (Sessão)
Autentica o usuário e retorna o token JWT e o Refresh Token.

- **Método:** `POST`
- **Rota:** `/sessions`
- **Body (JSON):**
  ```json
  {
    "email": "seu@email.com",
    "password": "SenhaForte123!"
  }
  ```
- **Resposta Sucesso (200):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "id": "uuid-do-usuario",
      "name": "Seu Nome",
      "email": "seu@email.com"
    }
  }
  ```

### 3. Perfil do Usuário (/me)
Retorna os dados do usuário logado.

- **Método:** `GET`
- **Rota:** `/me`
- **Header:** `Authorization: Bearer <token>`
- **Resposta Sucesso (200):** Objeto com dados do usuário (similar ao objeto `user` do login).

### 4. Logout
Encerra a sessão (pode invalidar tokens dependendo da implementação).

- **Método:** `POST`
- **Rota:** `/logout`
- **Header:** `Authorization: Bearer <token>`
- **Resposta Sucesso (200/204):** Confirmação de logout.

---

## 📦 Produtos (Products)

### 1. Listar Todos os Produtos
Lista os produtos disponíveis no marketplace (geralmente com filtros, se implementado).

- **Método:** `GET`
- **Rota:** `/products`
- **Resposta Sucesso (200):** Lista de produtos (Array).

### 2. Listar Meus Produtos
Retorna apenas os produtos cadastrados pelo usuário logado.

- **Método:** `GET`
- **Rota:** `/products/me`
- **Header:** `Authorization: Bearer <token>`
- **Resposta Sucesso (200):** Lista de produtos do usuário.

### 3. Detalhes do Produto
Retorna detalhes completos de um produto específico.

- **Método:** `GET`
- **Rota:** `/products/:id`
- **Params:** `id` (UUID do produto)
- **Resposta Sucesso (200):** Objeto do produto.

### 4. Criar Produto (Passo 1: Dados)
Cria o registro do produto. A imagem é enviada separadamente.

- **Método:** `POST`
- **Rota:** `/products`
- **Header:** `Authorization: Bearer <token>`
- **Body (JSON):**
  ```json
  {
    "name": "Nome do Produto",
    "price": 10000, // Valor em centavos (ex: R$ 100,00)
    "description": "Descrição detalhada do item...",
    "category": "ACTION_FIGURES", // Opções: ACTION_FIGURES, POP, MANGA, etc.
    "condition": "NEW" // Opções: NEW, USED, OPEN_BOX
  }
  ```

### 5. Atualizar Produto (Info)
Atualiza informações textuais do produto.

- **Método:** `PUT`
- **Rota:** `/products/:id`
- **Header:** `Authorization: Bearer <token>`
- **Body (JSON):** Mesmos campos da criação (name, price, etc).

### 6. Upload de Imagem do Produto (Passo 2)
Envia a imagem banner do produto. Deve ser feito após a criação.

- **Método:** `PATCH`
- **Rota:** `/products/:id/image`
- **Header:** `Authorization: Bearer <token>`
- **Content-Type:** `multipart/form-data`
- **Body (Form Data):**
  - `image`: Arquivo da imagem (jpg, png).

### 7. Deletar Produto
Remove um produto do sistema.

- **Método:** `DELETE`
- **Rota:** `/products/:id`
- **Header:** `Authorization: Bearer <token>`

---

## 🔑 Recuperação de Senha

### 1. Esqueci minha senha
Envia um email com o link/token de recuperação.

- **Método:** `POST`
- **Rota:** `/forgot-password`
- **Body:** `{ "email": "seu@email.com" }`

### 2. Resetar Senha
Define uma nova senha usando o token recebido.

- **Método:** `POST`
- **Rota:** `/reset-password`
- **Query Param:** `token=<token_recebido>` (Geralmente enviado via query ou body, verificar implementação específica controller)
- **Body:**
  ```json
  {
    "password": "NovaSenhaForte123!"
  }
  ```
