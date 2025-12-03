import { Router } from "express";
import { ProductController } from "./controllers/ProductController";
import { UserController } from "./controllers/UserController";
import { SessionController } from "./controllers/SessionController";
import { ensureAuthenticated } from "./middlewares/ensureAuthenticated";

const router = Router();
const productController = new ProductController();
const userController = new UserController();
const sessionController = new SessionController();

router.post("/users", userController.create);
router.post("/sessions", sessionController.create);
router.get("/products", productController.list);

router.get("/products/me", ensureAuthenticated, productController.listByUserId);
router.post("/products", ensureAuthenticated, productController.create);
router.delete("/products/:id", ensureAuthenticated, productController.delete);
router.put("/products/:id", ensureAuthenticated, productController.update);

export default router;
