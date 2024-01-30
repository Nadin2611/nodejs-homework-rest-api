import express from "express";
import { registerSchema } from "../schemas/usersSchemas.js";
import { validateBody } from "../middlewares/index.js";
import userControllers from "../controllers/userControllers.js";

const { registerUser } = userControllers;

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerSchema), registerUser);

export default usersRouter;
