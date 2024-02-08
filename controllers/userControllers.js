import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "path";
import { rename } from "fs/promises";
import Jimp from "jimp";

import { User } from "../schemas/usersSchemas.js";
import { HttpError, ctrlWrapper } from "../helpers/index.js";

const { SECRET_KEY } = process.env;
const avatarDir = path.resolve("public", "avatars");

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
  const { email: userEmail, subscription } = newUser;

  res.status(201).json({
    user: {
      email: userEmail,
      subscription,
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: { email, subscription: user.subscription },
  });
};

const logoutUser = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const updateSubscription = async (req, res) => {
  const { subscription } = req.body;
  const { _id } = req.user;

  const updatedUserSubscription = await User.findByIdAndUpdate(
    _id,
    {
      subscription,
    },
    { new: true }
  );
  res.json(updatedUserSubscription);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  if (!req.file) {
    throw HttpError(400, "Please attach your avatar");
  }
  const { path: tempUpload, originalname } = req.file;
  const fileName = `${_id}_${originalname}`;
  const resultUpLoad = path.resolve(avatarDir, fileName);

  const avatar = await Jimp.read(tempUpload);
  await avatar.resize(250, 250).write(tempUpload);

  await rename(tempUpload, resultUpLoad);

  const avatarURL = `avatars/${fileName}`;

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL: avatarURL });
};

export default {
  registerUser: ctrlWrapper(registerUser),
  loginUser: ctrlWrapper(loginUser),
  logoutUser: ctrlWrapper(logoutUser),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
