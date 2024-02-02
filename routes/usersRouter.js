import express from "express";
import {
  registerSchema,
  loginSchema,
  subscriptionUpdateSchema,
} from "../schemas/usersSchemas.js";
import { validateBody, authenticate } from "../middlewares/index.js";
import userControllers from "../controllers/userControllers.js";

const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateSubscription,
} = userControllers;

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerSchema), registerUser);

usersRouter.post("/login", validateBody(loginSchema), loginUser);

usersRouter.post("/logout", authenticate, logoutUser);

usersRouter.get("/current", authenticate, getCurrentUser);

usersRouter.patch(
  "/",
  authenticate,
  validateBody(subscriptionUpdateSchema),
  updateSubscription
);

export default usersRouter;
