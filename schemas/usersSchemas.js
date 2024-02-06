import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleMongooseError } from "../middlewares/index.js";

// const emailRegexp = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    avatarURL: String,
    token: String,
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

export const User = model("user", userSchema);

export const registerSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "string.min": `Password must be at least 6 characters long`,
    "any.required": "missing required password field",
  }),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.email": `Invalid email format`,
      "any.required": "missing required email field",
    }),

  subscription: Joi.string().valid("starter", "pro", "business").messages({
    "any.only":
      "Invalid subscription type. Allowed values are: starter, pro, business",
  }),
});

export const loginSchema = Joi.object({
  password: Joi.string().required().messages({
    "any.required": "missing required password field",
  }),

  email: Joi.string().required().messages({
    "any.required": "missing required email field",
  }),

  subscription: Joi.string().valid("starter", "pro", "business").messages({
    "any.only":
      "Invalid subscription type. Allowed values are: starter, pro, business",
  }),
});

export const subscriptionUpdateSchema = Joi.object({
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .required()
    .messages({
      "any.only":
        "Invalid subscription type. Allowed values are: starter, pro, business",
      "any.required": "missing required subscription field",
    }),
});
