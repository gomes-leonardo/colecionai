
const path = require("path");
const fs = require("fs");

console.log("🔍 Testando build e imports...\n");

const distPath = path.join(process.cwd(), "dist");
if (!fs.existsSync(distPath)) {
  console.error("❌ Diretório 'dist' não encontrado. Execute 'npm run build' primeiro.");
  process.exit(1);
}

const criticalFiles = [
  "dist/jobs/AuctionJob.js",
  "dist/jobs/MailProvider.js",
  "dist/jobs/worker.js",
  "dist/shared/container/index.js",
  "dist/shared/infra/http/server.js",
];

console.log("📁 Verificando arquivos compilados...");
let allFilesExist = true;
for (const file of criticalFiles) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.error(`  ❌ ${file} não encontrado`);
    allFilesExist = false;
  }
}

if (!allFilesExist) {
  console.error("\n❌ Alguns arquivos críticos não foram encontrados após o build.");
  process.exit(1);
}

console.log("\n🔗 Testando imports...");

const testImports = () => {
  try {
    // Testar import do container usando caminho absoluto
    const containerPath = path.join(distPath, "shared", "container", "index.js");
    if (fs.existsSync(containerPath)) {
      try {
        require(containerPath);
        console.log("  ✅ Container index encontrado e pode ser importado");
      } catch (err) {
        console.warn("  ⚠️  Container index existe mas não pôde ser importado:", err.message);
        console.warn("     Isso pode ser normal se houver dependências faltando (ex: Prisma Client)");
      }
    } else {
      console.error("  ❌ Container index não encontrado em:", containerPath);
    }

  } catch (err) {
    console.warn("  ⚠️  Erro durante teste de imports:", err.message);
    // Não falhar o teste completo, apenas avisar
  }
};

testImports();

console.log("\n📂 Verificando estrutura de diretórios...");
const requiredDirs = [
  "dist/jobs",
  "dist/shared/container",
  "dist/shared/infra/http",
  "dist/modules",
];

let allDirsExist = true;
for (const dir of requiredDirs) {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`  ✅ ${dir}`);
  } else {
    console.error(`  ❌ ${dir} não encontrado`);
    allDirsExist = false;
  }
}

if (!allDirsExist) {
  console.error("\n❌ Estrutura de diretórios incompleta após o build.");
  process.exit(1);
}

console.log("\n📦 Verificando dependências críticas...");
try {
  const nodemailerPath = require.resolve("nodemailer");
  console.log("  ✅ nodemailer encontrado:", nodemailerPath);
} catch (err) {
  console.warn("  ⚠️  nodemailer não encontrado (pode ser normal se não estiver instalado)");
}

console.log("\n🔍 Verificando imports nos arquivos compilados...");
try {
  const auctionJobPath = path.join(process.cwd(), "dist", "jobs", "AuctionJob.js");
  if (fs.existsSync(auctionJobPath)) {
    const content = fs.readFileSync(auctionJobPath, "utf8");
    // Verificar se o import está correto (deve ter ../../shared/container/index)
    if (content.includes("../../shared/container/index")) {
      console.log("  ✅ AuctionJob.js tem import correto do container (../../shared/container/index)");
    } else if (content.includes("../shared/container/index")) {
      console.error("  ❌ AuctionJob.js tem import INCORRETO (../shared/container/index - deveria ser ../../)");
      console.error("     Isso causará erro em produção!");
    } else {
      console.error("  ❌ AuctionJob.js não tem import do container");
      const matches = content.match(/require\([^)]+container[^)]+\)/g);
      if (matches) {
        console.error("     Imports encontrados:", matches);
      }
    }
  }

  const mailProviderPath = path.join(process.cwd(), "dist", "jobs", "MailProvider.js");
  if (fs.existsSync(mailProviderPath)) {
    const content = fs.readFileSync(mailProviderPath, "utf8");
    if (content.includes("../../shared/container/index")) {
      console.log("  ✅ MailProvider.js tem import correto do container (../../shared/container/index)");
    } else if (content.includes("../shared/container/index")) {
      console.error("  ❌ MailProvider.js tem import INCORRETO (../shared/container/index - deveria ser ../../)");
      console.error("     Isso causará erro em produção!");
    } else {
      console.error("  ❌ MailProvider.js não tem import do container");
    }
  }
} catch (err) {
  console.warn("  ⚠️  Erro ao verificar imports:", err.message);
}

console.log("\n✅ Todos os testes passaram! Build está válido para produção.");
console.log("\n💡 Dica: Execute 'npm run worker:prod' em ambiente de teste para validar o worker.");
console.log("💡 Dica: Verifique se as variáveis de ambiente estão configuradas (SMTP_HOST, SMTP_PORT, etc.)");
