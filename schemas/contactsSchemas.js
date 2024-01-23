import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleMongooseError } from "../middlewares/index.js";

// const regexName = "^[A-Z][a-z]+ [A-Z][a-z]+$";
// const regexPhone = "^[0-9]{3}-[0-9]{3}-[0-9]{4}$";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

export const Contact = model("contact", contactSchema);

export const createContactSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    // .pattern(new RegExp(regexName))
    .pattern(/^[A-Z][a-z]+ [A-Z][a-z]+$/)
    .required()
    .messages({
      "string.pattern.base": `The name can only contain letters`,
      "any.required": "missing required name field",
    }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.email": `Invalid email format`,
      "any.required": "missing required email field",
    }),
  phone: Joi.string()
    .min(10)
    .max(14)
    // .pattern(new RegExp(regexPhone))
    .pattern(/^[\d() -]+$/)
    .required()
    .messages({
      "string.pattern.base": `A phone number can only contain "digits", "-" and "()"`,
      "any.required": "missing required phone field",
    }),
  favorite: Joi.boolean(),
});

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": "missing field favorite",
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    // .pattern(new RegExp(regexName))
    .pattern(/^[A-Z][a-z]+ [A-Z][a-z]+$/)
    .messages({
      "string.pattern.base": `The name can only contain letters`,
    }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .messages({
      "string.email": `Invalid email format`,
    }),
  phone: Joi.string()
    .min(10)
    .max(14)
    // .pattern(new RegExp(regexPhone))
    .pattern(/^[\d() -]+$/)
    .messages({
      "string.pattern.base": `A phone number can only contain "digits", "-" and "()"`,
    }),
  favorite: Joi.boolean(),
});
