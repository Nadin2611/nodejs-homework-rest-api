import express from "express";
import {
  getAllContacts,
  // getContactById,
  // deleteContact,
  createContact,
  // updateContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../shemas/contactsSchemas.js";
// import { isEmptyBody } from "../helpers/isEmptyBody.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

// contactsRouter.get("/:id", getContactById);

// contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

// contactsRouter.put(
//   "/:id",
//   isEmptyBody,
//   validateBody(updateContactSchema),
//   updateContact
// );

export default contactsRouter;
