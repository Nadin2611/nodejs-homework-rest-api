const express = require("express");
const Joi = require("joi");

const contacts = require("../../models/contacts");
const regexName = "^[A-Z][a-z]+ [A-Z][a-z]+$";
const regexPhone = "^[0-9]{3}-[0-9]{3}-[0-9]{4}$";

const { HttpError } = require("../../helpers");

const router = express.Router();

const addShema = Joi.object({
  name: Joi.string().min(3).max(30).pattern(new RegExp(regexName)).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  phone: Joi.string()
    .min(12)
    .max(12)
    .pattern(new RegExp(regexPhone))
    .required(),
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
    const { error } = addShema.validate(req.body);
    if (error) {
      throw HttpError(
        400,
        `Missing required ${error.details[0].context.key} field`
      );
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
    const { error } = addShema.validate(req.body);

    if (error) {
      console.error(error);
      throw HttpError(400, `Missing  fields`);
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
