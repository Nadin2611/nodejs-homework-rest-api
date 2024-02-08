import { Contact } from "../schemas/contactsSchemas.js";
import { HttpError, ctrlWrapper } from "../helpers/index.js";

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  const query = { owner };

  if (favorite !== undefined) {
    query.favorite = favorite === "true";
  }

  const allContacts = await Contact.find(query, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email");
  res.json(allContacts);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const contactById = await Contact.findOne(
    { _id: id, owner },
    "-createdAt -updatedAt"
  );

  if (!contactById) {
    throw HttpError(404);
  }

  res.json(contactById);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const deletedContact = await Contact.findOneAndDelete({ _id: id, owner });
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
  const { _id: owner } = req.user;

  const updatedContact = await Contact.findOneAndUpdate(
    { _id: id, owner },
    req.body,
    {
      new: true,
    }
  );

  if (!updatedContact) {
    throw HttpError(404);
  }
  res.json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const updatedContact = await Contact.findOneAndUpdate(
    { _id: id, owner },
    req.body,
    {
      new: true,
    }
  );

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
