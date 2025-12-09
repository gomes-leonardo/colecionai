
const net = require('net');

const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT || '5432', 10);
const timeout = parseInt(process.env.WAIT_TIMEOUT || '60000', 10);
const interval = parseInt(process.env.WAIT_INTERVAL || '1000', 10);

const startTime = Date.now();

function checkConnection() {
  return new Promise((resolve, reject) => {
    const client = net.createConnection({ host, port }, () => {
      console.log(`✅ PostgreSQL está pronto em ${host}:${port}`);
      client.end();
      resolve(true);
    });

    client.on('error', (err) => {
      client.destroy();
      reject(err);
    });

    client.setTimeout(5000, () => {
      client.destroy();
      reject(new Error('Connection timeout'));
    });
  });
}

async function waitForDatabase() {
  console.log(`⏳ Aguardando PostgreSQL em ${host}:${port}...`);

  while (true) {
    const elapsed = Date.now() - startTime;
    
    if (elapsed > timeout) {
      console.error(`❌ Timeout: PostgreSQL não ficou disponível em ${timeout}ms`);
      process.exit(1);
    }

    try {
      await checkConnection();
      process.exit(0);
    } catch (err) {
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
}

waitForDatabase().catch((err) => {
  console.error('Erro ao aguardar PostgreSQL:', err.message);
  process.exit(1);
});
