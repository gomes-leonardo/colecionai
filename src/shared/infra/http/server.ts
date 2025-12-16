import "reflect-metadata";
import express from "express";
import router from "./routes";
import "../../../shared/container/index";
import cors from "cors";
import { globalError } from "./middlewares/globalError";
import cookieParser from "cookie-parser";
import { limiter } from "./middlewares/rateLimiter";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { verify } from "jsonwebtoken";
import { auctionEvents } from "../../events/auctionEvents";

const app = express();
const port = process.env.PORT || 3333;
const httpServer = createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "https://colecionai-front.vercel.app",
];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());

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
      "Cookie"
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

auctionEvents.on("bid:created", (bid) => {
  console.log(
    `📢 Update Público: Lance de ${bid.amount} no leilão ${bid.auction_id}`
  );
  io.to(bid.auction_id).emit("new_bid", bid);
});

auctionEvents.on("bid:outbid", (data) => {
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

auctionEvents.on("bid:received", (data) => {
  console.log(`💰 OWNER: Avisando dono (${data.username}) sobre novo lance`);

  io.to(data.recipient_id).emit("notification", {
    type: "OWNER_NEW_BID",
    title: "Novo Lance Recebido!",
    message: `Seu produto ${data.productName} recebeu um lance de R$ ${data.amount}.`,
    data,
  });
});

httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  if (process.env.NODE_ENV === "production") {
    console.log("[Server] Iniciando worker em produção...");
    try {
      require("../../../jobs/worker");
      console.log("[Server] Worker iniciado com sucesso!");
    } catch (err) {
      console.error("[Server] Erro ao iniciar worker:", err);
      console.error("[Server] API continuará rodando sem worker");
    }
  } else {
    console.log(
      "[Server] Modo desenvolvimento - rode 'npm run worker' em terminal separado"
    );
  }
});

export { io };
