import { Router } from "express";
import { ProductController } from "./controllers/ProductController";

const router = Router();
const productController = new ProductController();

router.get("/", productController.list);
router.post("/", productController.create);
router.delete("/:id", productController.delete);
router.put("/:id", productController.update);

export default router;
