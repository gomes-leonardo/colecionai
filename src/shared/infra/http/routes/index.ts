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

import { CreateUserController } from "../../../../modules/accounts/useCases/createUser/CreateUserController";
import { AuthenticateUserController } from "../../../../modules/accounts/useCases/authenticateUser/AuthenticateUserController";
import { LoadUserProfileController } from "../../../../modules/accounts/useCases/loadUserProfile/LoadUserProfileController";
import { LogoutUserController } from "../../../../modules/accounts/useCases/logoutUser/LogoutUserController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { validateResource } from "../middlewares/validateResource";
import { CreateForgotPasswordTokenController } from "../../../../modules/accounts/useCases/createForgotPasswordToken/CreateForgotPasswordTokenController";
import { ResetPasswordController } from "../../../../modules/accounts/useCases/resetPassword/ResetPasswordController";
import { ListProductsDetailController } from "../../../../modules/products/useCases/listProductDetails/ListProductsController";
import { VerifyEmailController } from "../../../../modules/accounts/useCases/verifyEmailToken/VerifyEmailTokenController";
import { SendVerificationTokenController } from "../../../../modules/accounts/useCases/sendVerificationToken/SendVerificationTokenController";
import { CreateAuctionController } from "../../../../modules/auctions/useCases/createAuction/CreateAuctionController";
import {
  createAuctionSchema,
  listAuctionsQuerySchema,
} from "../../../../schemas/auctionSchema";
import { createSessionSchema } from "../../../../schemas/sessionSchema";
import { ListAuctionsController } from "../../../../modules/auctions/useCases/listAuctions/ListAuctionsController";
import { ListMyAuctionsController } from "../../../../modules/auctions/useCases/listMyAuctions/ListMyAuctionsController";
import { UpdateAuctionController } from "../../../../modules/auctions/useCases/updateAuction/UpdateAuctionController";
import { DeleteAuctionController } from "../../../../modules/auctions/useCases/deleteAuction/DeleteAuctionController";
import { ListAuctionsDetailsController } from "../../../../modules/auctions/useCases/listAuctionDetails/ListAuctionDetailsController";
import { LoadProfileInformationController } from "../../../../modules/accounts/useCases/loadProfileInformation/LoadProfileInformationController";
import { CreateBidController } from "../../../../modules/bids/useCases/createBid/CreateBidController";
import { ListUserBidsController } from "../../../../modules/bids/useCases/listUserBids/ListUserBidsController";
import { CreateFeedbackController } from "../../../../modules/feedbacks/useCases/createFeedback/CreateFeedbackController";
import { ListFeedbackController } from "../../../../modules/feedbacks/useCases/listFeedbacks/ListFeedbackController";

const router = Router();

const createProductController = new CreateProductController();
const listProductsController = new ListProductsController();
const listUserProductsController = new ListUserProductsController();
const listUserProductDetail = new ListProductsDetailController();
const updateProductController = new UpdateProductController();
const deleteProductController = new DeleteProductController();
const updateProductImageController = new UpdateProductImageController();
const resetPasswordController = new ResetPasswordController();
const verifyEmailToken = new VerifyEmailController();
const sendVerificationToken = new SendVerificationTokenController();
const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();
const loadUserProfileController = new LoadUserProfileController();
const logoutUserController = new LogoutUserController();
const sendPasswordToken = new CreateForgotPasswordTokenController();
const profileInformationController = new LoadProfileInformationController();

const createAuctionController = new CreateAuctionController();
const listAuctionController = new ListAuctionsController();
const listMyAuctionsController = new ListMyAuctionsController();
const listAuctionDetailsController = new ListAuctionsDetailsController();
const updateAuctionController = new UpdateAuctionController();
const deleteAuctionController = new DeleteAuctionController();
const createBidController = new CreateBidController();
const listUserBidsController = new ListUserBidsController();

const createFeedbackController = new CreateFeedbackController();
const listFeedbackController = new ListFeedbackController();

const upload = multer(uploadConfig);

// USERS
router.post(
  "/users",
  validateResource(createUserSchema),
  createUserController.handle
);

router.get("/me", ensureAuthenticated, loadUserProfileController.handle);

router.post("/verify", verifyEmailToken.handle);
router.post("/verify/resend", sendVerificationToken.handle);
router.get("/profile/:id", profileInformationController.handle);
router.post("/forgot-password", sendPasswordToken.handle);
router.post(
  "/reset-password",
  validateResource(updateUserSchema),
  resetPasswordController.handle
);

// SESSIONS / AUTH
router.post(
  "/sessions",
  validateResource(createSessionSchema),
  authenticateUserController.handle
);

router.post("/logout", ensureAuthenticated, logoutUserController.handle);

// PRODUCTS
router.get("/products", listProductsController.handle);

router.get(
  "/products/me",
  ensureAuthenticated,
  listUserProductsController.handle
);

router.get("/products/:id", listUserProductDetail.handle);

router.post(
  "/products",
  ensureAuthenticated,
  validateResource(createProductSchema),
  createProductController.handle
);

router.put(
  "/products/:id",
  ensureAuthenticated,
  validateResource(createProductSchema),
  updateProductController.handle
);

router.delete(
  "/products/:id",
  ensureAuthenticated,
  deleteProductController.handle
);

router.patch(
  "/products/:id/image",
  ensureAuthenticated,
  upload.single("image"),
  updateProductImageController.handle
);

// AUCTIONS
router.post(
  "/auctions",
  ensureAuthenticated,
  validateResource(createAuctionSchema),
  createAuctionController.handle
);
router.get(
  "/auctions",
  validateResource(listAuctionsQuerySchema),
  listAuctionController.handle
);
router.get(
  "/auctions/me",
  ensureAuthenticated,
  listMyAuctionsController.handle
);

router.get("/auctions/details/:id", listAuctionDetailsController.handle);

router.put(
  "/auctions/:id",
  ensureAuthenticated,
  updateAuctionController.handle
);

router.delete(
  "/auctions/:id",
  ensureAuthenticated,
  deleteAuctionController.handle
);

// BIDS

router.post("/bids/", ensureAuthenticated, createBidController.handle);
router.get("/bids/me", ensureAuthenticated, listUserBidsController.handle);

// FEEDBACKS
router.post("/feedback", createFeedbackController.handle);
router.get("/feedbacks", listFeedbackController.handle);

export default router;
