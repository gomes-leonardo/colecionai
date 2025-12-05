import { Router } from "express";
import multer from "multer";
import uploadConfig from "../../../../config/upload";

import { CreateProductController } from "../../../../modules/products/useCases/createProduct/CreateProductController";
import { ListProductsController } from "../../../../modules/products/useCases/listProducts/ListProductsController";
import { ListUserProductsController } from "../../../../modules/products/useCases/listUserProduct/ListUserProductsController";
import { UpdateProductController } from "../../../../modules/products/useCases/updateProduct/UpdateProductController";
import { DeleteProductController } from "../../../../modules/products/useCases/deleteProduct/DeleteProductController";
import { UpdateProductImageController } from "../../../../modules/products/useCases/updateBannerProduct/UpdateProductImageController";

import { CreateUserController } from "../../../../modules/accounts/useCases/createUser/CreateUserController";
import { AuthenticateUserController } from "../../../../modules/accounts/useCases/authenticateUser/AuthenticateUserController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const router = Router();

const createProductController = new CreateProductController();
const listProductsController = new ListProductsController();
const listUserProductsController = new ListUserProductsController();
const updateProductController = new UpdateProductController();
const deleteProductController = new DeleteProductController();
const updateProductImageController = new UpdateProductImageController();

const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();

const upload = multer(uploadConfig);

router.post("/users", createUserController.handle);
router.post("/sessions", authenticateUserController.handle);

router.get("/products", listProductsController.handle);
router.get("/products/me", ensureAuthenticated, listUserProductsController.handle);
router.post("/products", ensureAuthenticated, createProductController.handle);
router.delete("/products/:id", ensureAuthenticated, deleteProductController.handle);
router.put("/products/:id", ensureAuthenticated, updateProductController.handle);
router.patch(
  "/products/:id/image",
  ensureAuthenticated,
  upload.single("image"),
  updateProductImageController.handle
);

export default router;
