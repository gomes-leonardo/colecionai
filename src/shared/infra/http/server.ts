import "reflect-metadata";
import express from "express";
import router from "./routes";
import "../../../shared/container/index";
import cors from "cors";
import { globalError } from "./middlewares/globalError";
import cookieParser from "cookie-parser";
import { limiter } from "./middlewares/rateLimiter";

const app = express();
const port = 3333;

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
});
