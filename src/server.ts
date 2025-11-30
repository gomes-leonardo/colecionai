import express from "express";
import router from "./routes";

const app = express();
const port = 3333;

app.use(express.json());

app.use("/products", router);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
