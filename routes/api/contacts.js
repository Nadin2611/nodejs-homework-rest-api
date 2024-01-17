const express = require("express");
const Joi = require("joi");

const contacts = require("../../models/contacts");
// const regexName = "^[A-Z][a-z]+ [A-Z][a-z]+$";
// const regexPhone = "^[0-9]{3}-[0-9]{3}-[0-9]{4}$";

const { HttpError } = require("../../helpers");

const router = express.Router();

const addSchema = Joi.object({
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
    .min(8)
    .max(12)
    // .pattern(new RegExp(regexPhone))
    .pattern(/^[\d()-]+$/)
    .messages({
      "string.pattern.base": `A phone number can only contain "digits", "-" and "()"`,
      "any.required": "missing required phone field",
    })
    .required(),
});

const updateSchema = Joi.object({
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
    .min(8)
    .max(12)
    // .pattern(new RegExp(regexPhone))
    .pattern(/^[\d()-]+$/)
    .messages({
      "string.pattern.base": `A phone number can only contain "digits", "-" and "()"`,
    }),
});

router.get("/", async (req, res, next) => {
  try {
    const allContacts = await contacts.listContacts();
    res.json(allContacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactById = await contacts.getContactById(contactId);

    if (!contactById) {
      throw HttpError(404, "Not found");
    }

    res.json(contactById);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const newContact = await contacts.addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await contacts.removeContact(contactId);
    if (!deletedContact) {
      throw HttpError(404, "Not found");
    }
    res.json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, `Missing  fields`);
    }

    const { error } = updateSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const { contactId } = req.params;
    const updatedContact = await contacts.updateContact(contactId, req.body);

    if (!updatedContact) {
      throw HttpError(404, "Not found");
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
