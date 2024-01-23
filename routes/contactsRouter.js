import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";

import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

import { isValidId, validateBody, isEmptyBody } from "../middlewares/index.js";

const {
  getAllContacts,
  getContactById,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} = contactsControllers;

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getContactById);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(updateFavoriteSchema),
  updateStatusContact
);

contactsRouter.put(
  "/:id",
  isValidId,
  isEmptyBody,
  validateBody(updateContactSchema),
  updateContact
);

export default contactsRouter;
