import express from "express";
import router from "./routes";
import cors from "cors";

const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());
app.use(router);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
