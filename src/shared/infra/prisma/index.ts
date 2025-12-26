// #region agent log
import * as fs from "fs";
import * as path from "path";
const prismaClientPath = path.join(process.cwd(), "node_modules", ".prisma", "client");
const prismaClientExists = fs.existsSync(prismaClientPath);
fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/shared/infra/prisma/index.ts:5',message:'Verificando existência do Prisma Client',data:{prismaClientPath,prismaClientExists,expectedPath:prismaClientPath},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H1'})}).catch(()=>{});
// #endregion agent log

// #region agent log
try {
  const prismaPackagePath = path.join(process.cwd(), "node_modules", "@prisma", "client");
  const prismaPackageExists = fs.existsSync(prismaPackagePath);
  fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/shared/infra/prisma/index.ts:12',message:'Verificando pacote @prisma/client',data:{prismaPackagePath,prismaPackageExists},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H2'})}).catch(()=>{});
} catch (err) {
  fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/shared/infra/prisma/index.ts:15',message:'Erro ao verificar pacote @prisma/client',data:{error:err instanceof Error ? err.message : String(err)},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H2'})}).catch(()=>{});
}
// #endregion agent log

// #region agent log
fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/shared/infra/prisma/index.ts:20',message:'Tentando importar PrismaClient ANTES da importação',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H3'})}).catch(()=>{});
// #endregion agent log
import { PrismaClient } from "@prisma/client";

// #region agent log
fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/shared/infra/prisma/index.ts:23',message:'PrismaClient importado com sucesso',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H3'})}).catch(()=>{});
// #endregion agent log

import { PrismaPg } from "@prisma/adapter-pg";
import { pool } from "../../../db";

// #region agent log
fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/shared/infra/prisma/index.ts:28',message:'Criando adapter e instância do PrismaClient',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H4'})}).catch(()=>{});
// #endregion agent log

const adapter = new PrismaPg(pool);

// #region agent log
fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/shared/infra/prisma/index.ts:32',message:'Adapter criado, criando PrismaClient',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H4'})}).catch(()=>{});
// #endregion agent log

const prisma = new PrismaClient({ adapter });

// #region agent log
fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/shared/infra/prisma/index.ts:36',message:'PrismaClient criado com sucesso',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H4'})}).catch(()=>{});
// #endregion agent log

export default prisma;
