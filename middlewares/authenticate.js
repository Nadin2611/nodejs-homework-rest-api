import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { User } from "../schemas/usersSchemas.js";
import { HttpError } from "../helpers/index.js";

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  console.log(bearer);
  console.log(token);

  if (bearer !== "Bearer") {
    next(HttpError(401));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "Not authorized"));
    }
    req.user = user;
    next();
  } catch {
    next(HttpError(401));
  }
};

export default authenticate;
