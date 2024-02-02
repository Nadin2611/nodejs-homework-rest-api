import { Contact } from "../schemas/contactsSchemas.js";
import { HttpError, ctrlWrapper } from "../helpers/index.js";

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const allContacts = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email");
  res.json(allContacts);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const contactById = await Contact.findById(id, "-createdAt -updatedAt");

  if (!contactById) {
    throw HttpError(404);
  }

  res.json(contactById);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const deletedContact = await Contact.findByIdAndDelete(id);
  if (!deletedContact) {
    throw HttpError(404);
  }
  res.json({ message: "Contact deleted" });
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const newContact = await Contact.create({ ...req.body, owner });
  res.status(201).json(newContact);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedContact) {
    throw HttpError(404);
  }
  res.json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedContact) {
    throw HttpError(404);
  }
  res.json(updatedContact);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
