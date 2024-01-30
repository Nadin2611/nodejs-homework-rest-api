import { User } from "../schemas/usersSchemas.js";
import { HttpError, ctrlWrapper } from "../helpers/index.js";

const registerUser = async (req, res) => {
  const { email: userEmail } = req.body;
  const user = await User.findOne({ userEmail });

  if (user) {
    throw HttpError(409, "Email in use");
  }
  const newUser = await User.create(req.body);
  const { email, subscription } = newUser;

  res.status(201).json({
    user: {
      email,
      subscription,
    },
  });
};

export default {
  registerUser: ctrlWrapper(registerUser),
};
