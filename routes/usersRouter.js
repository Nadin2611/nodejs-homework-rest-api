import express from "express";
import { registerSchema } from "../schemas/usersSchemas.js";
import { validateBody, authenticate } from "../middlewares/index.js";
import userControllers from "../controllers/userControllers.js";

const { registerUser, loginUser, logoutUser, getCurrentUser } = userControllers;

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerSchema), registerUser);

usersRouter.post("/login", validateBody(registerSchema), loginUser);

usersRouter.post("/logout", authenticate, logoutUser);

usersRouter.get("/current", authenticate, getCurrentUser);

export default usersRouter;
