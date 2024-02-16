import express from "express";
import {
  registerSchema,
  loginSchema,
  subscriptionUpdateSchema,
  emailShema,
} from "../schemas/usersSchemas.js";
import { validateBody, authenticate, upload } from "../middlewares/index.js";
import userControllers from "../controllers/userControllers.js";

const {
  registerUser,
  verifyUserEmail,
  resendVerifyEmail,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
} = userControllers;

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerSchema), registerUser);

usersRouter.get("/verify/:verificationToken", verifyUserEmail);

usersRouter.post("/verify", validateBody(emailShema), resendVerifyEmail);

usersRouter.post("/login", validateBody(loginSchema), loginUser);

usersRouter.post("/logout", authenticate, logoutUser);

usersRouter.get("/current", authenticate, getCurrentUser);

usersRouter.patch(
  "/",
  authenticate,
  validateBody(subscriptionUpdateSchema),
  updateSubscription
);

usersRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);

export default usersRouter;
