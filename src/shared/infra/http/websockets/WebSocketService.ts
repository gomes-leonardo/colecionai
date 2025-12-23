import { Server } from "socket.io";
import { createServer } from "node:http";
import { verify } from "jsonwebtoken";
import { AuctionHandler } from "./handlers/AuctionHandler";
import { MessageHandler } from "./handlers/MessageHandler";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const allowedOrigins = [
  "http://localhost:3000",
  "https://colecionai-front.vercel.app",
];

export class WebSocketService {
  private io: Server;

  private auctionHandler = new AuctionHandler();
  private messageHandler = new MessageHandler();

  constructor(httpServer: any) {
    this.io = new Server(httpServer, {
      cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.setupRedisAdapter();

    this.setupMiddleware();
    this.setupListeners();
  }

  private setupRedisAdapter() {
    if (!process.env.REDIS_URL) {
      console.warn(
        "⚠️ REDIS_URL não definida. Rodando Socket.io em memória (Single Node)."
      );
      return;
    }

    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();

    let adapterErrorLogged = false;
    pubClient.on("error", (err: any) => {
      if (err?.code === "ECONNREFUSED" && process.env.NODE_ENV !== "production") {
        if (!adapterErrorLogged) {
          console.warn("⚠️  Redis Adapter não disponível. Socket.io rodando em memória.");
          adapterErrorLogged = true;
        }
        return;
      }
      console.error("❌ Redis Pub Error:", err);
    });
    
    subClient.on("error", (err: any) => {
      if (err?.code === "ECONNREFUSED" && process.env.NODE_ENV !== "production") {
        return;
      }
      console.error("❌ Redis Sub Error:", err);
    });

    Promise.all([pubClient.connect(), subClient.connect()])
      .then(() => {
        this.io.adapter(createAdapter(pubClient, subClient));
        console.log("🔌 Redis Adapter conectado com sucesso!");
      })
      .catch((err: any) => {
        if (err?.code === "ECONNREFUSED" && process.env.NODE_ENV !== "production") {
          if (!adapterErrorLogged) {
            console.warn("⚠️  Redis Adapter não disponível. Socket.io rodando em memória.");
            adapterErrorLogged = true;
          }
          return;
        }
        console.error("❌ Falha ao conectar Redis Adapter:", err);
      });
  }

  private setupMiddleware() {
    this.io.use((socket, next) => {
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) return next(new Error("Token missing"));

      const tokenMatch = cookies.match(/token=([^;]+)/);
      const token = tokenMatch ? tokenMatch[1] : null;

      if (!token) return next(new Error("Token missing"));

      try {
        if (!process.env.JWT_SECRET)
          return next(new Error("JWT secret missing"));
        const { sub } = verify(token, process.env.JWT_SECRET);
        (socket as any).user_id = sub;
        return next();
      } catch (error) {
        return next(new Error("Invalid token"));
      }
    });
  }

  private setupListeners() {
    this.auctionHandler.registerGlobalListeners(this.io);
    this.messageHandler.registerGlobalListeners(this.io);

    this.io.on("connection", (socket) => {
      const user_id = (socket as any).user_id;

      socket.join(user_id);
      console.log(`⚡ Usuário conectado: ${user_id}`);

      this.auctionHandler.registerSocketHandlers(socket);
      this.messageHandler.registerSocketHandlers(socket);

      socket.on("disconnect", () => {});
    });
  }

  public getIO() {
    return this.io;
  }
}
