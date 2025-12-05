import express from "express";
import router from "./routes";
import cors from "cors";
import { globalError } from "./middlewares/globalError";
import path from "path";

const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());
app.use(router);
app.use("/files", express.static("tmp"));
app.use(globalError);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
