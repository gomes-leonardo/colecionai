import "reflect-metadata";
import dotenv from "dotenv";
import { verify } from "jsonwebtoken";
dotenv.config();

if (process.env.NODE_ENV !== 'production') {
  const originalConsoleError = console.error;
  let redisErrorSuppressed = false;
  
  console.error = function (...args: any[]): void {
    const firstArg = args[0];
    const message = firstArg?.message || String(firstArg || '');
    const stack = firstArg?.stack || '';
    
    if ((message.includes('ECONNREFUSED') || message.includes('Connection is closed')) && 
        (message.includes('6379') || stack.includes('Redis') || stack.includes('ioredis'))) {
      if (!redisErrorSuppressed) {
        redisErrorSuppressed = true;
        return;
      }
      return;
    }
    
    originalConsoleError.apply(console, args);
  };
}
import express from "express";
import router from "./routes";
import "../../../shared/container/index";
import cors from "cors";
import { globalError } from "./middlewares/globalError";
import cookieParser from "cookie-parser";
import { limiter } from "./middlewares/rateLimiter";
import { createServer } from "node:http";
import { Server } from "socket.io";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import "./swagger-docs";
import { WebSocketService } from "./websockets/WebSocketService";
import { auctionEvents } from "../../events/auctionEvents";

const app = express();
const port = process.env.PORT || 3333;
const httpServer = createServer(app);
const webSocketService = new WebSocketService(httpServer);

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", true);
}

const allowedOrigins = [
  "http://localhost:3000",
  "https://colecionai-front.vercel.app",
];

const io = webSocketService.getIO();

app.use(express.json());
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Cookie",
    ],
    exposedHeaders: ["Set-Cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(limiter);
app.use(router);
app.use("/files", express.static("tmp"));
app.use(globalError);

io.use((socket, next) => {
  const cookies = socket.handshake.headers.cookie;

  if (!cookies) {
    return next(new Error("Token missing"));
  }

  const tokenMatch = cookies.match(/token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  if (!token) {
    return next(new Error("Token missing"));
  }

  try {
    if (!process.env.JWT_SECRET) return next(new Error("JWT secret missing"));

    const { sub } = verify(token, process.env.JWT_SECRET);
    (socket as any).user_id = sub;

    return next();
  } catch (error) {
    return next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  const user_id = (socket as any).user_id;

  socket.join(user_id);

  console.log(`⚡ Usuário conectado: ${user_id}`);

  socket.on("join_auction", ({ auction_id }) => {
    socket.join(auction_id);
  });

  socket.on("leave_auction", ({ auction_id }) => {
    socket.leave(auction_id);
  });
});

auctionEvents.on("bid:created", (bid: { user: string; amount: number; auction_id: string }) => {
  console.log(
    `📢 Update Público: Lance de ${bid.amount} no leilão ${bid.auction_id}`
  );
  io.to(bid.auction_id).emit("new_bid", bid);
});

auctionEvents.on("bid:outbid", (data: { recipient_id: string; username: string; newAmount: number; productName: string }) => {
  console.log(
    `⚠️ OUTBID: Avisando ${data.username} que perdeu para ${data.newAmount}`
  );

  io.to(data.recipient_id).emit("notification", {
    type: "OUTBID",
    title: "Você foi superado!",
    message: `Alguém deu um lance de R$ ${data.newAmount} em ${data.productName}.`,
    data,
  });
});

auctionEvents.on("bid:received", (data: { recipient_id: string; username: string; amount: number; productName: string }) => {
  console.log(`💰 OWNER: Avisando dono (${data.username}) sobre novo lance`);

  io.to(data.recipient_id).emit("notification", {
    type: "OWNER_NEW_BID",
    title: "Novo Lance Recebido!",
    message: `Seu produto ${data.productName} recebeu um lance de R$ ${data.amount}.`,
    data,
  });
});

async function checkDatabaseHealth() {
  try {
    const { pool } = await import("../../../db");
    
    const result = await Promise.race([
      pool.query("SELECT 1"),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), 3000)
      )
    ]) as any;
    
    return true;
  } catch (error: any) {
    
    if (error?.message === 'TIMEOUT') {
      console.error('');
      console.error('❌ Timeout ao conectar ao banco de dados!');
      console.error('');
      console.error('💡 O banco pode estar iniciando. Aguarde alguns segundos e recarregue.');
      console.error('');
      return false;
    }
    
    if (error?.code === 'ECONNREFUSED' || error?.message?.includes('ECONNREFUSED')) {
      console.error('');
      console.error('❌ Banco de dados não está disponível!');
      console.error('');
      console.error('💡 Verifique se:');
      console.error('   1. Container "colecionai" está rodando no Docker Desktop');
      console.error('   2. Porta 5432 está mapeada corretamente');
      console.error('   3. Tente reiniciar o container: docker restart colecionai');
      console.error('');
      return false;
    }
    
    console.error('');
    console.error('❌ Erro ao verificar banco de dados:', error?.message || error);
    console.error('');
    return false;
  }
}

httpServer.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  
  if (process.env.NODE_ENV !== 'production') {
    const dbHealthy = await checkDatabaseHealth();
    if (!dbHealthy) {
      console.warn('⚠️  Servidor iniciado, mas banco de dados não está disponível');
      console.warn('   Algumas funcionalidades podem não funcionar corretamente');
    }
  }
  
  if (process.env.NODE_ENV === "production") {
    console.log("[Server] Iniciando worker em produção...");
    try {
      require("../../../shared/container/index");
      require("../../../jobs/worker");
      console.log("[Server] Worker iniciado com sucesso!");
    } catch (err: any) {
      console.error("[Server] Erro ao iniciar worker:", err?.message || err);
      if (err?.stack) {
        console.error("[Server] Stack trace:", err.stack);
      }
      console.error("[Server] API continuará rodando sem worker");
    }
  } else {
    console.log(
      "[Server] Modo desenvolvimento - rode 'npm run worker' em terminal separado"
    );
  }
}).on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${port} já está em uso!`);
    console.error(`💡 Execute: lsof -ti:${port} | xargs kill -9`);
  } else {
    console.error('❌ Erro ao iniciar servidor:', err.message);
  }
  process.exit(1);
});

export { io };
