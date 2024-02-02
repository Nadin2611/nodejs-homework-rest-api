import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";

import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

import {
  isValidId,
  validateBody,
  isEmptyBody,
  authenticate,
} from "../middlewares/index.js";

const {
  getAllContacts,
  getContactById,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} = contactsControllers;

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", authenticate, isValidId, getContactById);

contactsRouter.delete("/:id", authenticate, isValidId, deleteContact);

contactsRouter.post(
  "/",
  authenticate,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  validateBody(updateFavoriteSchema),
  updateStatusContact
);

contactsRouter.put(
  "/:id",
  authenticate,
  isValidId,
  isEmptyBody,
  validateBody(updateContactSchema),
  updateContact
);

export default contactsRouter;
