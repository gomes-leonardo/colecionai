import { Router } from "express";
import multer from "multer";
import uploadConfig from "../../../../config/upload";

import { CreateProductController } from "../../../../modules/products/useCases/createProduct/CreateProductController";
import { ListProductsController } from "../../../../modules/products/useCases/listProducts/ListProductsController";
import { ListUserProductsController } from "../../../../modules/products/useCases/listUserProduct/ListUserProductsController";
import { UpdateProductController } from "../../../../modules/products/useCases/updateProduct/UpdateProductController";
import { DeleteProductController } from "../../../../modules/products/useCases/deleteProduct/DeleteProductController";
import { UpdateProductImageController } from "../../../../modules/products/useCases/updateBannerProduct/UpdateProductImageController";
import { createProductSchema } from "../../../../schemas/productSchema";
import {
  createUserSchema,
  updateUserSchema,
} from "../../../../schemas/userSchema";
import { sessionSchema } from "../../../../schemas/sessionSchema";

import { CreateUserController } from "../../../../modules/accounts/useCases/createUser/CreateUserController";
import { AuthenticateUserController } from "../../../../modules/accounts/useCases/authenticateUser/AuthenticateUserController";
import { LoadUserProfileController } from "../../../../modules/accounts/useCases/loadUserProfile/LoadUserProfileController";
import { LogoutUserController } from "../../../../modules/accounts/useCases/logoutUser/LogoutUserController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { validateResource } from "../middlewares/validateResource";
import { CreateForgotPasswordTokenController } from "../../../../modules/accounts/useCases/createForgotPasswordToken/CreateForgotPasswordTokenController";
import { ResetPasswordController } from "../../../../modules/accounts/useCases/resetPassword/ResetPasswordController";

const router = Router();

const createProductController = new CreateProductController();
const listProductsController = new ListProductsController();
const listUserProductsController = new ListUserProductsController();
const updateProductController = new UpdateProductController();
const deleteProductController = new DeleteProductController();
const updateProductImageController = new UpdateProductImageController();
const resetPasswordController = new ResetPasswordController();

const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();
const loadUserProfileController = new LoadUserProfileController();
const logoutUserController = new LogoutUserController();
const sendPasswordToken = new CreateForgotPasswordTokenController();

const upload = multer(uploadConfig);

router.post(
  "/users",
  validateResource(createUserSchema),
  createUserController.handle
);
router.post(
  "/sessions",
  validateResource(sessionSchema),
  authenticateUserController.handle
);
router.post("/logout", ensureAuthenticated, logoutUserController.handle);
router.get("/me", ensureAuthenticated, loadUserProfileController.handle);

router.get("/products", listProductsController.handle);
router.get(
  "/products/me",
  ensureAuthenticated,
  listUserProductsController.handle
);
router.post(
  "/products",
  ensureAuthenticated,
  validateResource(createProductSchema),
  createProductController.handle
);
router.delete(
  "/products/:id",
  ensureAuthenticated,
  deleteProductController.handle
);
router.put(
  "/products/:id",
  ensureAuthenticated,
  validateResource(createProductSchema),
  updateProductController.handle
);
router.patch(
  "/products/:id/image",
  ensureAuthenticated,
  upload.single("image"),
  updateProductImageController.handle
);

router.post("/forgot-password", sendPasswordToken.handle);
router.post(
  "/reset-password",
  validateResource(updateUserSchema),
  resetPasswordController.handle
);

export default router;
