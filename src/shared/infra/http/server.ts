import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

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

httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
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
});

export { io };
