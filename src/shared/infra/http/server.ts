import "reflect-metadata";
import express from "express";
import router from "./routes";
import "../../../shared/container/index";
import cors from "cors";
import { globalError } from "./middlewares/globalError";
import cookieParser from "cookie-parser";
import { limiter } from "./middlewares/rateLimiter";

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.APP_WEB_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(limiter);
app.use(router);
app.use("/files", express.static("tmp"));
app.use(globalError);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  if (process.env.NODE_ENV === "production") {
    console.log("[Server] Iniciando worker em produção...");
    try {
      require("../../job/worker");
      console.log("[Server] Worker iniciado com sucesso!");
    } catch (err) {
      console.error("[Server] Erro ao iniciar worker:", err);
      console.error("[Server] API continuará rodando sem worker");
    }
  } else {
    console.log("[Server] Modo desenvolvimento - rode 'npm run worker' em terminal separado");
  }
});
