import { Router } from "express";
import { ProductController } from "./controllers/ProductController";
import { UserController } from "./controllers/UserController";

const router = Router();
const productController = new ProductController();
const userController = new UserController();

router.get("/products", productController.list);
router.post("/products", productController.create);
router.delete("/products/:id", productController.delete);
router.put("/products/:id", productController.update);
router.post("/users", userController.create);

export default router;
