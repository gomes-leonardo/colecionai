# Configuração do Deploy no Render

## Problema Identificado
O worker não estava sendo iniciado em produção porque apenas o servidor estava rodando.

## Solução Implementada

### 1. Script `start` no package.json
O script `start` agora compila o código e inicia tanto o servidor quanto o worker usando `concurrently`:

```json
"start": "sh -c 'if [ ! -d \"dist\" ]; then npm run build; fi && npx prisma migrate deploy && concurrently --names \"SERVER,WORKER\" --prefix-colors \"blue,green\" \"node dist/shared/infra/http/server.js\" \"node dist/job/worker.js\"'"
```

### 2. Configuração no Render

No painel do Render, configure:

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

OU se preferir usar o dockerfile (já configurado):
- O dockerfile já está configurado para usar `npm run start`

### 3. Variáveis de Ambiente Necessárias

Certifique-se de que todas estas variáveis estão configuradas no Render:

- `DATABASE_URL` - URL completa do PostgreSQL
- `REDIS_HOST` - Host do Redis (ex: `redis-xxxxx.render.com`)
- `REDIS_PORT` - Porta do Redis (geralmente `6379`)
- `REDIS_PASSWORD` - Senha do Redis (se necessário)
- `SMTP_HOST` - Host do servidor SMTP
- `SMTP_PORT` - Porta do SMTP (587 para TLS, 465 para SSL)
- `SMTP_USER` - Usuário do SMTP
- `SMTP_PASS` - Senha do SMTP
- `JWT_SECRET` - Chave secreta para JWT
- `NODE_ENV` - Deve ser `production`

### 4. Verificação

Após o deploy, verifique os logs. Você deve ver:

```
[Worker] Iniciando worker...
[Worker] Conectado ao Redis com sucesso
[Worker] Worker está pronto e aguardando jobs...
```

E também os logs do servidor:
```
Server running on http://localhost:10000
```

### 5. Troubleshooting

Se o worker ainda não estiver rodando:

1. **Verifique os logs do Render** - Procure por mensagens do worker
2. **Verifique as variáveis de ambiente** - Especialmente REDIS_HOST e SMTP_*
3. **Verifique se o Redis está acessível** - O worker precisa se conectar ao Redis
4. **Verifique se o código foi compilado** - Deve existir a pasta `dist/`

### 6. Alternativa: Serviço Separado para o Worker

Se preferir rodar o worker em um serviço separado no Render:

1. Crie um novo **Background Worker** no Render
2. Use o mesmo repositório
3. **Start Command:** `npm run worker:prod`
4. Certifique-se de que o código já foi compilado (use o mesmo build do serviço principal)
