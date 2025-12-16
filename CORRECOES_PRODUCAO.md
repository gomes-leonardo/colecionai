# Correções para Problemas em Produção

## Problemas Identificados e Corrigidos

### 1. ❌ Erro: `Cannot find module '../../shared/container/index'` no AuctionJob.js

**Causa**: O caminho relativo do import estava incorreto. De `src/jobs/AuctionJob.ts` para `src/shared/container/index.ts`, o caminho deveria ser `../../shared/container/index` (subir 2 níveis), mas estava como `../shared/container/index` (subir apenas 1 nível).

**Correção**: 
- ✅ Corrigido `src/jobs/AuctionJob.ts`: `"../shared/container/index"` → `"../../shared/container/index"`
- ✅ Corrigido `src/jobs/MailProvider.ts`: `"../shared/container/index"` → `"../../shared/container/index"`

### 2. ⚠️ Warning: `X-Forwarded-For` header com `trust proxy` false

**Causa**: O Express precisa ter `trust proxy` configurado quando está atrás de um proxy reverso (como em produção com Render, Vercel, etc.) para que o `express-rate-limit` funcione corretamente.

**Correção**: 
- ✅ Adicionado `app.set("trust proxy", true)` no `server.ts` quando `NODE_ENV === "production"`

### 3. 📧 Nodemailer não funciona / Jobs não executam

**Causa**: Os workers não estavam sendo iniciados corretamente devido ao erro de import do container. Além disso, o tratamento de erros não estava mostrando informações suficientes.

**Correção**:
- ✅ Corrigidos os imports nos jobs (problema #1)
- ✅ Melhorado tratamento de erros no `server.ts` para mostrar stack trace completo
- ✅ O container já tinha fallback para ConsoleMailProvider se o nodemailer não estiver disponível

## Como Testar Antes do Deploy

### 1. Teste Local do Build

Execute o script de teste que valida o build:

```bash
npm run build:test
```

Este script:
- ✅ Verifica se todos os arquivos críticos foram compilados
- ✅ Valida a estrutura de diretórios
- ✅ Verifica se os imports estão corretos nos arquivos compilados
- ✅ Verifica se o nodemailer está disponível

### 2. Teste do Worker Localmente

Após o build, teste o worker:

```bash
npm run build
npm run worker:prod
```

Você deve ver:
- ✅ `🔥 Redis conectado com sucesso!`
- ✅ `🚀 Workers estão rodando e aguardando tarefas...`
- ✅ Sem erros de módulo não encontrado

### 3. Teste em Ambiente Docker (Simulando Produção)

```bash
# Build da imagem
docker build -t colecionai-backend .

# Rodar container
docker run -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://..." \
  -e REDIS_HOST=redis \
  -e REDIS_PORT=6379 \
  -e MAIL_PROVIDER=console \
  colecionai-backend
```

## Checklist Antes do Deploy

- [ ] Executar `npm run build:test` e verificar que todos os testes passam
- [ ] Verificar que `dist/jobs/AuctionJob.js` contém o import correto: `../../shared/container/index`
- [ ] Verificar que `dist/jobs/MailProvider.js` contém o import correto: `../../shared/container/index`
- [ ] Verificar variáveis de ambiente em produção:
  - [ ] `NODE_ENV=production`
  - [ ] `MAIL_PROVIDER` (smtp ou console)
  - [ ] Se `MAIL_PROVIDER=smtp`, verificar: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
  - [ ] `REDIS_HOST` e `REDIS_PORT`
- [ ] Verificar logs em produção após deploy:
  - [ ] `[Server] Worker iniciado com sucesso!` (sem erros)
  - [ ] `🚀 Workers estão rodando e aguardando tarefas...`
  - [ ] Se usar SMTP: `[SMTP] ✅ Conexão SMTP verificada com sucesso`
  - [ ] Sem warnings de `X-Forwarded-For`

## Arquivos Modificados

1. `src/jobs/AuctionJob.ts` - Corrigido caminho do import
2. `src/jobs/MailProvider.ts` - Corrigido caminho do import
3. `src/shared/infra/http/server.ts` - Adicionado `trust proxy` e melhorado tratamento de erros
4. `package.json` - Adicionado script `build:test`
5. `scripts/test-build.js` - Novo script de validação do build

## Notas Adicionais

- O `ConsoleMailProvider` é usado como fallback se o nodemailer não estiver disponível ou se `MAIL_PROVIDER=console`
- Os workers são iniciados automaticamente em produção pelo `server.ts`
- Em desenvolvimento, rode `npm run worker` em terminal separado
- O script de teste pode ser executado localmente ou em CI/CD antes do deploy
