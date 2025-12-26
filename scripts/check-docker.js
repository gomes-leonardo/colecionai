const { execSync } = require('child_process');

function checkDocker() {
  try {
    execSync('docker info', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

function checkDatabase() {
  try {
    require('dotenv').config();
    const { Pool } = require('pg');
    
    const poolConfig = process.env.DATABASE_URL
      ? { connectionString: process.env.DATABASE_URL }
      : {
          host: process.env.DB_HOST || 'localhost',
          port: Number(process.env.DB_PORT) || 5432,
          user: process.env.DB_USER || 'docker',
          password: process.env.DB_PASS || 'docker',
          database: process.env.DB_NAME || 'colecionai',
        };
    
    poolConfig.connectionTimeoutMillis = 2000;
    
    const pool = new Pool(poolConfig);
    
    return new Promise((resolve) => {
      pool.query('SELECT 1', (err) => {
        pool.end();
        resolve(!err);
      });
    });
  } catch (error) {
    return false;
  }
}

async function main() {
  const dockerRunning = checkDocker();
  
  if (!dockerRunning) {
    console.error('❌ Docker Desktop não está rodando!');
    console.error('');
    console.error('💡 Para iniciar:');
    console.error('   1. Abra o Docker Desktop');
    console.error('   2. Aguarde até aparecer "Docker Desktop is running"');
    console.error('   3. Execute novamente: npm run dev');
    console.error('');
    process.exit(1);
  }
  
  console.log('✅ Docker Desktop está rodando');
  
  const dbAvailable = await checkDatabase();
  
  if (!dbAvailable) {
    console.warn('⚠️  Banco de dados não está acessível');
    console.warn('');
    console.warn('💡 Para iniciar os serviços:');
    console.warn('   npm run services:up');
    console.warn('');
    console.warn('   Ou aguarde alguns segundos e tente novamente');
    console.warn('');
    process.exit(1);
  }
  
  console.log('✅ Banco de dados está acessível');
  process.exit(0);
}

main().catch((error) => {
  console.error('Erro ao verificar serviços:', error.message);
  process.exit(1);
});
